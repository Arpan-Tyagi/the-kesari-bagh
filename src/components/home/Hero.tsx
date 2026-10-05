'use client';

// Cinematic Editorial Hero Section for The Kesari Bagh
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { QuickBookingBar } from './QuickBookingBar';

export function Hero() {
  return (
    <div className="relative">
      {/* Viewport Hero */}
      <section className="relative min-h-[92dvh] sm:min-h-[96dvh] w-full flex items-center justify-center overflow-hidden bg-[#142019]">
        {/* Cinematic Backdrop Image with Vignette */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45 scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=85)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#142019] via-[#142019]/40 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(20,32,25,0.7)_100%)]" />

        {/* Hero Narrative Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-20 space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A880]/40 bg-[#142019]/70 px-4 py-1.5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A880]">
              French-Colonial Countryside Estate • Manesar
            </span>
          </div>

          {/* Magnetic Expressive Serif Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#FBF9F5] leading-[1.08]">
            An Unhurried Sanctuary in the{' '}
            <span className="italic font-normal text-[#C5A880]">Aravalli Foothills</span>
          </h1>

          {/* Atmospheric Subtext (Disciplined < 25 words) */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#FBF9F5]/80 font-light leading-relaxed">
            Only four private suites across 1.25 manicured acres. French chandeliers, countryside solitude, and equestrian grace.
          </p>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-3 rounded-full bg-[#C5A880] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#142019] transition-all hover:bg-[#DFCEB8] hover:scale-[1.02] shadow-xl"
            >
              <span>Explore The 4 Keys</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#142019]/10">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <a
              href="#estate"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#FBF9F5]/70 hover:text-[#C5A880] transition-colors py-2"
            >
              <span>The Estate Heritage</span>
            </a>
          </div>
        </div>

        {/* Subtle Brass Hairline Frame */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A880]/30 to-transparent" />
      </section>

      {/* Integrated Quick Booking Bar Floating Below Hero */}
      <QuickBookingBar />
    </div>
  );
}
