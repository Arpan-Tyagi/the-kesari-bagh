'use client';

// In-Room Artisanal Amenities Grid with Category Enclosures
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { RoomDetailSpec } from '@/lib/data/room-details-data';

interface RoomAmenitiesProps {
  detail: RoomDetailSpec;
}

export function RoomAmenities({ detail }: RoomAmenitiesProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
          Bespoke Appointments
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#142019] font-light">
          Curated In-Room Amenities
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {detail.amenitiesByCategory.map((categoryGroup) => (
          <div
            key={categoryGroup.category}
            className="rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-xs"
          >
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] p-6 sm:p-7 space-y-5 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#9E7F55]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{categoryGroup.category}</span>
                </div>

                <div className="space-y-4 pt-2">
                  {categoryGroup.items.map((item) => (
                    <div
                      key={item.name}
                      className="p-3.5 rounded-xl bg-white border border-[#F0EBE1] space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                        <h4 className="font-serif text-base text-[#142019] font-medium leading-none">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-xs text-[#5F635F] pl-6 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0EBE1] text-[11px] font-mono text-[#5F635F] flex items-center justify-between">
                <span>Inclusive in room rate</span>
                <span className="text-[#C5A880]">• Estate Standard</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
