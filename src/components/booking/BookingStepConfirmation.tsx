'use client';

// Step 4: Reservation Confirmation Receipt with Dispatch Badges & Location Directions
import Link from 'next/link';
import { CheckCircle2, MessageSquare, Mail, MapPin, Calendar, Key } from 'lucide-react';
import { PricingBreakdown } from '@/types/booking';
import { RoomEntity } from '@/types/database';

interface BookingStepConfirmationProps {
  referenceCode: string;
  room?: RoomEntity;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  pricing?: PricingBreakdown;
  onReset: () => void;
}

export function BookingStepConfirmation({
  referenceCode,
  room,
  checkIn,
  checkOut,
  guestsCount,
  guestName,
  guestEmail,
  guestPhone,
  pricing,
  onReset,
}: BookingStepConfirmationProps) {
  return (
    <div className="space-y-8 py-4">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#142019] text-[#C5A880] flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#C5A880]/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A880] block">
          Reservation Confirmed
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#142019] font-light">
          Welcome to The Kesari Bagh
        </h3>
        <p className="text-xs sm:text-sm text-[#5F635F] max-w-md mx-auto">
          Dear {guestName}, your French-colonial countryside retreat has been reserved.
        </p>
      </div>

      {/* Booking Reference Card */}
      <div className="rounded-2xl border border-[#C5A880]/40 bg-[#F0EBE1]/40 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#C5A880]/30 pb-4 gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F635F]">
              Reservation ID
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-[#142019] tracking-wider">
              {referenceCode}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F635F]">
              Total Tariff (incl. 18% GST)
            </span>
            <div className="font-serif text-2xl font-bold text-[#142019]">
              ₹{pricing?.finalPayableAmount.toLocaleString('en-IN') || '—'}
            </div>
          </div>
        </div>

        {/* Stay Summary Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#142019]">
          <div className="space-y-1">
            <span className="text-[10px] text-[#5F635F] uppercase flex items-center gap-1">
              <Key className="w-3 h-3 text-[#C5A880]" />
              <span>Suite</span>
            </span>
            <p className="font-serif text-sm font-semibold">{room?.name || 'Exclusive Suite'}</p>
            <p className="text-[11px] text-[#5F635F]">{room?.floor_level} Floor • {room?.view_type}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#5F635F] uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#C5A880]" />
              <span>Check-in / Check-out</span>
            </span>
            <p className="font-semibold">{checkIn} → {checkOut}</p>
            <p className="text-[11px] text-[#5F635F]">{pricing?.nightsCount} Nights • {guestsCount} Guests</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#5F635F] uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#C5A880]" />
              <span>Estate Coordinates</span>
            </span>
            <p className="font-semibold">Manesar, Gurugram</p>
            <a
              href="https://maps.google.com/?q=28.3245,76.9018"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9E7F55] underline text-[11px] hover:text-[#142019]"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* Omnichannel Delivery Badges */}
        <div className="rounded-xl bg-white p-4 border border-[#E0CDB7] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#142019]">
            <div className="w-7 h-7 rounded-full bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center shrink-0">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium">WhatsApp Dispatch Sent</p>
              <p className="text-[10px] text-[#5F635F]">Voucher &amp; location pin sent to {guestPhone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[#142019]">
            <div className="w-7 h-7 rounded-full bg-[#C5A880]/20 text-[#9E7F55] flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium">Email Dispatch Sent</p>
              <p className="text-[10px] text-[#5F635F]">Folio sent to {guestEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Return Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-[#142019] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5] hover:bg-[#23342A] transition-all"
        >
          Return to Estate Homepage
        </Link>
        <button
          onClick={onReset}
          className="rounded-full border border-[#E0CDB7] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#142019] hover:bg-[#F0EBE1]"
        >
          Book Another Suite
        </button>
      </div>
    </div>
  );
}
