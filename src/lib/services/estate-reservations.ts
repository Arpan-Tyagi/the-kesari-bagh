// Estate Reservations Store & Transient Lock Management
import { BookingEntity, BookingStatus } from '@/types/database';

export const memoryBookings: BookingEntity[] = [
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

type BookingListener = () => void;
const bookingListeners: Set<BookingListener> = new Set();

export function notifyBookingListeners(): void {
  bookingListeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('[BookingListener Error]:', err);
    }
  });
}

export function subscribeBooking(listener: BookingListener): () => void {
  bookingListeners.add(listener);
  return () => {
    bookingListeners.delete(listener);
  };
}

export function updateBookingStatusInStore(id: string, status: BookingStatus): boolean {
  const booking = memoryBookings.find((b) => b.id === id);
  if (!booking) return false;
  booking.status = status;
  notifyBookingListeners();
  return true;
}
