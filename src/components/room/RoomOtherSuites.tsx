'use client';

// Other Suites Carousel / Cross-Exploration Grid
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BedDouble, Maximize2 } from 'lucide-react';
import { RoomEntity } from '@/types/database';

interface RoomOtherSuitesProps {
  currentRoomSlug: string;
  allRooms: RoomEntity[];
}

export function RoomOtherSuites({ currentRoomSlug, allRooms }: RoomOtherSuitesProps) {
  const otherRooms = allRooms.filter((r) => r.slug !== currentRoomSlug);

  return (
    <section className="space-y-6 pt-12 border-t border-[#C5A880]/20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
            Estate Portfolio
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#142019] font-light">
            Explore Other Accommodations
          </h2>
        </div>
        <Link
          href="/rooms"
          className="text-xs font-mono uppercase tracking-[0.15em] text-[#142019] border-b border-[#142019] pb-0.5 hover:text-[#C5A880] hover:border-[#C5A880] transition-colors"
        >
          View All 4 Keys
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {otherRooms.map((room) => (
          <div
            key={room.id}
            className="group rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 transition-all duration-300 hover:shadow-lg"
          >
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] overflow-hidden flex flex-col h-full justify-between">
              <div>
                {/* Image Frame */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 rounded-full bg-[#142019]/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/30">
                    {room.floor_level} Floor
                  </div>
                  <div className="absolute bottom-3 right-3 text-right">
                    <span className="font-serif text-lg text-white">
                      ₹{room.base_price.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] font-sans text-[#C5A880]">/ night</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="font-serif text-lg text-[#142019] group-hover:text-[#9E7F55] transition-colors leading-snug">
                    {room.name}
                  </h3>
                  <p className="text-xs text-[#5F635F] line-clamp-2 leading-relaxed">
                    {room.short_description}
                  </p>

                  <div className="flex items-center justify-between py-2 border-t border-[#F0EBE1] text-[11px] font-mono text-[#5F635F]">
                    <div className="flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-[#C5A880]" />
                      <span>{room.square_meters} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BedDouble className="w-3 h-3 text-[#C5A880]" />
                      <span>{room.bed_type.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-5 pt-0">
                <Link
                  href={`/rooms/${room.slug}`}
                  className="w-full flex items-center justify-between rounded-full bg-[#142019]/5 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#142019] group-hover:bg-[#142019] group-hover:text-[#FBF9F5] transition-all"
                >
                  <span>Discover Suite</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
