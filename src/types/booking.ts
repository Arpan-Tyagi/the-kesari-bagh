// Booking Funnel State Machine and Pricing Types

import { RoomEntity } from './database';

export interface BookingFunnelState {
  step: 1 | 2 | 3 | 4; // 1: Dates & Room, 2: Curated Addons, 3: Guest Details & Coupon, 4: Confirmation
  roomId: string | null;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestsCount: number;
  selectedAddonIds: string[];
  couponCode: string;
  couponDiscount: number;
  couponValid: boolean | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
}

export interface PricingBreakdown {
  nightsCount: number;
  roomRatePerNight: number;
  baseRoomSubtotal: number;
  addonsSubtotal: number;
  grossAmount: number;
  discountAmount: number;
  taxableAmount: number;
  gstAmount: number; // 18% luxury boutique hospitality GST in India
  finalPayableAmount: number;
}

export interface BookingSubmissionPayload {
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
}

export interface BookingResponsePayload {
  success: boolean;
  referenceCode?: string;
  bookingId?: string;
  message: string;
  pricing?: PricingBreakdown;
  room?: RoomEntity;
}
