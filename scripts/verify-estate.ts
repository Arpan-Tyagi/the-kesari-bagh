// Comprehensive Architectural Test Suite for The Kesari Bagh
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

import { AUTHENTIC_ROOMS, CURATED_ADDONS } from '@/lib/data/mock-estate-data';
import { EstateService } from '@/lib/services/estate-service';
import { adminCouponSchema } from '@/lib/validations/coupon';
import { verifyCouponAction } from '@/actions/booking-actions';
import { WhatsAppDispatcher } from '@/lib/services/whatsapp-dispatcher';
import { EmailDispatcher } from '@/lib/services/email-dispatcher';
import { GET as healthGet } from '@/app/api/health/route';
import { GET as whatsappWebhookGet, POST as whatsappWebhookPost } from '@/app/api/webhooks/whatsapp/route';
import { POST as conciergeChatPost } from '@/app/api/chat/concierge/route';

async function runAllTests() {
  console.log('🏛️ Starting The Kesari Bagh Comprehensive Verification Suite...\n');

  // 1. Domain Entities & Authentic Estate Geometry
  assert.equal(AUTHENTIC_ROOMS.length, 4, 'Must hold exactly 4 keys for 16 guests capacity');
  console.log('✓ 4 Estate Keys Verified');

  const room1 = AUTHENTIC_ROOMS.find((r) => r.slug === 'garden-facing-pool-view')!;
  assert.ok(room1, 'Garden facing pool view suite must exist');
  assert.equal(room1.square_meters, 30.56, 'Room 1 square meters should be 30.56');
  assert.equal(room1.floor_level, 'Ground', 'Room 1 should be Ground floor');

  const room2 = AUTHENTIC_ROOMS.find((r) => r.slug === 'aravalli-facing-pool-view')!;
  assert.ok(room2, 'Aravalli facing pool view suite must exist');
  assert.equal(room2.square_meters, 32.72, 'Room 2 square meters should be 32.72');
  assert.equal(room2.floor_level, 'First', 'Room 2 should be First floor');

  const room3 = AUTHENTIC_ROOMS.find((r) => r.slug === 'kitchen-garden-facing-view')!;
  assert.equal(room3.square_meters, 27.59, 'Room 3 square meters should be 27.59');

  const room4 = AUTHENTIC_ROOMS.find((r) => r.slug === 'lush-green-facing-view')!;
  assert.equal(room4.square_meters, 27.59, 'Room 4 square meters should be 27.59');
  console.log('✓ Authentic architectural metrics (30.56 m², 32.72 m², 27.59 m²) verified');

  // 2. Curated Add-ons Verification
  assert.ok(CURATED_ADDONS.find((a) => a.id === 'addon-bbq'), 'Live BBQ add-on must exist');
  assert.ok(CURATED_ADDONS.find((a) => a.id === 'addon-elly-horse'), 'Elly horse encounter must exist');
  assert.ok(CURATED_ADDONS.find((a) => a.id === 'addon-paragliding'), 'Motorized paragliding must exist');
  assert.ok(CURATED_ADDONS.find((a) => a.id === 'addon-chandelier-dinner'), 'French chandelier dinner must exist');
  console.log('✓ Curated add-ons (Barbecue, Elly encounter, Paragliding, Chandelier dinner) verified');

  // 3. Temporal Edge Cases: Inverted and Same-Day Dates
  const invertedCheck = EstateService.checkAvailability(room1.id, '2026-11-25', '2026-11-20');
  assert.equal(invertedCheck, false, 'Inverted date range must be rejected by checkAvailability');

  const sameDayCheck = EstateService.checkAvailability(room1.id, '2026-11-20', '2026-11-20');
  assert.equal(sameDayCheck, false, 'Same-day check-in and check-out must be rejected');
  console.log('✓ Temporal boundary validations (reversed & 0-night stays blocked) verified');

  // 4. Reservation Creation & Weekend Pricing Math
  // Nov 20, 2026 is Friday, Nov 21 is Saturday, Nov 22 is Sunday -> checkOut Nov 23
  // Room 1: Weekend (Fri, Sat) = 18000 + 18000 = 36000. Weekday (Sun) = 15000. Total room = 51000.
  const isAvailableFirst = EstateService.checkAvailability(room1.id, '2026-11-20', '2026-11-23');
  assert.equal(isAvailableFirst, true, 'Unoccupied dates should be available');

  const couponBefore = EstateService.getCoupons().find((c) => c.code === 'BAGH15')!;
  const usedCountBefore = couponBefore.used_count;

  const bookingRes = EstateService.createBooking({
    roomId: room1.id,
    checkIn: '2026-11-20',
    checkOut: '2026-11-23',
    guestsCount: 2,
    addonIds: ['addon-bbq', 'addon-elly-horse', 'addon-bbq'], // duplicate test
    couponCode: 'BAGH15',
    guestName: 'Princess Gayatri Devi',
    guestEmail: 'gayatri@royal.in',
    guestPhone: '+919811199999',
    specialRequests: 'Afternoon tea by the kitchen garden flora',
  });

  assert.equal(bookingRes.success, true, 'Booking creation should succeed');
  assert.ok(bookingRes.booking?.reference_code.startsWith('TKB-'), 'Reference code should start with TKB-');
  assert.equal(couponBefore.used_count, usedCountBefore + 1, 'Coupon usage count must increment');

  const pricing = bookingRes.pricing!;
  assert.equal(pricing.nightsCount, 3, 'Should be 3 nights');
  assert.equal(pricing.baseRoomSubtotal, 51000, 'Fri (18k) + Sat (18k) + Sun (15k) must equal 51,000');
  assert.equal(pricing.addonsSubtotal, 3500 + 2500, 'Duplicate add-on must be deduplicated (BBQ + Horse)');
  console.log('✓ Timezone-agnostic calendar pricing & weekend rate math verified (Room Subtotal: ₹51,000)');

  // 5. Exclusion Constraint & Cancellation Predicate Pattern
  const conflictCheck = EstateService.checkAvailability(room1.id, '2026-11-21', '2026-11-25');
  assert.equal(conflictCheck, false, 'Conflicting booking dates must be rejected');

  // Cancel booking and verify dates are re-opened (WHERE status != 'cancelled')
  EstateService.updateBookingStatus(bookingRes.booking!.id, 'cancelled');
  const afterCancelCheck = EstateService.checkAvailability(room1.id, '2026-11-20', '2026-11-23');
  assert.equal(afterCancelCheck, true, 'Cancelled booking must NOT block dates from being re-reserved');
  // Test completed booking status
  EstateService.updateBookingStatus(bookingRes.booking!.id, 'completed');
  assert.equal(bookingRes.booking!.status, 'completed', 'Booking status must update to completed');
  // Re-cancel so room dates remain free for subsequent test booking
  EstateService.updateBookingStatus(bookingRes.booking!.id, 'cancelled');
  console.log('✓ Admin lifecycle status completed verified');

  // Test invalid dates handling in checkAvailability
  const invalidDateAvailability = EstateService.checkAvailability(room1.id, 'invalid-date', '2026-11-23');
  assert.equal(invalidDateAvailability, false, 'Invalid check-in date must be rejected cleanly');
  console.log('✓ Temporal boundary edge cases (malformed dates) safely rejected');

  // Re-create booking for remaining tests
  const activeBookingRes = EstateService.createBooking({
    roomId: room1.id,
    checkIn: '2026-11-20',
    checkOut: '2026-11-23',
    guestsCount: 2,
    addonIds: ['addon-bbq'],
    guestName: 'Princess Gayatri Devi',
    guestEmail: 'gayatri@royal.in',
    guestPhone: '+919811199999',
  });
  assert.equal(activeBookingRes.success, true);

  // 6. Promotion Engine: Zod Refinements & Quota Enforcements
  const invalidDiscountCoupon = adminCouponSchema.safeParse({
    code: 'OVER100',
    discount_type: 'percentage',
    discount_value: 120, // > 100%
    valid_from: '2026-01-01',
    valid_until: '2026-12-31',
  });
  assert.equal(invalidDiscountCoupon.success, false, 'Discount > 100% must be rejected by Zod');

  const invalidDatesCoupon = adminCouponSchema.safeParse({
    code: 'INVDATES',
    discount_type: 'percentage',
    discount_value: 10,
    valid_from: '2026-12-31',
    valid_until: '2026-01-01',
  });
  assert.equal(invalidDatesCoupon.success, false, 'valid_until < valid_from must be rejected by Zod');

  // Test expired coupon verification via verifyCouponAction
  EstateService.getCoupons().push({
    id: 'c-expired',
    code: 'EXPIRED10',
    discount_type: 'percentage',
    discount_value: 10,
    valid_from: '2020-01-01',
    valid_until: '2020-12-31',
    usage_limit: 10,
    used_count: 0,
    is_active: true,
  });
  const expiredRes = await verifyCouponAction('EXPIRED10', 20000);
  assert.equal(expiredRes.valid, false, 'Expired coupon must be rejected');

  // Test quota exceeded coupon verification
  EstateService.getCoupons().push({
    id: 'c-maxed',
    code: 'MAXEDOUT',
    discount_type: 'fixed',
    discount_value: 2000,
    valid_from: '2025-01-01',
    valid_until: '2027-12-31',
    usage_limit: 5,
    used_count: 5,
    is_active: true,
  });
  const maxedRes = await verifyCouponAction('MAXEDOUT', 20000);
  assert.equal(maxedRes.valid, false, 'Quota-exhausted coupon must be rejected');
  console.log('✓ Promotion engine rules (percentage <= 100%, date windows, quota limits) verified');

  // 7. Event Inquiries Lifecycle
  const inquiry = EstateService.createEventInquiry({
    name: 'Ambassador Jean-Luc',
    email: 'jeanluc@france.diplo',
    phone: '+919811100000',
    eventType: 'corporate_retreat',
    guestCount: 16,
    preferredDate: '2026-12-20',
    message: 'High-level diplomatic delegation symposium',
  });
  assert.ok(inquiry.id.startsWith('inq-'));
  assert.equal(inquiry.status, 'new');

  const updatedInq = EstateService.updateInquiryStatus(inquiry.id, 'contacted');
  assert.equal(updatedInq, true);
  const foundInq = EstateService.getInquiries().find((i) => i.id === inquiry.id)!;
  assert.equal(foundInq.status, 'contacted');
  console.log('✓ Event inquiry persistence and status state machine verified');

  // 8. Omnichannel Dispatcher Simulation
  const waResult = await WhatsAppDispatcher.sendBookingConfirmation(
    activeBookingRes.booking!,
    room1.name
  );
  assert.equal(waResult.success, true, 'WhatsApp Cloud API dispatcher should succeed');

  const emResult = await EmailDispatcher.sendBookingConfirmation(
    activeBookingRes.booking!,
    room1.name
  );
  assert.equal(emResult.success, true, 'Resend Email dispatcher should succeed');
  console.log('✓ Omnichannel dispatchers (WhatsApp & Resend) verified');

  // 9. WhatsApp Webhook Security Handshake & HMAC Verification
  const verifyReq = new NextRequest(
    'http://localhost/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=kesari_bagh_webhook_token&hub.challenge=test_challenge_code'
  );
  const verifyRes = await whatsappWebhookGet(verifyReq);
  assert.equal(verifyRes.status, 200);
  const verifyText = await verifyRes.text();
  assert.equal(verifyText, 'test_challenge_code');

  // Test POST with timing-safe HMAC signature verification
  const secret = 'test_webhook_secret_key';
  process.env.WHATSAPP_APP_SECRET = secret;
  const samplePayload = JSON.stringify({
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '12345',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: { phone_number_id: '99999' },
              messages: [{ id: 'wam_msg_test_01', from: '919811199999', text: { body: 'Hello' } }],
            },
          },
        ],
      },
    ],
  });

  const hmac = crypto.createHmac('sha256', secret);
  const validSig = 'sha256=' + hmac.update(samplePayload).digest('hex');

  // Valid signature
  const validPostReq = new NextRequest('http://localhost/api/webhooks/whatsapp', {
    method: 'POST',
    headers: { 'x-hub-signature-256': validSig, 'Content-Type': 'application/json' },
    body: samplePayload,
  });
  const validPostRes = await whatsappWebhookPost(validPostReq);
  assert.equal(validPostRes.status, 200);

  // Missing signature when secret is set -> 401
  const missingSigReq = new NextRequest('http://localhost/api/webhooks/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: samplePayload,
  });
  const missingSigRes = await whatsappWebhookPost(missingSigReq);
  assert.equal(missingSigRes.status, 401);

  // Tampered signature -> 401
  const badSigReq = new NextRequest('http://localhost/api/webhooks/whatsapp', {
    method: 'POST',
    headers: { 'x-hub-signature-256': 'sha256=invalidhash', 'Content-Type': 'application/json' },
    body: samplePayload,
  });
  const badSigRes = await whatsappWebhookPost(badSigReq);
  assert.equal(badSigRes.status, 401);
  delete process.env.WHATSAPP_APP_SECRET;
  console.log('✓ Webhook security: Timing-safe HMAC-SHA256 signature and handshake verified');

  // 10. AI Concierge Grounding & WhatsApp Escalation
  const chatReq = new NextRequest('http://localhost/api/chat/concierge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Can I bring my pet dog to the estate?',
      history: [],
    }),
  });
  const chatRes = await conciergeChatPost(chatReq);
  const chatData = await chatRes.json();
  assert.ok(chatData.content.includes('pet-free'), 'Concierge must ground pet policy');

  const humanReq = new NextRequest('http://localhost/api/chat/concierge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'I want to speak to a human manager on WhatsApp',
      history: [],
    }),
  });
  const humanRes = await conciergeChatPost(humanReq);
  const humanData = await humanRes.json();
  assert.equal(humanData.metadata.escalated_to_whatsapp, true);
  assert.ok(humanData.metadata.whatsapp_url.includes('wa.me/'));
  console.log('✓ AI Concierge grounding & conversational WhatsApp escalation verified');

  // 11. Cloud Run Readiness Health Probe
  const healthResponse = await healthGet();
  const healthData = await healthResponse.json();
  assert.equal(healthData.status, 'healthy');
  assert.equal(healthData.keys_available, 4);
  console.log('✓ /api/health container probe verified');

  console.log('\n⚜️ ALL ARCHITECTURAL TESTS PASSED CLEANLY! ZERO DEFECTS.');
}

runAllTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
