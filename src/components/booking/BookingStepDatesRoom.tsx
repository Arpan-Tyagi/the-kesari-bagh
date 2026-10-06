'use client';

// Step 1: Room Suite & Date Range Selection with Realtime Availability Check
import { AUTHENTIC_ROOMS } from '@/lib/data/mock-estate-data';
import { Calendar, Users, Key, AlertCircle } from 'lucide-react';

interface BookingStepDatesRoomProps {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  isAvailable: boolean | null;
  checkingAvailability: boolean;
  onUpdate: (data: { roomId?: string; checkIn?: string; checkOut?: string; guestsCount?: number }) => void;
  onNext: () => void;
}

export function BookingStepDatesRoom({
  roomId,
  checkIn,
  checkOut,
  guestsCount,
  isAvailable,
  checkingAvailability,
  onUpdate,
  onNext,
}: BookingStepDatesRoomProps) {
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
    if (checkOut <= newVal) {
      onUpdate({ checkIn: newVal, checkOut: getNextDay(newVal) });
    } else {
      onUpdate({ checkIn: newVal });
    }
  };

  const isDateRangeInvalid = checkOut <= checkIn;

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0CDB7]/60 pb-4">
        <h3 className="font-serif text-2xl text-[#142019]">Step 1: Suite &amp; Dates</h3>
        <p className="text-xs text-[#5F635F]">Select your countryside suite and intended stay duration.</p>
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Check-In Date</span>
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={checkIn}
            onChange={(e) => handleCheckInChange(e.target.value)}
            className="w-full rounded-xl border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Check-Out Date</span>
          </label>
          <input
            type="date"
            min={getNextDay(checkIn)}
            value={checkOut}
            onChange={(e) => onUpdate({ checkOut: e.target.value })}
            className="w-full rounded-xl border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Guests Count Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Guests Count {roomId === 'whole-estate' ? '(Max 16 for Estate)' : '(Max 3 per Suite)'}</span>
          </label>
          <span className="text-[11px] font-mono text-[#9E7F55] font-semibold">{guestsCount} Guest{guestsCount > 1 ? 's' : ''}</span>
        </div>

        {roomId === 'whole-estate' ? (
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {[4, 6, 8, 10, 12, 14, 16].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onUpdate({ guestsCount: num })}
                className={`rounded-xl py-2 text-xs font-mono font-medium transition-all ${
                  guestsCount === num
                    ? 'bg-[#142019] text-[#FBF9F5] shadow-xs ring-1 ring-[#C5A880]'
                    : 'bg-white border border-[#E0CDB7] text-[#142019] hover:bg-[#F0EBE1]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onUpdate({ guestsCount: num })}
                className={`rounded-xl py-2.5 text-xs font-mono font-medium transition-all ${
                  guestsCount === num
                    ? 'bg-[#142019] text-[#FBF9F5] shadow-xs'
                    : 'bg-white border border-[#E0CDB7] text-[#142019] hover:bg-[#F0EBE1]'
                }`}
              >
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </button>
            ))}
          </div>
        )}

        {roomId !== 'whole-estate' && guestsCount > 3 && (
          <p className="text-xs text-red-700 flex items-center gap-1.5 font-mono pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Capacity limit exceeded: Maximum 3 guests permitted per individual suite.</span>
          </p>
        )}
      </div>

      {/* Room Suite Selection Cards */}
      <div className="space-y-3">
        <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F] flex items-center gap-1.5">
          <Key className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>Select Suite or Whole Estate</span>
        </label>

        <div className="space-y-3">
          {AUTHENTIC_ROOMS.map((room) => {
            const isSelected = room.id === roomId;
            return (
              <div
                key={room.id}
                onClick={() => onUpdate({ roomId: room.id, guestsCount: Math.min(guestsCount, 3) })}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#C5A880] bg-[#142019]/5 ring-1 ring-[#C5A880]'
                    : 'border-[#E0CDB7] bg-white hover:border-[#C5A880]/60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-[#142019] px-2 py-0.5 rounded-full text-white">
                      {room.floor_level} Floor
                    </span>
                    <h4 className="font-serif text-base text-[#142019] font-medium">{room.name}</h4>
                  </div>
                  <p className="text-xs text-[#5F635F] mt-1">
                    {room.square_meters} m² ({room.square_footage} sq.ft) • {room.view_type}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="font-serif text-lg font-semibold text-[#142019]">
                    ₹{room.base_price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#5F635F] block">/ night + GST</span>
                </div>
              </div>
            );
          })}

          {/* Whole Estate Buyout Option */}
          <div
            onClick={() => onUpdate({ roomId: 'whole-estate', guestsCount: Math.max(guestsCount, 4) })}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              roomId === 'whole-estate'
                ? 'border-[#C5A880] bg-[#142019]/5 ring-1 ring-[#C5A880]'
                : 'border-[#E0CDB7] bg-[#FAF8F5] hover:border-[#C5A880]/60'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FBF9F5] bg-[#9E7F55] px-2 py-0.5 rounded-full">
                  Whole Estate Buyout
                </span>
                <h4 className="font-serif text-base text-[#142019] font-medium">The Bagh Exclusive Entire Estate</h4>
              </div>
              <p className="text-xs text-[#5F635F] mt-1">
                All 4 Royal Suites (118.46 m²) • 1.25-Acre Grounds • Sleeps up to 16 Guests
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="font-serif text-lg font-semibold text-[#142019]">₹63,000</span>
              <span className="text-[11px] text-[#5F635F] block">/ night + GST</span>
            </div>
          </div>
        </div>
      </div>

      {isDateRangeInvalid && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Check-out date must be at least 1 night after check-in.</span>
        </div>
      )}

      {!isDateRangeInvalid && isAvailable === false && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>The selected suite has already been reserved for these dates. Please choose other dates.</span>
        </div>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={checkingAvailability || isAvailable === false || isDateRangeInvalid || (roomId !== 'whole-estate' && guestsCount > 3) || guestsCount > 16}
          className="w-full rounded-full bg-[#142019] py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5] transition-all hover:bg-[#23342A] disabled:opacity-50"
        >
          {checkingAvailability ? 'Checking Availability...' : 'Continue to Add-ons →'}
        </button>
      </div>
    </div>
  );
}
