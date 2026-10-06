// Estate Service Layer: State Management, Availability, and Folios
import { AUTHENTIC_ROOMS, CURATED_ADDONS, INITIAL_COUPONS } from '@/lib/data/mock-estate-data';
import { BookingEntity, BookingStatus, RoomEntity, CouponEntity, BookingAddonItem, EventInquiryEntity, InquiryStatus, EventType } from '@/types/database';
import { PricingBreakdown } from '@/types/booking';
import { calculateEstatePricing, parseLocalDate } from './pricing-calculator';
import { EstateInquiryService } from './estate-inquiries';
import { memoryBookings, notifyBookingListeners, subscribeBooking, updateBookingStatusInStore } from './estate-reservations';

const dynamicRooms: RoomEntity[] = [...AUTHENTIC_ROOMS];
const dynamicCoupons: CouponEntity[] = [...INITIAL_COUPONS];

export class EstateService {
  static getRooms(): RoomEntity[] { return dynamicRooms; }
  static getRoomBySlug(slug: string): RoomEntity | undefined { return dynamicRooms.find((r) => r.slug === slug); }
  static getAddons(): BookingAddonItem[] { return CURATED_ADDONS; }
  static getCoupons(): CouponEntity[] { return dynamicCoupons; }
  static getBookings(): BookingEntity[] { return memoryBookings; }
  static subscribe(listener: () => void): () => void { return subscribeBooking(listener); }
  static updateBookingStatus(id: string, status: BookingStatus): boolean { return updateBookingStatusInStore(id, status); }

  static getInquiries(): EventInquiryEntity[] { return EstateInquiryService.getInquiries(); }
  static createEventInquiry(data: { name: string; email: string; phone: string; eventType: EventType; guestCount: number; preferredDate: string; message: string; }): EventInquiryEntity {
    return EstateInquiryService.createEventInquiry(data);
  }
  static updateInquiryStatus(id: string, status: InquiryStatus): boolean { return EstateInquiryService.updateInquiryStatus(id, status); }

  static getRoomById(id: string): RoomEntity | undefined {
    if (id === 'whole-estate') {
      return {
        id: 'whole-estate',
        slug: 'whole-estate-buyout',
        name: 'The Bagh — Exclusive Whole Estate Buyout',
        description: 'Complete private buyout of all 4 royal suites, 1-acre manicured lawn, French chandelier dining salon, and swimming pool. Accommodates up to 16 guests.',
        short_description: 'Exclusive buyout of all 4 suites for up to 16 guests.',
        floor_level: 'Ground',
        square_meters: 118.46,
        square_footage: 1275,
        max_occupancy: 16,
        bed_type: '4 King Size Master Beds',
        view_type: 'Entire 1.25-Acre Estate & Aravallis',
        base_price: 63000,
        weekend_price: 76500,
        images: ['/images/hero-estate-facade.jpg', '/images/estate-heritage-grounds.jpg'],
        is_active: true,
      };
    }
    return dynamicRooms.find((r) => r.id === id);
  }

  static updateRoomPrice(roomId: string, basePrice: number, weekendPrice: number): boolean {
    const room = dynamicRooms.find((r) => r.id === roomId);
    if (!room) return false;
    room.base_price = basePrice;
    room.weekend_price = weekendPrice;
    return true;
  }

  static addCoupon(coupon: Omit<CouponEntity, 'id' | 'used_count' | 'created_at'>): CouponEntity {
    const newCoupon: CouponEntity = {
      id: `coupon-${Date.now()}`,
      used_count: 0,
      created_at: new Date().toISOString(),
      ...coupon,
    };
    dynamicCoupons.push(newCoupon);
    return newCoupon;
  }

