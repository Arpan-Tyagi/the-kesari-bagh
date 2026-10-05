'use client';

// Overview KPI Metric Cards Component
import { TrendingUp, CalendarCheck, Users, Sparkles } from 'lucide-react';

interface OverviewKpisProps {
  totalRevenue: number;
  occupancyRate: number;
  activeCheckIns: number;
  confirmedCount: number;
}

export function OverviewKpis({
  totalRevenue,
  occupancyRate,
  activeCheckIns,
  confirmedCount,
}: OverviewKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-[#E0CDB7] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-[#5F635F]">
          <span className="text-[11px] font-mono uppercase tracking-wider">Gross Tariff Revenue</span>
          <TrendingUp className="w-4 h-4 text-[#C5A880]" />
        </div>
        <div className="font-serif text-3xl font-semibold text-[#142019]">
          ₹{totalRevenue.toLocaleString('en-IN')}
        </div>
        <p className="text-[10px] text-emerald-700 font-mono">Bespoke stays &amp; add-ons</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E0CDB7] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-[#5F635F]">
          <span className="text-[11px] font-mono uppercase tracking-wider">Estate Occupancy</span>
          <CalendarCheck className="w-4 h-4 text-[#C5A880]" />
        </div>
        <div className="font-serif text-3xl font-semibold text-[#142019]">
          {occupancyRate}%
        </div>
        <p className="text-[10px] text-[#5F635F] font-mono">Based on 4 private suites</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E0CDB7] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-[#5F635F]">
          <span className="text-[11px] font-mono uppercase tracking-wider">Active In-Residence</span>
          <Users className="w-4 h-4 text-[#C5A880]" />
        </div>
        <div className="font-serif text-3xl font-semibold text-[#142019]">
          {activeCheckIns} Guest Parties
        </div>
        <p className="text-[10px] text-[#5F635F] font-mono">Currently on-site</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E0CDB7] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-[#5F635F]">
          <span className="text-[11px] font-mono uppercase tracking-wider">Confirmed Bookings</span>
          <Sparkles className="w-4 h-4 text-[#C5A880]" />
        </div>
        <div className="font-serif text-3xl font-semibold text-[#142019]">
          {confirmedCount} Stays
        </div>
        <p className="text-[10px] text-emerald-700 font-mono">Upcoming reservations</p>
      </div>
    </div>
  );
}
