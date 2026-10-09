'use client';

// Estate Sanctuary Policies and Arrival Logistics
import { Clock, Ban, Cigarette, VolumeX, MapPin } from 'lucide-react';

export function RoomPolicies() {
  const policies = [
    {
      icon: Clock,
      title: 'Timings & Check-in',
      desc: 'Check-in commences at 2:00 PM. Check-out is at 11:00 AM. Early arrivals subject to prior key readiness.',
    },
    {
      icon: Ban,
      title: 'Strictly No Pets Policy',
      desc: 'To protect estate wildlife, manicured grounds, and our Marwari mare "Elly", pets are strictly prohibited.',
    },
    {
      icon: Cigarette,
      title: 'Non-Smoking Sanctuary',
      desc: 'All suites and indoor salons are 100% smoke-free. Designated outdoor smoking pavilions are provided.',
    },
    {
      icon: VolumeX,
      title: 'Quiet Countryside Hours',
      desc: 'After 11:00 PM, outdoor sound is reduced to preserve natural nighttime tranquility and star-gazing.',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
          Estate Etiquette
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#142019] font-light">
          Sanctuary Policies & Arrival Guide
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {policies.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 shadow-xs"
            >
              <div className="rounded-[calc(2rem-0.375rem)] bg-[#FBF9F5] p-5 space-y-3 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-full bg-[#142019]/5 border border-[#C5A880]/30 flex items-center justify-center text-[#142019]">
                    <Icon className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <h4 className="font-serif text-base text-[#142019] font-medium">
                    {p.title}
                  </h4>
                  <p className="text-xs text-[#5F635F] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrival Directions Banner */}
      <div className="rounded-2xl border border-[#C5A880]/30 bg-[#F0EBE1]/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880] shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif text-base text-[#142019]">Reaching The Kesari Bagh</h4>
            <p className="text-xs text-[#5F635F]">
              Located in Village Para, Manesar (NH 8). 45 km / 60 minutes from New Delhi International Airport (DEL).
            </p>
          </div>
        </div>
        <a
          href="https://maps.google.com/?q=28.3245,76.9018"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-mono uppercase tracking-[0.15em] text-[#142019] border-b border-[#142019] pb-0.5 hover:text-[#C5A880] hover:border-[#C5A880] transition-colors"
        >
          View Navigation Coordinates
        </a>
      </div>
    </section>
  );
}
