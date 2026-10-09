'use client';

// Sticky Floating Room Reservation Console with Button-in-Button Architecture
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, ShieldCheck, Clock, CalendarDays, Users } from 'lucide-react';
import { RoomEntity } from '@/types/database';
import { RoomDetailSpec } from '@/lib/data/room-details-data';

interface RoomBookingCardProps {
  room: RoomEntity;
  detail: RoomDetailSpec;
}

export function RoomBookingCard({ room, detail }: RoomBookingCardProps) {
  const whatsappUrl = `https://wa.me/919810000000?text=${encodeURIComponent(
    `Hello Aarav, I am inquiring about availability and bespoke arrangements for the ${room.name} (${detail.keyNumber}) at The Kesari Bagh.`
  )}`;

  return (
    <div className="sticky top-28 rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-lg">
      <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] p-6 sm:p-8 space-y-6">
        {/* Header & Pricing */}
        <div className="space-y-3 pb-6 border-b border-[#F0EBE1]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#9E7F55]">
              Direct Tariff Schedule
            </span>
            <div className="rounded-full bg-[#142019]/5 px-2.5 py-0.5 text-[10px] font-mono text-[#142019] border border-[#C5A880]/30">
              {detail.keyNumber.split('•')[0].trim()}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl text-[#142019] font-light">
              ₹{room.base_price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-sans text-[#5F635F]">/ weekday night</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#5F635F] pt-1">
            <span>Weekend Tariff:</span>
            <span className="text-[#142019] font-medium">₹{room.weekend_price.toLocaleString('en-IN')} / night</span>
          </div>
        </div>

        {/* Estate Inclusions & Features */}
        <div className="space-y-3 text-xs text-[#5F635F]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9E7F55] block">
            Suite Inclusions
          </span>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>Artisanal Countryside Farm Breakfast for 2</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>Accommodates up to {room.max_occupancy} guests (King master bed)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>Check-in: 2:00 PM • Check-out: 11:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>15-Minute atomic inventory lock upon checkout</span>
            </div>
          </div>
        </div>

        {/* Primary Interactive CTA: Nested Button-in-Button */}
        <div className="space-y-3 pt-2">
          <Link
            href={`/book?roomId=${room.id}`}
            className="group w-full flex items-center justify-between rounded-full bg-[#142019] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5] transition-all hover:bg-[#C5A880] hover:text-[#142019] active:scale-[0.98] shadow-sm"
          >
            <span>Reserve {detail.keyNumber.split('•')[0].trim()}</span>
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:bg-[#142019]/15">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* WhatsApp Direct Concierge Escalation */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full border border-[#C5A880]/40 bg-white px-5 py-3 text-xs font-mono uppercase tracking-wider text-[#142019] transition-all hover:border-[#142019] hover:bg-[#F0EBE1]/40"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Chat With Concierge</span>
          </a>
        </div>

        {/* Reassurance Guarantee Note */}
        <div className="pt-2 border-t border-[#F0EBE1] text-center">
          <p className="text-[10px] font-mono text-[#5F635F]">
            Direct reservation guaranteed with zero booking commissions.
          </p>
        </div>
      </div>
    </div>
  );
}
