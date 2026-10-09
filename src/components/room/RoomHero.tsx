'use client';

// High-End Editorial Hero for The Kesari Bagh Suite Showcase
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Compass, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';
import { RoomEntity } from '@/types/database';
import { RoomDetailSpec } from '@/lib/data/room-details-data';

interface RoomHeroProps {
  room: RoomEntity;
  detail: RoomDetailSpec;
}

export function RoomHero({ room, detail }: RoomHeroProps) {
  return (
    <section className="relative min-h-[90dvh] flex items-end pb-16 pt-32 px-6 overflow-hidden bg-[#142019]">
      {/* Background Photography with Slow Motion Scale */}
      <div className="absolute inset-0 z-0">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          priority
          className="object-cover opacity-60 scale-100 transition-transform duration-1000 ease-out"
          sizes="100vw"
        />
        {/* Cinematic Vignette & Warm Tint Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#142019] via-[#142019]/60 to-black/40" />
        <div className="absolute inset-0 bg-[#142019]/30 mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#FBF9F5]/70 hover:text-[#C5A880] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Accommodations</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-[#C5A880] uppercase">
              Estate Coordinates: 28.3245° N, 76.9018° E
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#C5A880] animate-pulse" />
          </div>
        </div>

        {/* Double-Bezel Suite Identity Card */}
        <div className="space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            {/* Key Number Badge */}
            <div className="rounded-full bg-[#142019]/80 backdrop-blur-md px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/40 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{detail.keyNumber}</span>
            </div>

            {/* View Direction Badge */}
            <div className="rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#FBF9F5]/90 border border-white/10 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-[#C5A880]" />
              <span>{detail.compassOrientation}</span>
            </div>

            {/* Direct Hold TTL Badge */}
            <div className="hidden md:flex rounded-full bg-[#C5A880]/15 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/30 items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              <span>Atomic 15-Min Availability Lock</span>
            </div>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#FBF9F5] font-light leading-[1.08] tracking-tight">
            {room.name}
          </h1>

          <p className="text-base sm:text-xl text-[#FBF9F5]/80 font-light max-w-2xl leading-relaxed">
            {detail.tagline}
          </p>

          {/* Quick Metrics Bar with Subtle Hairlines */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#C5A880]/20 max-w-3xl">
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">Total Footprint</span>
              <span className="font-serif text-lg sm:text-xl text-[#FBF9F5] font-light">
                {room.square_meters} m² <span className="text-xs font-sans text-white/60">({room.square_footage} sq.ft)</span>
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">Ceiling Clearance</span>
              <span className="font-serif text-lg sm:text-xl text-[#FBF9F5] font-light">
                {detail.ceilingHeight}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">Bed Configuration</span>
              <span className="font-serif text-lg sm:text-xl text-[#FBF9F5] font-light">
                {room.bed_type}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">Base Tariff</span>
              <span className="font-serif text-lg sm:text-xl text-[#FBF9F5] font-light">
                ₹{room.base_price.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-sans text-[#C5A880]">/ night</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
