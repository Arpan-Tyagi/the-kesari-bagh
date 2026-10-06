// Admin Gemini Content Studio API Route: Google Gemini 1.5 Pro Marketing Generation
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiGenerateArticleSchema } from '@/lib/validations/blog';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = geminiGenerateArticleSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid generation parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { topic, tone, targetKeywords, additionalNotes } = parsed.data;
    const apiKey = process.env.GEMINI_API_KEY;

    let title = topic;
    let excerpt = '';
    let markdownContent = '';

    const promptInstructions = `You are the Lead Editorial Director for "The Kesari Bagh", an ultra-luxury French-colonial countryside estate in the Aravalli foothills of Manesar, Gurugram.
Write a captivating, high-end editorial journal article in Markdown.
Topic: ${topic}
Tone: ${tone}
Target Keywords: ${targetKeywords.join(', ')}
${additionalNotes ? `Special Instructions: ${additionalNotes}` : ''}

Format your output EXACTLY as valid JSON with three keys:
{
  "title": "A poetic, magnetic title",
  "excerpt": "A 2-sentence sophisticated summary (max 40 words)",
  "content": "Complete, lavish markdown content (500+ words) with elegant subheadings (##, ###), bullet points, and sensory details about French-colonial architecture, Elly the Marwari horse, or the Aravallis."
}`;

    if (apiKey && apiKey !== 'demo_gemini_key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-pro',
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });

        const result = await model.generateContent(promptInstructions);
        const text = result.response.text();
        const parsedJson = JSON.parse(text);

        title = parsedJson.title || topic;
        excerpt = parsedJson.excerpt || '';
        markdownContent = parsedJson.content || '';
      } catch (geminiError) {
        console.warn('[Gemini 1.5 Pro Fallback Triggered]:', geminiError);
        const fallback = generateFallbackArticle(topic, tone);
        title = fallback.title;
        excerpt = fallback.excerpt;
        markdownContent = fallback.content;
      }
    } else {
      const fallback = generateFallbackArticle(topic, tone);
      title = fallback.title;
      excerpt = fallback.excerpt;
      markdownContent = fallback.content;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return NextResponse.json({
      title,
      slug,
      excerpt,
      content: markdownContent,
      coverImage: '/images/hero-estate-facade.jpg',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Content studio generation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function generateFallbackArticle(topic: string, tone: string) {
  const toneLabel = tone.replace(/_/g, ' ');
  return {
    title: `The Poetry of Manesar: Reflections on ${topic}`,
    excerpt: `An intimate exploration into ${topic} at The Kesari Bagh, articulated with ${toneLabel} elegance where French-colonial refinement intertwines with the serenity of the Aravalli foothills.`,
    content: `# The Poetry of Manesar: Reflections on ${topic}

At The Kesari Bagh, luxury is articulated not through ostentation, but through profound space, silence, and architectural intent. Spread across 1.25 manicured acres in the countryside of Manesar, Gurugram, this sanctuary holds merely **four keys**.

## Countryside Solitude & French Symmetry
Every corner of the estate honors the harmony between classical French-colonial symmetry and the rustic allure of Haryana's ancient hillocks:
- High French casement doors framing the emerald 1-acre lawns
- Handcrafted brass hairlines catching the golden hour light
- An intimate 12-seater dining salon adorned by an antique crystal chandelier

## The Spirit of the Estate
Whether awakening to the gentle neigh of our 6ft 7in Marwari mare **Elly**, or savoring live farm-to-table skewers under the starlit night sky, each moment unfolds with quiet magnificence.

### An Unhurried Invitation
Here, far from the urban rush of Delhi and Gurugram, time yields to the natural rhythm of the countryside. We invite you to experience hospitality redefined by absolute seclusion and bespoke grace.`,
  };
}
