'use client';

// Editorial Split Narrative with Material Swatches
import { Sparkles, Quote } from 'lucide-react';
import { RoomEntity } from '@/types/database';
import { RoomDetailSpec } from '@/lib/data/room-details-data';

interface RoomNarrativeProps {
  room: RoomEntity;
  detail: RoomDetailSpec;
}

export function RoomNarrative({ room, detail }: RoomNarrativeProps) {
  return (
    <section className="py-16 border-y border-[#C5A880]/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Editorial Storytelling (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[#F0EBE1] border border-[#C5A880]/30 text-[10px] uppercase font-mono tracking-[0.2em] text-[#C5A880]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curatorial Essay • {detail.keyNumber.split('•')[0].trim()}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-[#142019] font-light leading-tight">
            An Intimate Dialogue Between Architecture and Landscape
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#5F635F] leading-relaxed font-light">
            <p className="first-letter:font-serif first-letter:text-5xl first-letter:text-[#142019] first-letter:mr-3 first-letter:float-left first-letter:leading-none">
              {detail.narrative.intro}
            </p>
            <p>{detail.narrative.atmosphere}</p>
            <p>{detail.narrative.architecture}</p>
          </div>
        </div>

        {/* Right: Architectural Material Palette (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-xs">
            <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C5A880]">
                <Quote className="w-4 h-4" />
                <span>Estate Material Identity</span>
              </div>

              <blockquote className="font-serif italic text-lg sm:text-xl text-[#142019] leading-snug">
                &ldquo;Every suite at The Kesari Bagh is finished with raw regional tactility—stone that cools under the afternoon sun, brass that deepens in patina, and timber that holds the stillness of the countryside.&rdquo;
              </blockquote>

              {/* Material Chips Grid */}
              <div className="space-y-3 pt-4 border-t border-[#F0EBE1]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9E7F55] block">
                  Curated Suite Textures
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {detail.paletteMaterials.map((mat) => (
                    <div
                      key={mat.name}
                      className="p-3 rounded-xl bg-white border border-[#F0EBE1] flex items-center gap-3"
                    >
                      <div
                        className="w-7 h-7 rounded-full shrink-0 border border-black/10 shadow-inner"
                        style={{ backgroundColor: mat.hex }}
                      />
                      <div className="min-w-0">
                        <span className="font-serif text-xs text-[#142019] block truncate font-medium">
                          {mat.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#5F635F] block truncate">
                          {mat.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
