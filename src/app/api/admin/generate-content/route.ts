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

    const { type, topic, tone, targetKeywords, additionalNotes, roomId } = parsed.data;
    const apiKey = process.env.GEMINI_API_KEY;

    // Room Copy Generation
    if (type === 'room_copy') {
      const roomSlug = (roomId || 'luxury-garden-facing-pool-view')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');

      let roomCopy = {
        type: 'room_copy',
        roomId: roomId || 'room-1-garden-pool',
        slug: roomSlug,
        title: topic.includes('Suite') || topic.includes('Room') ? topic : `${topic} Suite`,
        short_description: `An expansive countryside haven with private outdoor sit-outs framing ${topic}.`,
        description: `Commanding refined architectural symmetry, this royal suite is finished in polished teakwood, handcrafted brass detailing, and French casement doors. Guests enjoy direct panoramic vistas, plush king-size bedding, and bespoke countryside tranquility.`,
        highlights: [
          'Handcrafted teakwood appointments & brass hairlines',
          'Private sit-out overlooking estate gardens and pool',
          'En-suite bathroom with artisan organic bath amenities',
        ],
        formatted_markdown: `### ${topic}\n\nCrafted with uncompromising French-colonial elegance, this sanctuary offers 30+ m² of curated living space. Wake up to gentle birdsong and countryside breezes.\n\n- **Bed:** Royal King-Size Master Bed\n- **Occupancy:** Up to 3 Adults\n- **Tariff:** From ₹15,000/night + 18% GST`,
        seoTags: ['Luxury Suite Manesar', 'Aravalli View Resort', 'The Bagh Luxury Rooms', 'Boutique Hotel Delhi NCR'],
      };

      if (apiKey && apiKey !== 'demo_gemini_key') {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            generationConfig: { responseMimeType: 'application/json' },
          });

          const prompt = `You are the Lead Architectural Copywriter for "The Bagh", an ultra-luxury French-colonial estate in Manesar.
Generate marketing product descriptions for the bedroom suite: "${topic}".
Format as valid JSON:
{
  "title": "${topic}",
  "short_description": "1 sentence teaser",
  "description": "Sophisticated narrative paragraph (80-120 words)",
  "highlights": ["3 bullet items"],
  "formatted_markdown": "### Heading and formatted bullet specifications",
  "seoTags": ["4 keywords"]
}`;

          const result = await model.generateContent(prompt);
          const parsedRes = JSON.parse(result.response.text());
          roomCopy = {
            ...roomCopy,
            title: parsedRes.title || roomCopy.title,
            short_description: parsedRes.short_description || roomCopy.short_description,
            description: parsedRes.description || roomCopy.description,
            highlights: parsedRes.highlights || roomCopy.highlights,
            formatted_markdown: parsedRes.formatted_markdown || roomCopy.formatted_markdown,
            seoTags: parsedRes.seoTags || roomCopy.seoTags,
          };
        } catch (geminiErr) {
          console.warn('[Gemini Room Copy Fallback Triggered]:', geminiErr);
        }
      }

      return NextResponse.json(roomCopy);
    }

    // Blog Article Generation
    let title = topic;
    let excerpt = '';
    let markdownContent = '';
    const seoTags = [
      ...targetKeywords,
      'The Bagh Manesar',
      'Aravalli Foothills Retreat',
      'French Colonial Estate',
      'Luxury Countryside Getaway',
    ];

    const promptInstructions = `You are the Lead Editorial Director for "The Bagh", an ultra-luxury French-colonial countryside estate in the Aravalli foothills of Manesar, Gurugram.
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
      type: 'blog_article',
      title,
      slug,
      excerpt,
      seoTags,
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
