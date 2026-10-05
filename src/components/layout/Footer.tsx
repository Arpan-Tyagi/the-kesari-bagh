// French-Colonial Countryside Estate Footer
import Link from 'next/link';
import { MapPin, Phone, Mail, Camera, Compass } from 'lucide-react';
import { ESTATE_DETAILS } from '@/lib/data/mock-estate-data';

export function Footer() {
  return (
    <footer className="border-t border-[#C5A880]/30 bg-[#142019] text-[#FBF9F5]">
      {/* Upper Footer: Brand & Estate Overview */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-[#C5A880] flex items-center justify-center text-[#C5A880] font-serif">
                KB
              </div>
              <span className="font-serif text-xl tracking-[0.15em] text-[#FBF9F5] uppercase">
                The Kesari Bagh
              </span>
            </div>
            <p className="text-sm text-[#FBF9F5]/70 leading-relaxed font-light">
              An exclusive 4-key French-colonial countryside retreat located in the serene Aravalli foothills of Manesar, Gurugram.
            </p>
            <div className="pt-2 text-xs font-mono text-[#C5A880] tracking-widest uppercase">
              1.25 Acres • Max 16 Guests
            </div>
          </div>

          {/* Estate Address & Driving Coordinates */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
              Estate Location
            </h4>
            <div className="flex items-start gap-2.5 text-sm text-[#FBF9F5]/80 font-light">
              <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <span>{ESTATE_DETAILS.address}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FBF9F5]/60 pt-2">
              <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{ESTATE_DETAILS.coordinates}</span>
            </div>
          </div>

          {/* Estate Contact & Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
              Direct Concierge
            </h4>
            <div className="space-y-2 text-sm text-[#FBF9F5]/80 font-light">
              <a
                href={`tel:${ESTATE_DETAILS.contact.phone}`}
                className="flex items-center gap-2 hover:text-[#C5A880] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <span>{ESTATE_DETAILS.contact.phone}</span>
              </a>
              <a
                href={`mailto:${ESTATE_DETAILS.contact.email}`}
                className="flex items-center gap-2 hover:text-[#C5A880] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C5A880]" />
                <span>{ESTATE_DETAILS.contact.email}</span>
              </a>
              <div className="flex items-center gap-2 pt-2">
                <Camera className="w-4 h-4 text-[#C5A880]" />
                <span className="text-xs tracking-wider">{ESTATE_DETAILS.contact.instagram}</span>
              </div>
            </div>
          </div>

          {/* Quick Estate Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
              Estate Portals
            </h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider text-[#FBF9F5]/70">
              <li>
                <Link href="/book" className="hover:text-[#C5A880] transition-colors">
                  Reserve Suite
                </Link>
              </li>
              <li>
                <a href="#suites" className="hover:text-[#C5A880] transition-colors">
                  The Four Suites
                </a>
              </li>
              <li>
                <a href="#dining" className="hover:text-[#C5A880] transition-colors">
                  French Chandelier Dining
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-[#C5A880] transition-colors">
                  Elly - Marwari Heritage
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-[#C5A880] hover:underline">
                  Administration Control Center
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Hairline & Legal Bar */}
      <div className="border-t border-[#C5A880]/15 bg-[#0D1611] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[#FBF9F5]/50 gap-4">
          <p>© {new Date().getFullYear()} The Kesari Bagh. All Rights Reserved. French-Colonial Countryside Estate.</p>
          <p className="font-mono text-[11px] tracking-wider text-[#C5A880]/70">
            Check-in 2:00 PM • Check-out 11:00 AM • Non-Smoking • Pet-Free Sanctuary
          </p>
        </div>
      </div>
    </footer>
  );
}
