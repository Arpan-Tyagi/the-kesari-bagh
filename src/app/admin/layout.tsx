'use client';

// Estate Administration Control Center Shell Layout
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BedDouble, 
  Tag, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  Menu, 
  X 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview Analytics', href: '/admin', icon: LayoutDashboard },
    { label: 'Reservations', href: '/admin/reservations', icon: CalendarCheck },
    { label: 'Suite Inventory', href: '/admin/inventory', icon: BedDouble },
    { label: 'Promotion Engine', href: '/admin/coupons', icon: Tag },
    { label: 'Gemini Content Studio', href: '/admin/studio', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex bg-[#F7F5EE] text-[#2B2D2B]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#142019] text-[#FBF9F5] border-r border-[#C5A880]/30 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Admin Header */}
          <div className="flex items-center justify-between border-b border-[#C5A880]/20 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#C5A880] flex items-center justify-center font-serif text-[#C5A880] text-sm">
                KB
              </div>
              <div>
                <span className="font-serif text-base tracking-wider text-[#FBF9F5] uppercase block">
                  The Kesari Bagh
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A880] flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Control Center</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#C5A880] text-[#142019] font-bold shadow-md'
                      : 'text-[#FBF9F5]/70 hover:bg-white/5 hover:text-[#FBF9F5]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Return to Guest Platform */}
        <div className="p-6 border-t border-[#C5A880]/20 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C5A880] hover:text-[#DFCEB8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Guest Estate</span>
          </Link>
          <div className="text-[10px] text-[#FBF9F5]/40 font-mono">
            4 Keys Capacity • Manesar, Gurugram
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar on Mobile */}
        <header className="lg:hidden bg-[#142019] text-[#FBF9F5] p-4 flex items-center justify-between border-b border-[#C5A880]/30 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-[#C5A880] flex items-center justify-center font-serif text-[#C5A880] text-xs">
              KB
            </div>
            <span className="font-serif text-sm tracking-wider uppercase">Admin Control</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-[#C5A880]"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
