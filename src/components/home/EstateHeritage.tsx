'use client';

// Estate Heritage & French-Colonial Architectural Narrative
import Image from 'next/image';
import { Sparkles, MapPin } from 'lucide-react';

export function EstateHeritage() {
  return (
    <section id="estate" className="py-28 px-6 bg-[#FBF9F5] border-t border-[#C5A880]/20">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Block (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
              <Sparkles className="w-4 h-4" />
              <span>Architectural Restraint</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl text-[#142019] font-light leading-tight">
              French-Colonial Solitude in the Heart of Manesar
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5F635F] leading-relaxed font-light">
              <p>
                Spanning 1.25 private acres with a 1-acre manicured emerald lawn,{' '}
                <strong className="text-[#142019] font-medium">The Kesari Bagh</strong> stands as an intentional counterweight to the frantic tempo of Delhi and Gurugram. Surrounded by indigenous neem and ancient oak groves, the estate looks outward toward the rugged silhouettes of the Aravalli range.
              </p>
              <p>
                Classical French symmetry is honored throughout: high sash French windows framing morning mist, polished teakwood furnishings with hairline brass inlays, and an intimate salon crowned by a 12-seater Parisian crystal chandelier.
              </p>
            </div>

            {/* Estate Key Spatial Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E0CDB7]/60 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#C5A880] uppercase tracking-wider block">Scale</span>
                <span className="font-serif text-xl text-[#142019] font-semibold">1.25 Acres</span>
                <p className="text-[11px] text-[#5F635F]">1-acre lawn</p>
              </div>
              <div>
                <span className="text-[10px] text-[#C5A880] uppercase tracking-wider block">Capacity</span>
                <span className="font-serif text-xl text-[#142019] font-semibold">4 Keys Only</span>
                <p className="text-[11px] text-[#5F635F]">Max 16 guests</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#C5A880] uppercase tracking-wider block">Access</span>
                <span className="font-serif text-xl text-[#142019] font-semibold">NH 8 Route</span>
                <p className="text-[11px] text-[#5F635F]">45 min from Cyber Hub</p>
              </div>
            </div>
          </div>

          {/* Right Dual-Framed Imagery (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="double-bezel shadow-2xl">
              <div className="double-bezel-inner relative h-96 sm:h-[460px] w-full overflow-hidden">
                <Image
                  src="/images/estate-heritage-grounds.jpg"
                  alt="The Kesari Bagh French-Colonial Countryside Architecture"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#142019]/80 backdrop-blur-md rounded-xl p-3 border border-[#C5A880]/30 text-white text-xs">
                  <div className="flex items-center gap-1.5 text-[#C5A880] font-mono text-[10px] uppercase tracking-widest">
                    <MapPin className="w-3 h-3" />
                    <span>Village Para, Manesar</span>
                  </div>
                  <p className="font-serif text-sm mt-0.5">Behind Best Western Country Club, NH 8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
