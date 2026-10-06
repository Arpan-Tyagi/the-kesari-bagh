'use client';

// Step 4: Checkout Review & 15-Minute Inventory Hold TTL
import { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Key, Calendar, Users, AlertCircle, ArrowRight } from 'lucide-react';
import { createPendingReservationAction, confirmBookingDirectAction } from '@/actions/booking-hold-actions';
import { PricingBreakdown } from '@/types/booking';

interface BookingStepCheckoutHoldProps {
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  idType?: string;
  addonIds: string[];
  couponCode?: string;
  specialRequests?: string;
  pricing?: PricingBreakdown | null;
  onBack: () => void;
  onConfirmed: (referenceCode: string) => void;
}

export function BookingStepCheckoutHold({
  roomId,
  roomName,
  checkIn,
  checkOut,
  guestsCount,
  guestName,
  guestEmail,
  guestPhone,
  idType,
  addonIds,
  couponCode,
  specialRequests,
  onBack,
  onConfirmed,
}: BookingStepCheckoutHoldProps) {
  const [holdReference, setHoldReference] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15 * 60);
  const [isHolding, setIsHolding] = useState<boolean>(true);
  const [holdError, setHoldError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const lockInventory = async () => {
      setIsHolding(true);
      setHoldError(null);
      const res = await createPendingReservationAction({
        roomId,
        checkIn,
        checkOut,
        guestsCount,
        addonIds,
        couponCode: couponCode || undefined,
        guestName,
        guestEmail,
        guestPhone,
        idType,
        specialRequests: specialRequests || undefined,
        holdMinutes: 15,
      });

      if (!active) return;
      setIsHolding(false);

      if (res.success && res.referenceCode) {
        setHoldReference(res.referenceCode);
        if (res.expiresAt) {
          const diffMs = new Date(res.expiresAt).getTime() - Date.now();
          setSecondsRemaining(Math.max(0, Math.floor(diffMs / 1000)));
        }
      } else {
        setHoldError(res.message || 'Unable to secure transient hold on this suite.');
      }
    };

    lockInventory();
    return () => {
      active = false;
    };
  }, [roomId, checkIn, checkOut, guestsCount, addonIds, couponCode, guestName, guestEmail, guestPhone, idType, specialRequests]);

  useEffect(() => {
    if (secondsRemaining <= 0 || !holdReference) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining, holdReference]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleConfirmReservation = async () => {
    if (!holdReference || secondsRemaining <= 0) return;
    setIsConfirming(true);
    const res = await confirmBookingDirectAction(holdReference);
    setIsConfirming(false);

    if (res.success && res.referenceCode) {
      onConfirmed(res.referenceCode);
    } else {
      alert(res.message || 'Confirmation failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0CDB7]/60 pb-4">
        <h3 className="font-serif text-2xl text-[#142019]">Step 4: Checkout &amp; Inventory Hold</h3>
        <p className="text-xs text-[#5F635F]">Review reservation folio within the 15-minute transient hold.</p>
      </div>

      {isHolding ? (
        <div className="rounded-2xl border border-[#C5A880]/50 bg-[#F0EBE1]/40 p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#C5A880] animate-spin" />
          <span className="text-xs font-mono text-[#142019]">Locking suite dates in Supabase inventory with 15-minute hold TTL...</span>
        </div>
      ) : holdError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{holdError}</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#C5A880] bg-[#142019] p-5 text-[#FBF9F5] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A880]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>15-Minute Inventory Hold Active</span>
            </div>
            <h4 className="font-serif text-lg font-normal text-white">Suite Locked: {roomName}</h4>
            <p className="text-xs text-[#FBF9F5]/70 font-mono">
              Hold Folio: <span className="text-[#C5A880] font-bold">{holdReference}</span> • Concurrent sessions blocked
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#0D1611] rounded-xl px-4 py-2.5 border border-[#C5A880]/40">
            <Clock className="w-5 h-5 text-[#C5A880]" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#5F635F] block font-mono">Hold Remaining</span>
              <span className="text-xl font-mono font-bold text-[#C5A880]">{formatTimer(secondsRemaining)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-[#E0CDB7] bg-[#FAF8F5] p-5 space-y-4">
        <h4 className="font-serif text-base text-[#142019] border-b border-[#E0CDB7]/50 pb-2">Folio Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-[#5F635F] flex items-center gap-1"><Key className="w-3 h-3 text-[#C5A880]" />Suite</span>
            <p className="font-medium text-[#142019]">{roomName}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#5F635F] flex items-center gap-1"><Calendar className="w-3 h-3 text-[#C5A880]" />Stay Dates</span>
            <p className="font-medium text-[#142019]">{checkIn} to {checkOut} (2:00 PM / 11:00 AM)</p>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#5F635F] flex items-center gap-1"><Users className="w-3 h-3 text-[#C5A880]" />Guest</span>
            <p className="font-medium text-[#142019]">{guestName} ({guestsCount} adults)</p>
            <p className="text-[11px] text-[#5F635F]">{guestEmail} • {guestPhone} {idType ? `• ID: ${idType}` : ''}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#5F635F] flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#C5A880]" />Terms</span>
            <p className="font-medium text-[#142019]">Pay on Arrival / Pre-Authorization</p>
            <p className="text-[11px] text-[#5F635F]">Instant confirmation with WhatsApp &amp; Email</p>
          </div>
        </div>
        {specialRequests && (
          <div className="pt-2 border-t border-[#E0CDB7]/50 text-xs font-mono">
            <span className="text-[10px] uppercase text-[#5F635F] block">Special Requests</span>
            <p className="text-[#142019] italic">{specialRequests}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isConfirming}
          className="rounded-full border border-[#E0CDB7] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#142019] hover:bg-[#F0EBE1] disabled:opacity-50"
        >
          ← Back to Guest Info
        </button>
        <button
          type="button"
          disabled={!holdReference || secondsRemaining <= 0 || isConfirming || Boolean(holdError)}
          onClick={handleConfirmReservation}
          className="rounded-full bg-[#142019] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5] hover:bg-[#23342A] disabled:opacity-40 shadow-lg flex items-center gap-2"
        >
          <span>{isConfirming ? 'Finalizing Folio...' : 'Confirm Reservation ⚜️'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
