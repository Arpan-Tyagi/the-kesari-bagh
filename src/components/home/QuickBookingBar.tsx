'use client';

// Quick Booking Bar with Date Selection, Suite Filtering, and Direct Funnel Navigation
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Home, ArrowRight } from 'lucide-react';
import { AUTHENTIC_ROOMS } from '@/lib/data/mock-estate-data';

export function QuickBookingBar() {
  const router = useRouter();

  // Default dates: tomorrow to +2 days
  const today = new Date();
  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(today.getDate() + 1);
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setDate(today.getDate() + 3);

  const [checkIn, setCheckIn] = useState(defaultCheckIn.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(defaultCheckOut.toISOString().split('T')[0]);
  const [guests] = useState(2);
  const [selectedRoomId, setSelectedRoomId] = useState(AUTHENTIC_ROOMS[0].id);

  function getNextDay(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const yr = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${day}`;
  }

  const handleCheckInChange = (newVal: string) => {
    setCheckIn(newVal);
    if (checkOut <= newVal) {
      setCheckOut(getNextDay(newVal));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      roomId: selectedRoomId,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/book?${query.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-16 sm:-mt-20 relative z-20 px-4">
      <div className="double-bezel shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="double-bezel-inner p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center bg-[#FBF9F5]"
        >
          {/* Check-In */}
          <div className="flex flex-col space-y-1.5 border-b sm:border-b-0 sm:border-r border-[#C5A880]/30 pb-3 sm:pb-0 sm:pr-4">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#142019]/70 flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Arrival Date</span>
            </label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="bg-transparent text-sm font-medium text-[#142019] outline-hidden cursor-pointer"
              required
            />
          </div>

          {/* Check-Out */}
          <div className="flex flex-col space-y-1.5 border-b sm:border-b-0 lg:border-r border-[#C5A880]/30 pb-3 sm:pb-0 sm:pr-4">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#142019]/70 flex items-center gap-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Departure Date</span>
            </label>
            <input
              type="date"
              value={checkOut}
              min={getNextDay(checkIn)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent text-sm font-medium text-[#142019] outline-hidden cursor-pointer"
              required
            />
          </div>

          {/* Suite Selection */}
          <div className="flex flex-col space-y-1.5 border-b sm:border-b-0 sm:border-r border-[#C5A880]/30 pb-3 sm:pb-0 sm:pr-4">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#142019]/70 flex items-center gap-1.5 font-semibold">
              <Home className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Estate Key</span>
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#142019] outline-hidden cursor-pointer truncate"
            >
              {AUTHENTIC_ROOMS.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Action */}
          <div className="pt-2 sm:pt-0">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#142019] py-3.5 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5] hover:bg-[#23342A] transition-all hover:scale-[1.02] shadow-md"
            >
              <span>Check & Reserve</span>
              <div className="w-5 h-5 rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880]">
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
