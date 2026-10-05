'use client';

// Luxury Double-Bezel Room Suite Card for The Kesari Bagh
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BedDouble, Maximize2, Compass } from 'lucide-react';
import { RoomEntity } from '@/types/database';

interface RoomCardProps {
  room: RoomEntity;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="double-bezel group transition-all duration-300 hover:shadow-xl">
      <div className="double-bezel-inner flex flex-col h-full overflow-hidden bg-white">
        {/* Room Photography with Reveal Overlay */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <Image
            src={room.images[0]}
            alt={room.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Floor Badge */}
          <div className="absolute top-4 left-4 rounded-full bg-[#142019]/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/30">
            {room.floor_level} Floor
          </div>

          {/* Pricing Tag */}
          <div className="absolute bottom-4 right-4 text-right">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FBF9F5]/70 block">
              From
            </span>
            <div className="font-serif text-xl font-light text-[#FBF9F5]">
              ₹{room.base_price.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-sans text-[#C5A880]">/ night</span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#9E7F55] uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>{room.view_type}</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl text-[#142019] group-hover:text-[#9E7F55] transition-colors leading-snug">
              {room.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#5F635F] line-clamp-2 leading-relaxed">
              {room.short_description}
            </p>
          </div>

          {/* Architectural Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-[#F0EBE1] text-xs font-mono text-[#5F635F]">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>
                {room.square_meters} m² ({room.square_footage} sq.ft)
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <BedDouble className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{room.bed_type}</span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <Link
              href={`/book?roomId=${room.id}`}
              className="w-full flex items-center justify-between rounded-full bg-[#142019] px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#FBF9F5] transition-all group-hover:bg-[#C5A880] group-hover:text-[#142019]"
            >
              <span>Reserve This Suite</span>
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#142019]/10">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
