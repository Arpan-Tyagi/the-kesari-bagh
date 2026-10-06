'use client';

import { useState, useEffect } from 'react';
import { AUTHENTIC_ROOMS } from '@/lib/data/mock-estate-data';
import { PricingBreakdown } from '@/types/booking';
import { 
  checkAvailabilityAction, 
  calculatePricingAction 
} from '@/actions/booking-actions';
import { BookingStepDatesRoom } from './BookingStepDatesRoom';
import { BookingStepAddons } from './BookingStepAddons';
import { BookingStepGuest } from './BookingStepGuest';
import { BookingStepCheckoutHold } from './BookingStepCheckoutHold';
import { BookingStepConfirmation } from './BookingStepConfirmation';
import { BookingPricingSummary } from './BookingPricingSummary';

interface BookingFunnelProps {
  initialRoomId?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export function BookingFunnel({
  initialRoomId,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: BookingFunnelProps) {
  const today = new Date();
  const defIn = new Date(today);
  defIn.setDate(today.getDate() + 1);
  const defOut = new Date(today);
  defOut.setDate(today.getDate() + 3);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [roomId, setRoomId] = useState(initialRoomId || AUTHENTIC_ROOMS[0].id);
  const [checkIn, setCheckIn] = useState(initialCheckIn || defIn.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(initialCheckOut || defOut.toISOString().split('T')[0]);
  const [guestsCount, setGuestsCount] = useState(initialGuests || 2);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [idType, setIdType] = useState<string>('Passport');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [confirmedRefCode, setConfirmedRefCode] = useState('');

  const selectedRoom = AUTHENTIC_ROOMS.find((r) => r.id === roomId) || AUTHENTIC_ROOMS[0];

  // Refresh pricing calculation
  useEffect(() => {
    let active = true;
    const fetchPricing = async () => {
      const res = await calculatePricingAction(
        roomId,
        checkIn,
        checkOut,
        selectedAddonIds,
        couponCode || undefined
      );
      if (active && res.success && res.pricing) {
        setPricing(res.pricing);
      }
    };
    fetchPricing();
    return () => {
      active = false;
    };
  }, [roomId, checkIn, checkOut, selectedAddonIds, couponCode]);

  // Check date availability when dates or room changes
  useEffect(() => {
    let active = true;
    const verifyDates = async () => {
      setCheckingAvailability(true);
      const res = await checkAvailabilityAction({ roomId, checkIn, checkOut });
      if (active) {
        setCheckingAvailability(false);
        setIsAvailable(res.success ? res.isAvailable : false);
      }
    };
    verifyDates();
    return () => {
      active = false;
    };
  }, [roomId, checkIn, checkOut]);

  const handleToggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setStep(1);
    setSelectedAddonIds([]);
    setCouponCode('');
    setIdType('Passport');
    setConfirmedRefCode('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 5-Step Funnel Progress Indicator */}
      {step < 5 && (
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E0CDB7]/50 max-w-2xl mx-auto overflow-x-auto gap-3">
          {[
            { num: 1, label: 'Dates & Suite' },
            { num: 2, label: 'Curated Add-ons' },
            { num: 3, label: 'Privileges & Guest' },
            { num: 4, label: 'Checkout & Hold' },
          ].map((item) => (
            <div key={item.num} className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${
                  step === item.num
                    ? 'bg-[#142019] text-[#C5A880] ring-2 ring-[#C5A880]'
                    : step > item.num
                    ? 'bg-[#C5A880] text-[#142019]'
                    : 'bg-[#F0EBE1] text-[#5F635F]'
                }`}
              >
                {item.num}
              </div>
              <span className="hidden sm:inline text-xs font-mono uppercase tracking-wider text-[#142019]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: Form Left, Pricing Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className={step === 5 ? 'lg:col-span-12' : 'lg:col-span-8'}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E0CDB7] shadow-xl">
            {step === 1 && (
              <BookingStepDatesRoom
                roomId={roomId}
                checkIn={checkIn}
                checkOut={checkOut}
                guestsCount={guestsCount}
                isAvailable={isAvailable}
                checkingAvailability={checkingAvailability}
                onUpdate={(data) => {
                  if (data.roomId) setRoomId(data.roomId);
                  if (data.checkIn) setCheckIn(data.checkIn);
                  if (data.checkOut) setCheckOut(data.checkOut);
                  if (data.guestsCount) setGuestsCount(data.guestsCount);
                }}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <BookingStepAddons
                selectedAddonIds={selectedAddonIds}
                onToggleAddon={handleToggleAddon}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <BookingStepGuest
                guestName={guestName}
                guestEmail={guestEmail}
                guestPhone={guestPhone}
                idType={idType}
                specialRequests={specialRequests}
                couponCode={couponCode}
                subtotal={pricing?.baseRoomSubtotal || 15000}
                onUpdate={(data) => {
                  if (data.guestName !== undefined) setGuestName(data.guestName);
                  if (data.guestEmail !== undefined) setGuestEmail(data.guestEmail);
                  if (data.guestPhone !== undefined) setGuestPhone(data.guestPhone);
                  if (data.idType !== undefined) setIdType(data.idType);
                  if (data.specialRequests !== undefined) setSpecialRequests(data.specialRequests);
                }}
                onCouponApplied={(code) => setCouponCode(code)}
                onBack={() => setStep(2)}
                onSubmit={() => setStep(4)}
                isSubmitting={false}
              />
            )}

            {step === 4 && (
              <BookingStepCheckoutHold
                roomId={roomId}
                roomName={selectedRoom.name}
                checkIn={checkIn}
                checkOut={checkOut}
                guestsCount={guestsCount}
                guestName={guestName}
                guestEmail={guestEmail}
                guestPhone={guestPhone}
                idType={idType}
                addonIds={selectedAddonIds}
                couponCode={couponCode}
                specialRequests={specialRequests}
                pricing={pricing}
                onBack={() => setStep(3)}
                onConfirmed={(ref) => {
                  setConfirmedRefCode(ref);
                  setStep(5);
                }}
              />
            )}

            {step === 5 && (
              <BookingStepConfirmation
                referenceCode={confirmedRefCode}
                room={selectedRoom}
                checkIn={checkIn}
                checkOut={checkOut}
                guestsCount={guestsCount}
                guestName={guestName}
                guestEmail={guestEmail}
                guestPhone={guestPhone}
                pricing={pricing || undefined}
                onReset={handleReset}
              />
            )}
          </div>
        </div>

        {/* Pricing Summary Side Column (Steps 1-4) */}
        {step < 5 && (
          <div className="lg:col-span-4 sticky top-24">
            <BookingPricingSummary
              room={selectedRoom}
              pricing={pricing}
              couponCode={couponCode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
