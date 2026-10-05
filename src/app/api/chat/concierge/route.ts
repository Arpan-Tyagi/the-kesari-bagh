// Customer Concierge Chatbot Route: Google Gemini 1.5 Flash Grounded Assistant
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { chatMessageSchema } from '@/lib/validations/chat';
import { ESTATE_DETAILS } from '@/lib/data/mock-estate-data';

export const runtime = 'nodejs';

const SYSTEM_GROUNDING_PROMPT = `You are the Estate Concierge AI for "The Kesari Bagh" (https://thekesaribagh.com/), an exclusive French-colonial boutique countryside estate located in the Aravalli foothills of Manesar, Gurugram.
Tone: Warm, aristocratic, impeccably courteous, refined French-colonial hospitality.

Key Estate Facts:
- Location: Panchgaon-Mohamadpur Road, NH 8, behind Best Western Resort Country Club, Village Para, Manesar, Gurugram, Haryana 122105.
- Architecture: French-colonial countryside estate, 1.25 acres with 1-acre manicured lawn, neem and oak trees facing the Aravallis.
- Accommodation Units (Only 4 Keys, Max 16 guests estate capacity):
  1. "Luxury Garden Facing Pool View Room": Ground floor, 30.56 m² (328.9 sq ft), king bed, private sit-out lawn overlooking the pool. (₹15,000/night)
  2. "Luxury Aravalli Facing Pool View Room": First floor, 32.72 m² (352.2 sq ft), king bed, private terrace view of Aravalli range and pool. (₹18,000/night)
  3. "Luxury Kitchen Garden Facing View Room": Ground floor, 27.59 m² (297 sq ft), king bed, opens to organic kitchen garden. (₹14,000/night)
  4. "Luxury Lush Green Facing View Room": First floor, 27.59 m² (297 sq ft), king bed, panoramic estate garden views. (₹16,000/night)
- Dining: 12-seater private indoor dining room under French crystal chandelier, under-the-sky dining, live barbecue grill, farm picnics.
- Curated Experiences:
  - Encounter with "Elly-Black Beauty" (6ft 7in Marwari bloodline mare).
  - Motorized Aravalli paragliding adventure.
  - Recreation: Snooker, table tennis, carrom, board games, library retreat, kids zone.
- Policies: Non-smoking retreat (designated areas only), strictly no pets, standard check-in at 2:00 PM, check-out at 11:00 AM.
- Contact / WhatsApp Concierge: +91 98100 00000.

Guidelines:
- If guest inquires about bookings, suggest our 4 authentic keys and direct them to the online booking bar or our WhatsApp concierge (+91 98100 00000).
- If guest asks to speak to human or requests bespoke arrangements, provide the WhatsApp escalation link: https://wa.me/919810000000?text=Hello%20The%20Kesari%20Bagh%20Concierge
- Always maintain refined French-colonial estate elegance.`;

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = chatMessageSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid message structure' }, { status: 400 });
    }

    const { message, history } = parsed.data;
    const apiKey = process.env.GEMINI_API_KEY;
    const wantsStream =
      req.nextUrl.searchParams.get('stream') === 'true' ||
      req.headers.get('accept')?.includes('text/event-stream');

    let escalateToWhatsApp = false;
    const humanKeywords = ['human', 'manager', 'speak to someone', 'call', 'whatsapp', 'phone', 'event wedding', 'custom quote'];
    if (humanKeywords.some((kw) => message.toLowerCase().includes(kw))) {
      escalateToWhatsApp = true;
    }

    const whatsappUrl = escalateToWhatsApp
      ? `https://wa.me/${ESTATE_DETAILS.contact.whatsapp}?text=${encodeURIComponent(`Inquiry from web concierge: ${message}`)}`
      : undefined;

    if (wantsStream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          if (apiKey && apiKey !== 'demo_gemini_key') {
            try {
              const genAI = new GoogleGenerativeAI(apiKey);
              const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                systemInstruction: SYSTEM_GROUNDING_PROMPT,
              });
              const formattedHistory = history.map((h) => ({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }],
              }));
              const chat = model.startChat({ history: formattedHistory });
              const resultStream = await chat.sendMessageStream(message);
              for await (const chunk of resultStream.stream) {
                const chunkText = chunk.text();
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`));
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, whatsappUrl })}\n\n`));
              controller.close();
              return;
            } catch (geminiError) {
              console.warn('[Gemini Stream Fallback Activated]:', geminiError);
            }
          }

          const fallbackText = generateFallbackResponse(message);
          const words = fallbackText.split(' ');
          for (let i = 0; i < words.length; i++) {
            const token = words[i] + (i < words.length - 1 ? ' ' : '');
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: token })}\n\n`));
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, whatsappUrl })}\n\n`));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Non-streaming fallback
    let replyText = '';
    if (apiKey && apiKey !== 'demo_gemini_key') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_GROUNDING_PROMPT,
        });
        const formattedHistory = history.map((h) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        }));
        const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessage(message);
        replyText = result.response.text();
      } catch (geminiError) {
        console.warn('[Gemini API Fallback Activated]:', geminiError);
        replyText = generateFallbackResponse(message);
      }
    } else {
      replyText = generateFallbackResponse(message);
    }

    return NextResponse.json({
      content: replyText,
      metadata: {
        escalated_to_whatsapp: escalateToWhatsApp,
        whatsapp_url: whatsappUrl,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Concierge service error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function generateFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('pet') || q.includes('dog') || q.includes('cat')) {
    return 'The Kesari Bagh maintains a strictly pet-free policy across the 1.25-acre estate to safeguard our equestrian sanctuary and manicured gardens. We appreciate your gracious understanding.';
  }
  if (q.includes('check in') || q.includes('check out') || q.includes('time') || q.includes('hours')) {
    return 'At The Kesari Bagh, check-in commences at 2:00 PM to ensure suites are impeccably prepared, and check-out is observed at 11:00 AM. Early arrivals are welcome to relax in our library or open-air lounge.';
  }
  if (q.includes('room') || q.includes('suite') || q.includes('stay') || q.includes('tariffs') || q.includes('price')) {
    return 'The Kesari Bagh offers exactly four keys for complete seclusion: Luxury Garden Facing Pool View (Ground, ₹15,000), Luxury Aravalli Facing Pool View (First, ₹18,000), Luxury Kitchen Garden Facing (Ground, ₹14,000), and Luxury Lush Green Facing (First, ₹16,000). You may reserve directly via our booking bar.';
  }
  if (q.includes('horse') || q.includes('elly')) {
    return 'Elly is our majestic 6ft 7in Marwari bloodline mare with signature inward-curling ears. Guests may enjoy sunrise paddock grooming, serene walks, and private equestrian portraiture during their stay.';
  }
  if (q.includes('paraglid') || q.includes('adventure')) {
    return 'We coordinate motorized paragliding sorties soaring over the picturesque Aravalli range in Manesar with certified aviators. This experience can be seamlessly reserved alongside your room suite.';
  }
  if (q.includes('food') || q.includes('dining') || q.includes('dinner') || q.includes('bbq')) {
    return 'Culinary offerings include our 12-seater indoor French crystal chandelier dining hall, open-air countryside barbecue under the stars, and artisanal farm picnics prepared with fresh kitchen garden harvests.';
  }
  if (q.includes('location') || q.includes('reach') || q.includes('direction') || q.includes('delhi')) {
    return 'The Kesari Bagh is nestled on Panchgaon-Mohamadpur Road, NH 8, behind Best Western Resort Country Club, Village Para, Manesar. It is an effortless 45-minute drive from Gurugram Cyber Hub and 60 minutes from Delhi IGI Airport.';
  }

  return 'Welcome to The Kesari Bagh. We are an intimate 4-key French-colonial countryside retreat in Manesar. How may I assist you with your suite reservation, culinary preferences, or equestrian experiences with Elly today?';
}
