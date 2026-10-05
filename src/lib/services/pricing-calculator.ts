// Pricing Calculation & Tax Math Engine for The Kesari Bagh
import { RoomEntity, CouponEntity, BookingAddonItem } from '@/types/database';
import { PricingBreakdown } from '@/types/booking';

export function parseLocalDate(dateStr: string): Date {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (
    isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error('Invalid calendar date');
  }
  return date;
}

export function calculateEstatePricing(
  room: RoomEntity,
  checkIn: string,
  checkOut: string,
  addonIds: string[] = [],
  curatedAddons: BookingAddonItem[] = [],
  availableCoupons: CouponEntity[] = [],
  couponCode?: string
): PricingBreakdown {
  const start = parseLocalDate(checkIn);
  const end = parseLocalDate(checkOut);
  const diffTime = end.getTime() - start.getTime();

  if (isNaN(diffTime) || diffTime <= 0) {
    throw new Error('Check-out date must follow check-in date');
  }

  const nightsCount = Math.round(diffTime / (1000 * 60 * 60 * 24));

  let totalRoomCost = 0;
  const cur = new Date(start.getTime());
  for (let i = 0; i < nightsCount; i++) {
    const day = cur.getDay();
    const isWeekend = day === 5 || day === 6; // Fri or Sat in local day
    totalRoomCost += isWeekend ? room.weekend_price : room.base_price;
    cur.setDate(cur.getDate() + 1);
  }

  const roomRatePerNight = Math.round(totalRoomCost / nightsCount);
  const baseRoomSubtotal = totalRoomCost;

  const uniqueAddonIds = Array.from(new Set(addonIds));
  const addonsSubtotal = uniqueAddonIds.reduce((sum, id) => {
    const item = curatedAddons.find((a) => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const grossAmount = baseRoomSubtotal + addonsSubtotal;

  let discountAmount = 0;
  if (couponCode) {
    const now = new Date().toISOString();
    const coupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.is_active
    );
    if (coupon) {
      const isWithinDates =
        (!coupon.valid_from || coupon.valid_from <= now) &&
        (!coupon.valid_until || coupon.valid_until >= now);
      const hasQuota = coupon.usage_limit == null || coupon.used_count < coupon.usage_limit;
      const minReq = coupon.min_booking_amount || 0;

      if (isWithinDates && hasQuota && grossAmount >= minReq) {
        if (coupon.discount_type === 'percentage') {
          discountAmount = Math.round((grossAmount * coupon.discount_value) / 100);
          if (coupon.max_discount_amount) {
            discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
          }
        } else {
          discountAmount = Math.min(coupon.discount_value, grossAmount);
        }
      }
    }
  }

  const taxableAmount = Math.max(0, grossAmount - discountAmount);
  const gstAmount = Math.round(taxableAmount * 0.18); // 18% Boutique Hospitality GST
  const finalPayableAmount = taxableAmount + gstAmount;

  return {
    nightsCount,
    roomRatePerNight,
    baseRoomSubtotal,
    addonsSubtotal,
    grossAmount,
    discountAmount,
    taxableAmount,
    gstAmount,
    finalPayableAmount,
  };
}
