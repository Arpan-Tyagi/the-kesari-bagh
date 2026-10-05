'use client';

// Dining Experiences & Culinary Portfolio for The Kesari Bagh
import Image from 'next/image';
import { Utensils, Flame, Sparkles, SunMedium } from 'lucide-react';

const DINING_EXPERIENCES = [
  {
    title: 'The French Chandelier Dining Salon',
    subtitle: '12-Seater Private Indoor Feast',
    description:
      'Dine under an authentic Parisian crystal chandelier in our private salon. Bespoke 4-course table d’hôte curated by the estate chef featuring royal Awadhi and continental countryside delicacies.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    icon: Sparkles,
  },
  {
    title: 'Live Countryside Barbecue Grill',
    subtitle: 'Evening Firepit & Skewers',
    description:
      'Gourmet live barbecue under the twilight stars of Manesar. Tender skewers, fresh local produce, grilled paneer, and farm-fresh marinade accompanied by estate-crafted herb bread.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    icon: Flame,
  },
  {
    title: 'Under-the-Sky Open-Air Dining',
    subtitle: 'Lawn Canopy & Starlight Suppers',
    description:
      'Set across our 1-acre manicured lawns with lanterns, low tables, and ambient candle warmth. An idyllic open-air evening facing the tranquil silhouette of the Aravalli hills.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    icon: SunMedium,
  },
  {
    title: 'Organic Kitchen Garden Picnics',
    subtitle: 'Hand-Picked Farm Luncheons',
    description:
      'Wicker basket luncheons arranged amidst our organic kitchen flora and ancient neem trees. Artisanal cheese boards, fresh sourdough, cold-pressed estate juices, and seasonal bakes.',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70e33f7?auto=format&fit=crop&w=1200&q=80',
    icon: Utensils,
  },
];

export function DiningSection() {
  return (
    <section id="dining" className="py-28 px-6 bg-[#142019] text-[#FBF9F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
            <Utensils className="w-4 h-4" />
            <span>Epicurean Gastronomy</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light">
            Artisanal Dining &amp; Open-Air Feasts
          </h2>
          <p className="text-sm sm:text-base text-[#FBF9F5]/70 font-light leading-relaxed">
            From formal grandeur beneath our 12-seater French chandelier to twilight barbecue skewers beside the open firepit.
          </p>
        </div>

        {/* 4 Dining Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {DINING_EXPERIENCES.map((exp) => {
            const Icon = exp.icon;
            return (
              <div
                key={exp.title}
                className="group relative rounded-2xl overflow-hidden border border-[#C5A880]/30 bg-[#0D1611]/60 flex flex-col transition-all duration-300 hover:border-[#C5A880]"
              >
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1611] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 p-2 rounded-full bg-[#142019]/80 backdrop-blur-md text-[#C5A880] border border-[#C5A880]/30">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
                      {exp.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl text-[#FBF9F5]">{exp.title}</h3>
                    <p className="text-xs sm:text-sm text-[#FBF9F5]/70 font-light leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
