'use client';

// Architectural Specifications Bento Grid with Double-Bezel Nested Architecture
import { Maximize2, BedDouble, Bath, Sun, Wind, VolumeX } from 'lucide-react';
import { RoomEntity } from '@/types/database';
import { RoomDetailSpec } from '@/lib/data/room-details-data';

interface RoomSpecsBentoProps {
  room: RoomEntity;
  detail: RoomDetailSpec;
}

export function RoomSpecsBento({ room, detail }: RoomSpecsBentoProps) {
  const m = detail.floorPlanMetrics;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
          Architectural Blueprint
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#142019] font-light">
          Spatial Dimensions & Craftsmanship
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Spatial Footprint Breakdown (2 cols wide) */}
        <div className="md:col-span-2 rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-xs">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] p-6 sm:p-8 space-y-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#142019]/5 border border-[#C5A880]/30 flex items-center justify-center text-[#142019]">
                  <Maximize2 className="w-5 h-5 text-[#C5A880]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#142019]">Total Living Footprint</h3>
                  <p className="text-xs font-mono text-[#5F635F] uppercase">Interior + En-Suite + Outdoor</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif text-3xl sm:text-4xl text-[#142019]">
                  {room.square_meters} <span className="text-sm font-mono text-[#C5A880]">m²</span>
                </div>
                <div className="text-xs font-mono text-[#5F635F]">{room.square_footage} sq.ft total</div>
              </div>
            </div>

            {/* Spatial Metrics Progress Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F0EBE1]">
              <div className="p-4 rounded-xl bg-white border border-[#F0EBE1] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#9E7F55] tracking-wider">Master Bedroom</span>
                <div className="font-serif text-2xl text-[#142019]">{m.bedroomM2} m²</div>
                <p className="text-[11px] text-[#5F635F]">Spacious living & sleeping zone</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#F0EBE1] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#9E7F55] tracking-wider">En-Suite Bath</span>
                <div className="font-serif text-2xl text-[#142019]">{m.bathroomM2} m²</div>
                <p className="text-[11px] text-[#5F635F]">Italian stone with rain shower</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#F0EBE1] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#9E7F55] tracking-wider">Private Outdoor</span>
                <div className="font-serif text-2xl text-[#142019]">{m.outdoorM2} m²</div>
                <p className="text-[11px] text-[#5F635F]">{detail.outdoorSpaceDesc.split('with')[0]}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#5F635F] pt-2">
              <span>Flooring: {detail.flooringMaterial}</span>
              <span className="text-[#C5A880]">Ceiling Clearance: {m.ceilingMeters} m</span>
            </div>
          </div>
        </div>

        {/* Card 2: Bed Configuration (1 col wide) */}
        <div className="rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-xs">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#142019]/5 border border-[#C5A880]/30 flex items-center justify-center text-[#142019]">
                <BedDouble className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">Sleep Architecture</span>
                <h3 className="font-serif text-xl text-[#142019]">{room.bed_type}</h3>
              </div>
              <p className="text-xs text-[#5F635F] leading-relaxed">
                Dressed in 400-thread-count Egyptian cotton percale linens with choice of Hungarian goose down or hypoallergenic contour pillows.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F0EBE1] space-y-2 text-xs font-mono text-[#142019]">
              <div className="flex justify-between">
                <span className="text-[#5F635F]">Bed Dimensions</span>
                <span>180 × 200 cm (King)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F635F]">Max Capacity</span>
                <span>{room.max_occupancy} Overnight Guests</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: En-Suite Sanctuary (1 col wide) */}
        <div className="rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-xs">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#142019]/5 border border-[#C5A880]/30 flex items-center justify-center text-[#142019]">
                <Bath className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">Bath Sanctuary</span>
                <h3 className="font-serif text-xl text-[#142019]">{detail.enSuiteSpecs.showerType}</h3>
              </div>
              <p className="text-xs text-[#5F635F] leading-relaxed">
                Clad in {detail.enSuiteSpecs.surface} with thermostatic control and {detail.enSuiteSpecs.toiletries}.
              </p>
            </div>

            <ul className="pt-4 border-t border-[#F0EBE1] space-y-1.5 text-xs text-[#5F635F]">
              {detail.enSuiteSpecs.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 4: Light & Outdoor Verandah (1 col wide) */}
        <div className="rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-xs">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#142019]/5 border border-[#C5A880]/30 flex items-center justify-center text-[#142019]">
                <Sun className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">Outdoor Extension</span>
                <h3 className="font-serif text-xl text-[#142019]">{detail.outdoorSpaceDesc}</h3>
              </div>
              <p className="text-xs text-[#5F635F] leading-relaxed">
                Framing {room.view_type} with direct access to estate grounds and bespoke outdoor cane seating.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F0EBE1] text-xs font-mono text-[#9E7F55]">
              {detail.compassOrientation}
            </div>
          </div>
        </div>

        {/* Card 5: Acoustic & Climate Insulation (1 col wide) */}
        <div className="rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-xs">
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] p-6 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#142019]/5 border border-[#C5A880]/30 flex items-center justify-center text-[#142019]">
                <VolumeX className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">Acoustic & Climate</span>
                <h3 className="font-serif text-xl text-[#142019]">Silent VRV & Soundproofing</h3>
              </div>
              <p className="text-xs text-[#5F635F] leading-relaxed">
                Double-glazed French wooden sashes provide total acoustic tranquility against countryside stillness, paired with independent Daikin VRV temperature zoning.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F0EBE1] flex items-center gap-2 text-xs font-mono text-[#5F635F]">
              <Wind className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Independent In-Room Thermostat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