  static checkAvailability(roomId: string, checkIn: string, checkOut: string): boolean {
    try {
      const reqStart = parseLocalDate(checkIn).getTime();
      const reqEnd = parseLocalDate(checkOut).getTime();
      if (isNaN(reqStart) || isNaN(reqEnd) || reqEnd <= reqStart) return false;

      const nowMs = Date.now();
      for (const b of memoryBookings) {
        if (b.status === 'cancelled') continue;
        if (b.status === 'pending' && b.expires_at && nowMs > new Date(b.expires_at).getTime()) {
          b.status = 'cancelled';
          continue;
        }

        const isCollision = b.room_id === roomId || roomId === 'whole-estate' || b.room_id === 'whole-estate';
        if (!isCollision) continue;

        const bStart = parseLocalDate(b.check_in).getTime();
        const bEnd = parseLocalDate(b.check_out).getTime();
        if (Math.max(reqStart, bStart) < Math.min(reqEnd, bEnd)) return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  static calculatePricing(room: RoomEntity, checkIn: string, checkOut: string, addonIds: string[] = [], couponCode?: string): PricingBreakdown {
    return calculateEstatePricing(room, checkIn, checkOut, addonIds, CURATED_ADDONS, dynamicCoupons, couponCode);
  }

  static createBooking(data: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    addonIds?: string[];
    couponCode?: string;
    specialRequests?: string;
  }): { success: boolean; booking: BookingEntity; pricing: PricingBreakdown; message: string } {
    const room = this.getRoomById(data.roomId) || dynamicRooms[0];
    const pricing = this.calculatePricing(room, data.checkIn, data.checkOut, data.addonIds || [], data.couponCode);

    if (pricing.discountAmount > 0 && data.couponCode) {
      const c = dynamicCoupons.find((cp) => cp.code.toUpperCase() === data.couponCode!.trim().toUpperCase());
      if (c) c.used_count = (c.used_count || 0) + 1;
    }

    const uniqueAddons = CURATED_ADDONS.filter((a) => (data.addonIds || []).includes(a.id));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `TKB-${new Date().getFullYear()}-${randomSuffix}`;

    const newBooking: BookingEntity = {
      id: `booking-${Date.now()}`,
      reference_code: referenceCode,
      room_id: data.roomId,
      guest_name: data.guestName,
      guest_email: data.guestEmail,
      guest_phone: data.guestPhone,
      guests_count: data.guestsCount,
      check_in: data.checkIn,
      check_out: data.checkOut,
      room_rate_per_night: pricing.roomRatePerNight,
      nights_count: pricing.nightsCount,
      addons_total: pricing.addonsSubtotal,
      discount_total: pricing.discountAmount,
      tax_total: pricing.gstAmount,
      total_price: pricing.finalPayableAmount,
      status: 'confirmed',
      special_requests: data.specialRequests,
      whatsapp_notified: false,
      email_notified: false,
      addons: uniqueAddons.map((a) => ({ name: a.name, price: a.price, quantity: 1 })),
      room,
      created_at: new Date().toISOString(),
    };

    memoryBookings.unshift(newBooking);
    notifyBookingListeners();
    return { success: true, booking: newBooking, pricing, message: 'Reservation confirmed successfully' };
  }

  static createPendingReservation(data: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    addonIds?: string[];
    couponCode?: string;
    idType?: string;
    holdMinutes?: number;
    specialRequests?: string;
  }): { success: boolean; booking?: BookingEntity; message: string; paymentUrl?: string } {
    if (data.roomId !== 'whole-estate' && data.guestsCount > 3) {
      return { success: false, message: 'Capacity limit exceeded: Maximum 3 guests permitted per individual suite.' };
    }
    if (data.guestsCount > 16) {
      return { success: false, message: 'Capacity limit exceeded: Maximum 16 guests permitted for estate buyout.' };
    }

    const room = this.getRoomById(data.roomId);
    if (!room) return { success: false, message: 'Requested room suite not found' };

    if (!this.checkAvailability(data.roomId, data.checkIn, data.checkOut)) {
      return { success: false, message: 'The selected room suite is already booked or temporarily held for these dates.' };
    }

    const pricing = this.calculatePricing(room, data.checkIn, data.checkOut, data.addonIds || [], data.couponCode);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `TKB-${new Date().getFullYear()}-${randomSuffix}`;
    const holdMinutes = data.holdMinutes ?? 15;
    const expiresAt = new Date(Date.now() + holdMinutes * 60 * 1000).toISOString();

    const pendingBooking: BookingEntity = {
      id: `booking-pending-${Date.now()}`,
      reference_code: referenceCode,
      room_id: data.roomId,
      guest_name: data.guestName,
      guest_email: data.guestEmail,
      guest_phone: data.guestPhone,
      guests_count: data.guestsCount,
      check_in: data.checkIn,
      check_out: data.checkOut,
      room_rate_per_night: pricing.roomRatePerNight,
      nights_count: pricing.nightsCount,
      addons_total: pricing.addonsSubtotal,
      discount_total: pricing.discountAmount,
      tax_total: pricing.gstAmount,
      total_price: pricing.finalPayableAmount,
      status: 'pending',
      expires_at: expiresAt,
      id_type: data.idType,
      special_requests: data.specialRequests,
      whatsapp_notified: false,
      email_notified: false,
      room,
      created_at: new Date().toISOString(),
    };

    memoryBookings.unshift(pendingBooking);
    notifyBookingListeners();

    return {
      success: true,
      booking: pendingBooking,
      message: `Suite locked for ${holdMinutes} minutes.`,
      paymentUrl: `https://thebagh.com/checkout/pay?ref=${referenceCode}`,
    };
  }

  static confirmBookingDirect(referenceCodeOrId: string): { success: boolean; booking?: BookingEntity; message: string; } {
    const booking = memoryBookings.find((b) => b.reference_code === referenceCodeOrId || b.id === referenceCodeOrId);
    if (!booking) return { success: false, message: 'Reservation record not found.' };
    if (booking.status === 'cancelled') return { success: false, message: 'Reservation has already been cancelled.' };
    if (booking.status === 'pending' && booking.expires_at) {
      if (Date.now() > new Date(booking.expires_at).getTime()) {
        booking.status = 'cancelled';
        return { success: false, message: 'Transient hold has expired (15-minute TTL exceeded).' };
      }
    }

    booking.status = 'confirmed';
    booking.expires_at = undefined;
    notifyBookingListeners();

    return { success: true, booking, message: `Reservation ${booking.reference_code} confirmed successfully.` };
  }
}
