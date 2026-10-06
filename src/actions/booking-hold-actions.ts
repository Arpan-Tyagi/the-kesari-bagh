'use server';

// Next.js Server Actions for 15-Minute Transient Inventory Holds & Direct Confirmations
import { EstateService } from '@/lib/services/estate-service';
import { WhatsAppDispatcher } from '@/lib/services/whatsapp-dispatcher';
import { EmailDispatcher } from '@/lib/services/email-dispatcher';
import { isSupabaseConfigured, createServerSupabaseClient } from '@/lib/supabase/server';

export async function createPendingReservationAction(input: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  addonIds?: string[];
  couponCode?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  idType?: string;
  specialRequests?: string;
  holdMinutes?: number;
}) {
  try {
    const res = EstateService.createPendingReservation(input);
    if (!res.success || !res.booking) {
      return { success: false, message: res.message };
    }

    if (isSupabaseConfigured()) {
      createServerSupabaseClient()
        .then((supabase) =>
          supabase.from('bookings').insert({
            id: res.booking!.id,
            reference_code: res.booking!.reference_code,
            room_id: res.booking!.room_id,
            guest_name: res.booking!.guest_name,
            guest_email: res.booking!.guest_email,
            guest_phone: res.booking!.guest_phone,
            guests_count: res.booking!.guests_count,
            check_in: res.booking!.check_in,
            check_out: res.booking!.check_out,
            room_rate_per_night: res.booking!.room_rate_per_night,
            nights_count: res.booking!.nights_count,
            addons_total: res.booking!.addons_total,
            discount_total: res.booking!.discount_total,
            tax_total: res.booking!.tax_total,
            total_price: res.booking!.total_price,
            status: 'pending',
            expires_at: res.booking!.expires_at,
            guest_id_type: res.booking!.id_type,
          })
        )
        .catch((err) => console.warn('[Supabase Sync Warn]:', err));
    }

    return {
      success: true,
      booking: res.booking,
      referenceCode: res.booking.reference_code,
      expiresAt: res.booking.expires_at,
      paymentUrl: res.paymentUrl,
      message: res.message,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to establish inventory hold';
    return { success: false, message: msg };
  }
}

export async function confirmBookingDirectAction(referenceCodeOrId: string) {
  try {
    const res = EstateService.confirmBookingDirect(referenceCodeOrId);
    if (!res.success || !res.booking) {
      return { success: false, message: res.message };
    }

    const booking = res.booking;
    const room = booking.room || EstateService.getRoomById(booking.room_id);
    const roomName = room ? room.name : 'Exclusive Estate Suite';

    Promise.allSettled([
      WhatsAppDispatcher.sendBookingConfirmation(booking, roomName),
      EmailDispatcher.sendBookingConfirmation(booking, roomName),
    ]).catch((err) => console.error('Dispatch error:', err));

    if (isSupabaseConfigured()) {
      createServerSupabaseClient()
        .then((supabase) =>
          supabase
            .from('bookings')
            .update({ status: 'confirmed', expires_at: null })
            .eq('reference_code', booking.reference_code)
        )
        .catch((err) => console.warn('[Supabase Sync Warn]:', err));
    }

    return {
      success: true,
      booking,
      referenceCode: booking.reference_code,
      room,
      message: res.message,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to confirm reservation';
    return { success: false, message: msg };
  }
}
