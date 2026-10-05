'use server';

// Next.js Server Actions for Estate Administration Control Center
import { EstateService } from '@/lib/services/estate-service';
import { adminCouponSchema } from '@/lib/validations/coupon';
import { BookingStatus } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function updateRoomPricingAction(
  roomId: string,
  basePrice: number,
  weekendPrice: number
) {
  try {
    if (basePrice <= 0 || weekendPrice <= 0) {
      return { success: false, message: 'Tariff values must be positive numbers' };
    }
    const updated = EstateService.updateRoomPrice(roomId, basePrice, weekendPrice);
    if (!updated) {
      return { success: false, message: 'Room not found' };
    }
    revalidatePath('/admin');
    revalidatePath('/admin/inventory');
    revalidatePath('/');
    return { success: true, message: 'Room pricing updated successfully' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update pricing';
    return { success: false, message: msg };
  }
}

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus
) {
  try {
    const updated = EstateService.updateBookingStatus(bookingId, status);
    if (!updated) {
      return { success: false, message: 'Booking not found' };
    }
    revalidatePath('/admin');
    revalidatePath('/admin/reservations');
    return { success: true, message: `Reservation marked as ${status}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update status';
    return { success: false, message: msg };
  }
}

export async function createPromotionCouponAction(input: unknown) {
  try {
    const parsed = adminCouponSchema.parse(input);
    const coupons = EstateService.getCoupons();
    const exists = coupons.some((c) => c.code === parsed.code);
    if (exists) {
      return { success: false, message: 'Coupon code already exists' };
    }

    coupons.push({
      id: `coupon-${Date.now()}`,
      code: parsed.code,
      discount_type: parsed.discount_type,
      discount_value: parsed.discount_value,
      valid_from: parsed.valid_from,
      valid_until: parsed.valid_until,
      min_booking_amount: parsed.min_booking_amount,
      max_discount_amount: parsed.max_discount_amount,
      usage_limit: parsed.usage_limit,
      used_count: 0,
      is_active: parsed.is_active,
    });

    revalidatePath('/admin/coupons');
    return { success: true, message: `Coupon ${parsed.code} created successfully` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Coupon creation failed';
    return { success: false, message: msg };
  }
}

export async function updateInquiryStatusAction(
  inquiryId: string,
  status: 'new' | 'contacted' | 'scheduled' | 'closed'
) {
  try {
    const updated = EstateService.updateInquiryStatus(inquiryId, status);
    if (!updated) {
      return { success: false, message: 'Inquiry not found' };
    }
    revalidatePath('/admin');
    return { success: true, message: `Inquiry status updated to ${status}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update inquiry';
    return { success: false, message: msg };
  }
}
