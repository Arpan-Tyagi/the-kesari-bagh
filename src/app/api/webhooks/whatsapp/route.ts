// Meta WhatsApp Cloud API Webhook Handler
// Implements 3-second acknowledgement window, HMAC SHA256 signature verification, and wam_id idempotency

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { WhatsAppBookingEngine } from '@/lib/services/whatsapp-bot';
import { WhatsAppDispatcher } from '@/lib/services/whatsapp-dispatcher';

export const runtime = 'nodejs';

// In-memory LRU set for wam_id idempotency tracking
const processedMessageIds = new Set<string>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'kesari_bagh_webhook_token';

  if (mode === 'subscribe' && token === expectedToken) {
    if (!challenge) {
      return NextResponse.json({ error: 'Missing challenge token' }, { status: 400 });
    }
    console.log('[WhatsApp Webhook Verified Successfully]');
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');
    const appSecret = process.env.WHATSAPP_APP_SECRET;

    // Secure timing-safe HMAC-SHA256 signature verification
    if (appSecret) {
      if (!signature) {
        console.warn('[WhatsApp Missing Signature Header]');
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      const hmac = crypto.createHmac('sha256', appSecret);
      const digest = 'sha256=' + hmac.update(rawBody).digest('hex');

      const sigBuffer = Buffer.from(signature);
      const digestBuffer = Buffer.from(digest);

      if (
        sigBuffer.length !== digestBuffer.length ||
        !crypto.timingSafeEqual(sigBuffer, digestBuffer)
      ) {
        console.warn('[WhatsApp Signature Mismatch]');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    // CRITICAL RESILIENCY: Acknowledge Meta immediately within the 3-second SLA
    // Process messages asynchronously to prevent Meta retry storms
    processWebhookPayloadAsync(payload).catch((err) => {
      console.error('[Async Webhook Processing Error]:', err);
    });

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (err: unknown) {
    console.error('[WhatsApp Webhook Parse Error]:', err);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}

async function processWebhookPayloadAsync(payload: Record<string, unknown>) {
  const entry = Array.isArray(payload.entry) ? payload.entry[0] : null;
  const changes = entry && Array.isArray(entry.changes) ? entry.changes[0] : null;
  const value = changes && typeof changes.value === 'object' ? changes.value : null;

  if (!value || !Array.isArray(value.messages) || value.messages.length === 0) {
    return;
  }

  for (const message of value.messages) {
    const messageId = message.id; // Meta wam_id

    // Idempotency check: Skip duplicate webhook delivery from Meta
    if (processedMessageIds.has(messageId)) {
      console.log(`[Idempotency Hit] Skipping already processed message ${messageId}`);
      continue;
    }

    // Mark as processed
    processedMessageIds.add(messageId);
    if (processedMessageIds.size > 10000) {
      const first = processedMessageIds.values().next().value;
      if (first) processedMessageIds.delete(first);
    }

    const fromPhone = message.from;
    const textBody = message.text?.body || '';
    const messageType = message.type || 'text';

    console.log(`[WhatsApp Incoming Message] from=${fromPhone} id=${messageId} body="${textBody}"`);

    // Execute Aarav conversational state machine
    try {
      const { reply } = await WhatsAppBookingEngine.handleIncomingMessage({
        from: fromPhone,
        text: textBody,
        messageType,
      });

      // Dispatch reply through WhatsApp Cloud API / Mock
      if (reply) {
        await WhatsAppDispatcher.sendTextMessage(fromPhone, reply);
      }
    } catch (engineError) {
      console.error('[WhatsApp Booking Engine Processing Error]:', engineError);
    }
  }
}
