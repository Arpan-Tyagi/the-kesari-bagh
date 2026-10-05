'use client';

// Estate Amenities & Leisure Grid
import { 
  Sparkles, 
  Waves, 
  Gamepad2, 
  BookOpen, 
  TreePine, 
  Wifi, 
  Coffee, 
  ShieldCheck 
} from 'lucide-react';

const AMENITIES = [
  {
    icon: Waves,
    name: 'Azure Swimming Pool',
    desc: 'Surrounded by sun loungers and manicured grass sit-outs.',
  },
  {
    icon: Gamepad2,
    name: 'Snooker & Recreation Lounge',
    desc: 'Full-size snooker table, table tennis, carrom, and board games.',
  },
  {
    icon: BookOpen,
    name: 'Curated Library Retreat',
    desc: 'Leather armchairs, literature, regional history, and tea service.',
  },
  {
    icon: TreePine,
    name: '1-Acre Manicured Lawns',
    desc: 'Expansive outdoor lawn sports including badminton and evening strolls.',
  },
  {
    icon: Sparkles,
    name: 'French Chandelier Salon',
    desc: '12-seater formal dining room for curated celebrations.',
  },
  {
    icon: Coffee,
    name: 'Artisanal Tea & French Press',
    desc: 'Estate-blended teas and single-origin coffee served all day.',
  },
  {
    icon: Wifi,
    name: 'High-Speed Estate Wi-Fi',
    desc: 'Seamless coverage across indoor suites and outdoor sit-outs.',
  },
  {
    icon: ShieldCheck,
    name: 'Gated Countryside Privacy',
    desc: 'Round-the-clock estate security and complete private seclusion.',
  },
];

export function EstateAmenities() {
  return (
    <section className="py-24 px-6 bg-[#F0EBE1]/40 border-y border-[#C5A880]/20">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Refined Comfort</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#142019] font-light">
            Curated Estate Amenities
          </h2>
          <p className="text-xs sm:text-sm text-[#5F635F]">
            Every amenity is designed to enhance tranquility and leisurely countryside recreation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {AMENITIES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="bg-white/80 backdrop-blur-xs p-6 rounded-2xl border border-[#C5A880]/20 space-y-3 transition-all hover:bg-white hover:shadow-md"
              >
                <div className="w-9 h-9 rounded-full bg-[#142019] text-[#C5A880] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-[#142019] font-medium leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-[#5F635F] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
