// All Accommodations Directory: The 4 Authentic Keys of The Kesari Bagh
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BedDouble, Maximize2, Compass, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';
import { EstateService } from '@/lib/services/estate-service';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Accommodations & Suites (4 Authentic Keys) | The Kesari Bagh',
  description: 'Explore the four intimate French-colonial suites of The Kesari Bagh retreat in Manesar, Gurugram. From poolside ground verandas to elevated Aravalli terraces.',
};

export default function RoomsDirectoryPage() {
  const rooms = EstateService.getRooms();

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2B2D2B]">
      <Navbar />

      {/* Directory Editorial Hero */}
      <section className="relative pt-36 pb-20 px-6 bg-[#142019] text-[#FBF9F5] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/hero-estate-facade.jpg"
            alt="The Kesari Bagh Estate"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
            <KeyRound className="w-3.5 h-3.5" />
            <span>The Residential Portfolio • Total 4 Keys</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light max-w-4xl leading-[1.08]">
            Four Intimate French-Colonial Suites
          </h1>

          <p className="text-base sm:text-xl text-[#FBF9F5]/80 font-light max-w-2xl leading-relaxed">
            Every bedroom at The Kesari Bagh is an individually curated sanctuary with high French casement windows, private outdoor living spaces, and views framing the Aravalli hills or heritage gardens.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-mono text-[#C5A880]">
            <span>• Maximum Estate Capacity: 16 Guests</span>
            <span>• 1.25-Acre Private Countryside Sanctuary</span>
            <span>• 45 km from New Delhi Airport (DEL)</span>
          </div>
        </div>
      </section>

      {/* Suites Showcase Grid */}
      <main className="max-w-7xl mx-auto px-6 py-24 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {rooms.map((room, idx) => (
            <div
              key={room.id}
              className="group rounded-[2rem] p-1.5 bg-[#F0EBE1] border border-[#C5A880]/30 transition-all duration-300 hover:shadow-xl"
            >
              <div className="rounded-[calc(2rem-0.375rem)] bg-white overflow-hidden flex flex-col h-full justify-between">
                <div>
                  {/* Image with Tag Overlays */}
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                    <Image
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-4 left-4 rounded-full bg-[#142019]/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/30">
                      Key 0{idx + 1} • {room.floor_level} Floor
                    </div>

                    <div className="absolute bottom-4 right-4 text-right">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#FBF9F5]/70 block">
                        From
                      </span>
                      <div className="font-serif text-2xl text-[#FBF9F5]">
                        ₹{room.base_price.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-sans text-[#C5A880]">/ night</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#9E7F55] uppercase tracking-wider">
                      <Compass className="w-3.5 h-3.5" />
                      <span>{room.view_type}</span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#142019] group-hover:text-[#9E7F55] transition-colors leading-snug">
                      <Link href={`/rooms/${room.slug}`}>
                        {room.name}
                      </Link>
                    </h2>

                    <p className="text-sm text-[#5F635F] leading-relaxed line-clamp-3 font-light">
                      {room.description}
                    </p>

                    {/* Spatial Metrics */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#F0EBE1] text-xs font-mono text-[#5F635F]">
                      <div className="flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-[#C5A880]" />
                        <span>{room.square_meters} m² ({room.square_footage} sq.ft)</span>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <BedDouble className="w-4 h-4 text-[#C5A880]" />
                        <span>{room.bed_type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="p-6 sm:p-8 pt-0 grid grid-cols-2 gap-3">
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="flex items-center justify-center gap-2 rounded-full border border-[#142019]/20 bg-white px-4 py-3 text-xs font-mono uppercase tracking-wider text-[#142019] hover:bg-[#F0EBE1] transition-colors"
                  >
                    <span>View Suite</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/book?roomId=${room.id}`}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#142019] px-4 py-3 text-xs font-mono uppercase tracking-wider text-[#FBF9F5] hover:bg-[#C5A880] hover:text-[#142019] transition-colors"
                  >
                    <span>Reserve</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Estate Buyout Feature */}
        <div className="rounded-[2.5rem] p-1.5 bg-[#142019] text-[#FBF9F5] shadow-xl">
          <div className="rounded-[calc(2.5rem-0.375rem)] border border-[#C5A880]/30 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Private Estate Buyout</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-light">
                Reserve All 4 Suites Exclusively
              </h3>
              <p className="text-sm sm:text-base text-[#FBF9F5]/70 font-light leading-relaxed">
                Experience uninterrupted seclusion by reserving the entire 1.25-acre estate for executive retreats, milestone celebrations, or multi-generational family getaways for up to 16 overnight guests.
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-[#C5A880]">
                <ShieldCheck className="w-4 h-4" />
                <span>Includes 12-seater French chandelier dining salon & private lawn</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                href="/book?roomId=whole-estate"
                className="rounded-full bg-[#C5A880] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#142019] hover:bg-[#FBF9F5] transition-colors text-center"
              >
                Book Full Estate Buyout
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
