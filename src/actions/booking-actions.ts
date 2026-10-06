'use server';

// Next.js Server Actions for Guest Booking Funnel, Pricing & Inquiries
import { bookingFormSchema, dateAvailabilitySchema } from '@/lib/validations/booking';
import { eventInquirySchema } from '@/lib/validations/inquiry';
import { verifyCouponSchema } from '@/lib/validations/coupon';
import { EstateService } from '@/lib/services/estate-service';
import { WhatsAppDispatcher } from '@/lib/services/whatsapp-dispatcher';
import { EmailDispatcher } from '@/lib/services/email-dispatcher';
import { PricingBreakdown } from '@/types/booking';
import { isSupabaseConfigured, createServerSupabaseClient } from '@/lib/supabase/server';


export async function checkAvailabilityAction(input: unknown) {
  try {
    const parsed = dateAvailabilitySchema.parse(input);
    const isAvailable = EstateService.checkAvailability(parsed.roomId, parsed.checkIn, parsed.checkOut);
    return { success: true, isAvailable };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Availability verification failed';
    return { success: false, isAvailable: false, error: msg };
  }
}

export async function calculatePricingAction(
  roomId: string,
  checkIn: string,
  checkOut: string,
  addonIds: string[] = [],
  couponCode?: string
): Promise<{ success: boolean; pricing?: PricingBreakdown; error?: string }> {
  try {
    const room = EstateService.getRoomById(roomId);
    if (!room) return { success: false, error: 'Suite not found' };
    const pricing = EstateService.calculatePricing(room, checkIn, checkOut, addonIds, couponCode);
    return { success: true, pricing };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Pricing calculation failed';
    return { success: false, error: msg };
  }
}

export async function verifyCouponAction(code: string, subtotal: number) {
  try {
    const parsed = verifyCouponSchema.parse({ code, bookingSubtotal: subtotal });
    const coupons = EstateService.getCoupons();
    const match = coupons.find((c) => c.code.toUpperCase() === parsed.code.toUpperCase() && c.is_active);

    if (!match) return { success: false, valid: false, message: 'Invalid or inactive promotional code' };

    const now = new Date().toISOString();
    if (match.valid_from && match.valid_from > now) {
      return { success: false, valid: false, message: 'Promotional privilege is not yet active' };
    }
    if (match.valid_until && match.valid_until < now) {
      return { success: false, valid: false, message: 'Promotional privilege has expired' };
    }
    if (match.usage_limit != null && match.used_count >= match.usage_limit) {
      return { success: false, valid: false, message: 'Promotional privilege usage quota has been reached' };
    }
    if (match.min_booking_amount && subtotal < match.min_booking_amount) {
      return {
        success: false,
        valid: false,
        message: `Minimum tariff requirement of ₹${match.min_booking_amount.toLocaleString('en-IN')} not reached`,
      };
    }

    let discountAmount = 0;
    if (match.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * match.discount_value) / 100);
      if (match.max_discount_amount) discountAmount = Math.min(discountAmount, match.max_discount_amount);
    } else {
      discountAmount = Math.min(match.discount_value, subtotal);
    }

    return { success: true, valid: true, discountAmount, coupon: match, message: `Coupon ${match.code} applied successfully` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Coupon verification failed';
    return { success: false, valid: false, message: msg };
  }
}

export async function createBookingAction(input: unknown) {
  try {
    const validatedData = bookingFormSchema.parse(input);
    const room = EstateService.getRoomById(validatedData.roomId);
    if (!room) return { success: false, error: 'Selected room not found' };

    const isAvailable = EstateService.checkAvailability(validatedData.roomId, validatedData.checkIn, validatedData.checkOut);
    if (!isAvailable) {
      return { success: false, error: 'This room is no longer available for the selected dates' };
    }

    const bookingRes = EstateService.createBooking(validatedData);
    const booking = bookingRes.booking;

    Promise.allSettled([
      WhatsAppDispatcher.sendBookingConfirmation(booking, room.name),
      EmailDispatcher.sendBookingConfirmation(booking, room.name),
    ]).catch((err) => console.error('Notification dispatch warning:', err));

    if (isSupabaseConfigured()) {
      createServerSupabaseClient()
        .then((supabase) =>
          supabase.from('bookings').insert({
            id: booking.id,
            reference_code: booking.reference_code,
            room_id: booking.room_id,
            guest_name: booking.guest_name,
            guest_email: booking.guest_email,
            guest_phone: booking.guest_phone,
            guests_count: booking.guests_count,
            check_in: booking.check_in,
            check_out: booking.check_out,
            room_rate_per_night: booking.room_rate_per_night,
            nights_count: booking.nights_count,
            addons_total: booking.addons_total,
            discount_total: booking.discount_total,
            tax_total: booking.tax_total,
            total_price: booking.total_price,
            status: booking.status,
          })
        )
        .catch((err) => console.warn('[Supabase Sync Warn]:', err));
    }

    return { success: true, booking, referenceCode: booking.reference_code, message: 'Reservation confirmed successfully' };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during reservation';
    return { success: false, error: errorMessage };
  }
}

export async function submitEventInquiryAction(input: unknown) {
  try {
    const parsed = eventInquirySchema.parse(input);
    const inquiry = EstateService.createEventInquiry(parsed);

    if (isSupabaseConfigured()) {
      createServerSupabaseClient()
        .then((supabase) =>
          supabase.from('event_inquiries').insert({
            id: inquiry.id,
            name: inquiry.name,
            email: inquiry.email,
            phone: inquiry.phone,
            event_type: inquiry.event_type,
            guest_count: inquiry.guest_count,
            preferred_date: inquiry.preferred_date,
            message: inquiry.message,
            status: inquiry.status,
          })
        )
        .catch((err) => console.warn('[Supabase Sync Warn]:', err));
    }

    return {
      success: true,
      inquiryId: inquiry.id,
      message: 'Your event inquiry has been received. Our Estate Director will contact you within 4 hours.',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to submit inquiry';
    return { success: false, message: msg };
  }
}
