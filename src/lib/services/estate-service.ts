// Estate Service Layer: State Management, Availability, and Folios
import { AUTHENTIC_ROOMS, CURATED_ADDONS, INITIAL_COUPONS } from '@/lib/data/mock-estate-data';
import {
  BookingEntity,
  BookingStatus,
  RoomEntity,
  CouponEntity,
  BookingAddonItem,
  EventInquiryEntity,
  InquiryStatus,
  EventType,
} from '@/types/database';
import { PricingBreakdown } from '@/types/booking';
import { calculateEstatePricing, parseLocalDate } from './pricing-calculator';

const memoryBookings: BookingEntity[] = [
  {
    id: 'b-demo-1',
    reference_code: 'TKB-2025-8812',
    room_id: 'room-1-garden-pool',
    guest_name: 'Vikramaditya Singhania',
    guest_email: 'vikram@singhania.co',
    guest_phone: '+919811122334',
    guests_count: 2,
    check_in: '2026-11-10',
    check_out: '2026-11-12',
    room_rate_per_night: 15000,
    nights_count: 2,
    addons_total: 3500,
    discount_total: 0,
    tax_total: 6030,
    total_price: 39530,
    status: 'confirmed',
    whatsapp_notified: true,
    email_notified: true,
    created_at: new Date().toISOString(),
  },
];

const memoryInquiries: EventInquiryEntity[] = [
  {
    id: 'inq-demo-1',
    name: 'Radhika Mehra',
    email: 'radhika@mehra.in',
    phone: '+919811122334',
    event_type: 'intimate_wedding',
    guest_count: 24,
    preferred_date: '2026-12-15',
    message: 'Indoor French crystal chandelier dining & lawn reception for family gathering.',
    status: 'new',
    created_at: new Date().toISOString(),
  },
];

const dynamicRooms: RoomEntity[] = [...AUTHENTIC_ROOMS];
const dynamicCoupons: CouponEntity[] = [...INITIAL_COUPONS];

export class EstateService {
  static getRooms(): RoomEntity[] {
    return dynamicRooms;
  }

  static getRoomBySlug(slug: string): RoomEntity | undefined {
    return dynamicRooms.find((r) => r.slug === slug);
  }

  static getRoomById(id: string): RoomEntity | undefined {
    return dynamicRooms.find((r) => r.id === id);
  }

  static updateRoomPrice(roomId: string, basePrice: number, weekendPrice: number): boolean {
    const room = dynamicRooms.find((r) => r.id === roomId);
    if (!room) return false;
    room.base_price = basePrice;
    room.weekend_price = weekendPrice;
    return true;
  }

  static getAddons(): BookingAddonItem[] {
    return CURATED_ADDONS;
  }

  static getCoupons(): CouponEntity[] {
    return dynamicCoupons;
  }

  static checkAvailability(roomId: string, checkIn: string, checkOut: string): boolean {
    try {
      const start = parseLocalDate(checkIn).getTime();
      const end = parseLocalDate(checkOut).getTime();
      if (isNaN(start) || isNaN(end) || end <= start) return false;

      const hasConflict = memoryBookings.some((b) => {
        if (b.room_id !== roomId || b.status === 'cancelled') return false;
        const bStart = parseLocalDate(b.check_in).getTime();
        const bEnd = parseLocalDate(b.check_out).getTime();
        return Math.max(start, bStart) < Math.min(end, bEnd);
      });

      return !hasConflict;
    } catch {
      return false;
    }
  }

  static calculatePricing(
    room: RoomEntity,
    checkIn: string,
    checkOut: string,
    addonIds: string[] = [],
    couponCode?: string
  ): PricingBreakdown {
    return calculateEstatePricing(
      room,
      checkIn,
      checkOut,
      addonIds,
      CURATED_ADDONS,
      dynamicCoupons,
      couponCode
    );
  }

  static createBooking(data: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    addonIds: string[];
    couponCode?: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests?: string;
  }): { success: boolean; booking?: BookingEntity; message: string; pricing?: PricingBreakdown } {
    const room = this.getRoomById(data.roomId);
    if (!room) return { success: false, message: 'Requested room suite not found' };

    const isAvailable = this.checkAvailability(data.roomId, data.checkIn, data.checkOut);
    if (!isAvailable) {
      return {
        success: false,
        message: 'The selected room suite is already booked for these dates.',
      };
    }

    const pricing = this.calculatePricing(
      room,
      data.checkIn,
      data.checkOut,
      data.addonIds,
      data.couponCode
    );

    if (data.couponCode) {
      const coupon = dynamicCoupons.find(
        (c) => c.code.toUpperCase() === data.couponCode!.trim().toUpperCase()
      );
      if (coupon) coupon.used_count = (coupon.used_count || 0) + 1;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `TKB-${new Date().getFullYear()}-${randomSuffix}`;
    const uniqueAddons = Array.from(new Set(data.addonIds))
      .map((id) => CURATED_ADDONS.find((a) => a.id === id))
      .filter((a): a is BookingAddonItem => Boolean(a))
      .map((a) => ({ name: a.name, price: a.price, quantity: 1 }));

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
      addons: uniqueAddons,
      room,
      created_at: new Date().toISOString(),
    };

    memoryBookings.unshift(newBooking);
    return { success: true, booking: newBooking, pricing, message: 'Reservation confirmed successfully' };
  }

  static getBookings(): BookingEntity[] {
    return memoryBookings;
  }

  static updateBookingStatus(
    id: string,
    status: BookingStatus
  ): boolean {
    const booking = memoryBookings.find((b) => b.id === id);
    if (!booking) return false;
    booking.status = status;
    return true;
  }

  static getInquiries(): EventInquiryEntity[] {
    return memoryInquiries;
  }

  static createEventInquiry(data: {
    name: string;
    email: string;
    phone: string;
    eventType: EventType;
    guestCount: number;
    preferredDate: string;
    message: string;
  }): EventInquiryEntity {
    const inquiry: EventInquiryEntity = {
      id: `inq-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      event_type: data.eventType,
      guest_count: data.guestCount,
      preferred_date: data.preferredDate,
      message: data.message,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    memoryInquiries.unshift(inquiry);
    return inquiry;
  }

  static updateInquiryStatus(id: string, status: InquiryStatus): boolean {
    const inquiry = memoryInquiries.find((i) => i.id === id);
    if (!inquiry) return false;
    inquiry.status = status;
    return true;
  }
}
