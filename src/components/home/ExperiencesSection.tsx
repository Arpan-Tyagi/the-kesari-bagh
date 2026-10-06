'use client';

// Curated Estate Experiences: Elly the Marwari Horse, Paragliding, Recreation
import Image from 'next/image';
import { Compass, Wind } from 'lucide-react';

export function ExperiencesSection() {
  return (
    <section id="experiences" className="py-28 px-6 bg-[#FBF9F5] relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
            <Compass className="w-4 h-4" />
            <span>Country Pursuits &amp; Adventure</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#142019] font-light">
            Equestrian Grace &amp; Aravalli Vistas
          </h2>
          <p className="text-sm sm:text-base text-[#5F635F] font-light leading-relaxed">
            From the royal lineage of our resident Marwari mare Elly to soaring airborne over Manesar&apos;s ancient rocky terrain.
          </p>
        </div>

        {/* Feature Grid: Elly Spotlight + Paragliding Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Elly Spotlight (7 Cols) */}
          <div className="lg:col-span-7 double-bezel group">
            <div className="double-bezel-inner h-full flex flex-col justify-between overflow-hidden bg-white">
              <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                <Image
                  src="/images/experience-elly-horse.jpg"
                  alt="Elly - Black Beauty Marwari Horse"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 rounded-full bg-[#142019]/80 backdrop-blur-md px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/30">
                  Estate Mascot
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C5A880]">
                    6ft 7in Marwari Bloodline
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl">Elly — &ldquo;Black Beauty&rdquo;</h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <p className="text-xs sm:text-sm text-[#5F635F] leading-relaxed font-light">
                  Distinguished by her graceful inward-curling lyre ears and noble temperament, Elly represents centuries of storied equestrian heritage. Guests are invited to participate in peaceful morning paddock walks, sunrise feeding sessions, and equestrian photography amid our neem groves.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[#142019] pt-2">
                  <span className="rounded-md bg-[#F0EBE1] px-2.5 py-1">Morning Paddock Walk</span>
                  <span className="rounded-md bg-[#F0EBE1] px-2.5 py-1">Equestrian Photography</span>
                </div>
              </div>
            </div>
          </div>

          {/* Paragliding Adventure (5 Cols) */}
          <div className="lg:col-span-5 double-bezel group">
            <div className="double-bezel-inner h-full flex flex-col justify-between overflow-hidden bg-white">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <Image
                  src="/images/experience-paragliding.jpg"
                  alt="Motorized Aravalli Paragliding"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 rounded-full bg-[#142019]/80 backdrop-blur-md px-3.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/30 flex items-center gap-1.5">
                  <Wind className="w-3 h-3" />
                  <span>Aerial Sortie</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
                    Aviation Adventure
                  </span>
                  <h3 className="font-serif text-2xl text-[#142019]">
                    Motorized Aravalli Paragliding
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F635F] leading-relaxed font-light">
                    Take to the skies above Manesar with certified aviators. Experience panoramic aerial vistas of the Aravalli ridges, countryside villages, and the expansive 1.25-acre estate grounds.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-xs font-mono text-[#C5A880] uppercase tracking-wider block">
                    Available as booking add-on (₹4,500)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
