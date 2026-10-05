'use client';

// Estate Overview Analytics & Real-Time Operational Dashboard
import { useState } from 'react';
import Link from 'next/link';
import { EstateService } from '@/lib/services/estate-service';
import { updateBookingStatusAction, updateInquiryStatusAction } from '@/actions/admin-actions';
import { ArrowUpRight } from 'lucide-react';
import { InquiryStatus } from '@/types/database';
import { OverviewKpis } from './OverviewKpis';

export default function AdminOverviewPage() {
  const [bookings, setBookings] = useState(() => EstateService.getBookings());
  const [inquiries, setInquiries] = useState(() => EstateService.getInquiries());
  const [viewTab, setViewTab] = useState<'bookings' | 'inquiries'>('bookings');

  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.total_price, 0);

  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const activeCheckIns = bookings.filter((b) => b.status === 'checked_in').length;
  const occupancyRate = Math.min(100, Math.round(((confirmedCount + activeCheckIns) / 4) * 100));

  const handleStatusChange = async (
    id: string,
    newStatus: 'confirmed' | 'cancelled' | 'checked_in'
  ) => {
    await updateBookingStatusAction(id, newStatus);
    setBookings([...EstateService.getBookings()]);
  };

  const handleInquiryStatus = async (id: string, status: InquiryStatus) => {
    await updateInquiryStatusAction(id, status);
    setInquiries([...EstateService.getInquiries()]);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="border-b border-[#E0CDB7] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#9E7F55]">
            Operational Intelligence
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#142019] mt-1 font-light">
            Estate Overview Analytics
          </h1>
        </div>

        <Link
          href="/admin/reservations"
          className="inline-flex items-center gap-2 rounded-full bg-[#142019] px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#FBF9F5] hover:bg-[#23342A] self-start"
        >
          <span>All Reservations</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <OverviewKpis
        totalRevenue={totalRevenue}
        occupancyRate={occupancyRate}
        activeCheckIns={activeCheckIns}
        confirmedCount={confirmedCount}
      />

      {/* Tabs & Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0CDB7] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E0CDB7]/50 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewTab('bookings')}
              className={`text-sm font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all ${
                viewTab === 'bookings'
                  ? 'bg-[#142019] text-[#FBF9F5]'
                  : 'text-[#5F635F] hover:bg-[#F0EBE1]'
              }`}
            >
              Recent Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setViewTab('inquiries')}
              className={`text-sm font-mono uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all ${
                viewTab === 'inquiries'
                  ? 'bg-[#142019] text-[#FBF9F5]'
                  : 'text-[#5F635F] hover:bg-[#F0EBE1]'
              }`}
            >
              Event Inquiries ({inquiries.length})
            </button>
          </div>
        </div>

        {viewTab === 'bookings' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#E0CDB7] text-[#5F635F] uppercase tracking-wider">
                  <th className="py-3 px-3">Reference ID</th>
                  <th className="py-3 px-3">Guest Name</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3">Tariff</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {bookings.slice(0, 6).map((b) => (
                  <tr key={b.id} className="hover:bg-[#FBF9F5] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[#142019]">{b.reference_code}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-serif text-sm font-medium text-[#142019]">{b.guest_name}</div>
                      <div className="text-[10px] text-[#5F635F]">{b.guest_phone}</div>
                    </td>
                    <td className="py-3.5 px-3 text-[11px] text-[#5F635F]">
                      {b.check_in} → {b.check_out} ({b.nights_count}N)
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[#142019]">
                      ₹{b.total_price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'checked_in'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1.5">
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'checked_in')}
                          className="rounded-md bg-[#142019] px-2.5 py-1 text-[10px] text-[#FBF9F5] hover:bg-[#23342A]"
                        >
                          Check-in
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(b.id, 'cancelled')}
                          className="rounded-md border border-red-300 px-2 py-1 text-[10px] text-red-700 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#E0CDB7] text-[#5F635F] uppercase tracking-wider">
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Event Type</th>
                  <th className="py-3 px-3">Guests</th>
                  <th className="py-3 px-3">Target Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#FBF9F5] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-serif text-sm font-medium text-[#142019]">{inq.name}</div>
                      <div className="text-[10px] text-[#5F635F]">{inq.email} • {inq.phone}</div>
                    </td>
                    <td className="py-3.5 px-3 uppercase text-[11px] text-[#142019]">
                      {inq.event_type.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-3">{inq.guest_count}</td>
                    <td className="py-3.5 px-3">{inq.preferred_date}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-amber-100 text-amber-800">
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1.5">
                      {inq.status === 'new' && (
                        <button
                          onClick={() => handleInquiryStatus(inq.id, 'contacted')}
                          className="rounded-md bg-[#142019] px-2.5 py-1 text-[10px] text-[#FBF9F5]"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {inq.status === 'contacted' && (
                        <button
                          onClick={() => handleInquiryStatus(inq.id, 'scheduled')}
                          className="rounded-md border border-[#C5A880] px-2 py-1 text-[10px] text-[#142019]"
                        >
                          Mark Scheduled
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
