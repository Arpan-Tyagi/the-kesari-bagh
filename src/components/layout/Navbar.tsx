'use client';

// Luxury French-Colonial Navigation Header with Transparent-to-Solid Scroll Transition
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Compass } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The Estate', href: '/#estate' },
    { label: 'Suites & Keys', href: '/rooms' },
    { label: 'Dining', href: '/#dining' },
    { label: 'Experiences', href: '/#experiences' },
    { label: 'Private Events', href: '/#events' },
    { label: 'Admin', href: '/admin' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#142019]/90 backdrop-blur-md border-b border-[#C5A880]/20 py-3 shadow-lg'
            : 'bg-gradient-to-b from-black/60 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Estate Brand Seal */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#C5A880]/60 flex items-center justify-center bg-[#142019]/40 group-hover:border-[#C5A880] transition-colors">
              <span className="font-serif text-[#C5A880] text-lg font-light">KB</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-[0.18em] text-[#FBF9F5] uppercase font-light">
                The Kesari Bagh
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#C5A880] uppercase font-mono">
                Manesar • Gurugram
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs tracking-[0.15em] uppercase text-[#FBF9F5]/80 hover:text-[#C5A880] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center gap-3 rounded-full bg-[#C5A880] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#142019] transition-all hover:bg-[#DFCEB8] hover:scale-[1.02]"
            >
              <span>Reserve Suite</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#142019]/10">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#FBF9F5] hover:text-[#C5A880] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#142019] flex flex-col justify-between px-8 py-24 text-[#FBF9F5] animate-in fade-in duration-300">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#C5A880] text-xs uppercase tracking-[0.25em] font-mono border-b border-[#C5A880]/20 pb-4">
              <Compass className="w-4 h-4" />
              <span>Estate Navigation</span>
            </div>
            <nav className="flex flex-col space-y-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-3xl font-light hover:text-[#C5A880] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="border-t border-[#C5A880]/20 pt-8 space-y-4">
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#C5A880] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#142019]"
            >
              <span>Reserve Your Suite</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <p className="text-center text-[10px] tracking-widest text-[#C5A880]/60 uppercase font-mono">
              Panchgaon-Mohamadpur Rd, NH 8, Manesar
            </p>
          </div>
        </div>
      )}
    </>
  );
}
