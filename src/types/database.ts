// Database and Domain Types for The Kesari Bagh Luxury Estate
// Explicit contracts for rooms, amenities, bookings, coupons, blogs, and inquiries

export type FloorLevel = 'Ground' | 'First';
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
export type CouponDiscountType = 'percentage' | 'fixed';
export type SenderType = 'guest' | 'ai' | 'concierge';
export type ChatSessionStatus = 'active' | 'escalated' | 'closed';
export type EventType = 'intimate_wedding' | 'corporate_retreat' | 'celebration' | 'video_shoot' | 'farm_picnic';
export type InquiryStatus = 'new' | 'contacted' | 'scheduled' | 'closed';

export interface RoomEntity {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  floor_level: FloorLevel;
  square_meters: number;
  square_footage: number;
  max_occupancy: number;
  bed_type: string;
  view_type: string;
  base_price: number;
  weekend_price: number;
  images: string[];
  is_active: boolean;
  amenities?: AmenityEntity[];
  created_at?: string;
  updated_at?: string;
}

export interface AmenityEntity {
  id: string;
  room_id?: string;
  name: string;
  category: 'room' | 'estate' | 'bathroom' | 'refreshment';
  icon_name: string;
  description?: string;
  created_at?: string;
}

export interface BookingAddonItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'dining' | 'adventure' | 'wellness' | 'transport';
}

export interface BookingEntity {
  id: string;
  reference_code: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guests_count: number;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  room_rate_per_night: number;
  nights_count: number;
  addons_total: number;
  discount_total: number;
  tax_total: number;
  total_price: number;
  status: BookingStatus;
  coupon_id?: string | null;
  special_requests?: string | null;
  whatsapp_notified: boolean;
  email_notified: boolean;
  addons?: Array<{ name: string; price: number; quantity: number }>;
  room?: RoomEntity;
  created_at?: string;
  updated_at?: string;
}

export interface CouponEntity {
  id: string;
  code: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  valid_from: string;
  valid_until: string;
  min_booking_amount?: number;
  max_discount_amount?: number;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  created_at?: string;
}

export interface BlogEntity {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  published: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventInquiryEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: EventType;
  guest_count: number;
  preferred_date: string;
  message: string;
  status: InquiryStatus;
  created_at?: string;
}

export interface ChatSessionEntity {
  id: string;
  guest_identifier: string;
  guest_name?: string;
  guest_phone?: string;
  status: ChatSessionStatus;
  created_at?: string;
  updated_at?: string;
}

export interface ChatMessageEntity {
  id: string;
  session_id: string;
  sender_type: SenderType;
  content: string;
  metadata?: {
    escalated_to_whatsapp?: boolean;
    whatsapp_url?: string;
    quick_options?: string[];
  };
  created_at?: string;
}
