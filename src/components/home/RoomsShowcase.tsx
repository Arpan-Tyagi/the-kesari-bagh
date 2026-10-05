'use client';

// Accommodation Showcase: Interactive Presentation of The 4 Authentic Keys
import { useState } from 'react';
import { AUTHENTIC_ROOMS } from '@/lib/data/mock-estate-data';
import { RoomCard } from './RoomCard';
import { KeyRound, Sparkles } from 'lucide-react';

export function RoomsShowcase() {
  const [floorFilter, setFloorFilter] = useState<'All' | 'Ground' | 'First'>('All');

  const filteredRooms =
    floorFilter === 'All'
      ? AUTHENTIC_ROOMS
      : AUTHENTIC_ROOMS.filter((r) => r.floor_level === floorFilter);

  return (
    <section id="suites" className="py-28 px-6 bg-[#FBF9F5] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C5A880]/30 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
              <KeyRound className="w-4 h-4" />
              <span>Estate Accommodations • Total 4 Keys</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#142019] font-light">
              Four Intimate French-Colonial Suites
            </h2>
            <p className="text-sm sm:text-base text-[#5F635F] max-w-xl font-light">
              Designed with bespoke teak finishes, high French windows, and views framing either the manicured lawns or the Aravalli range.
            </p>
          </div>

          {/* Floor Level Filter Tabs */}
          <div className="inline-flex rounded-full bg-[#F0EBE1] p-1.5 ring-1 ring-[#C5A880]/30 self-start md:self-end">
            {(['All', 'Ground', 'First'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFloorFilter(filter)}
                className={`rounded-full px-5 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
                  floorFilter === filter
                    ? 'bg-[#142019] text-[#FBF9F5] shadow-xs'
                    : 'text-[#142019]/70 hover:text-[#142019]'
                }`}
              >
                {filter === 'All' ? 'All 4 Keys' : `${filter} Floor`}
              </button>
            ))}
          </div>
        </div>

        {/* Room Suites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {/* Capacity Notice */}
        <div className="rounded-2xl border border-[#C5A880]/30 bg-[#F0EBE1]/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg text-[#142019]">Full Estate Buyout Available</h4>
              <p className="text-xs text-[#5F635F]">
                Reserve all 4 suites exclusively for private family retreats or intimate gatherings up to 16 overnight guests.
              </p>
            </div>
          </div>
          <a
            href="#events"
            className="shrink-0 text-xs font-mono uppercase tracking-[0.18em] text-[#142019] border-b border-[#142019] pb-0.5 hover:text-[#C5A880] hover:border-[#C5A880] transition-colors"
          >
            Inquire Full Buyout
          </a>
        </div>
      </div>
    </section>
  );
}
