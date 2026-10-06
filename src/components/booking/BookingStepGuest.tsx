'use client';

// Step 3: Guest Contact Details & Instant Coupon Verification
import { useState } from 'react';
import { verifyCouponAction } from '@/actions/booking-actions';
import { Tag, Check, AlertCircle } from 'lucide-react';

interface BookingStepGuestProps {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  idType?: string;
  specialRequests: string;
  couponCode: string;
  subtotal: number;
  onUpdate: (data: {
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    idType?: string;
    specialRequests?: string;
    couponCode?: string;
  }) => void;
  onCouponApplied: (code: string, discount: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function BookingStepGuest({
  guestName,
  guestEmail,
  guestPhone,
  idType = 'Passport',
  specialRequests,
  couponCode,
  subtotal,
  onUpdate,
  onCouponApplied,
  onBack,
  onSubmit,
  isSubmitting,
}: BookingStepGuestProps) {
  const [couponInput, setCouponInput] = useState(couponCode);
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setVerifyingCoupon(true);
    setCouponMsg(null);

    const res = await verifyCouponAction(couponInput, subtotal);
    setVerifyingCoupon(false);

    if (res.success && res.valid) {
      setCouponMsg({ text: res.message, error: false });
      onCouponApplied(couponInput.toUpperCase(), res.discountAmount || 0);
    } else {
      setCouponMsg({ text: res.message || 'Invalid coupon code', error: true });
    }
  };

  const isFormValid =
    guestName.trim().length >= 2 &&
    guestEmail.includes('@') &&
    guestPhone.trim().length >= 10;

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0CDB7]/60 pb-4">
        <h3 className="font-serif text-2xl text-[#142019]">Step 3: Guest &amp; Privileges</h3>
        <p className="text-xs text-[#5F635F]">
          Please enter your credentials for bespoke reservation notifications and WhatsApp dispatch.
        </p>
      </div>

      {/* Guest Contact Inputs */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
            Guest Full Name *
          </label>
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => onUpdate({ guestName: e.target.value })}
            placeholder="e.g. Vikramaditya Singhania"
            className="w-full rounded-xl border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={guestEmail}
              onChange={(e) => onUpdate({ guestEmail: e.target.value })}
              placeholder="vikram@singhania.co"
              className="w-full rounded-xl border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
              WhatsApp Phone *
            </label>
            <input
              type="tel"
              required
              value={guestPhone}
              onChange={(e) => onUpdate({ guestPhone: e.target.value })}
              placeholder="+91 98111 22334"
              className="w-full rounded-xl border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
              Government ID Type
            </label>
            <select
              value={idType}
              onChange={(e) => onUpdate({ idType: e.target.value })}
              className="w-full rounded-xl border border-[#E0CDB7] bg-white px-3.5 py-2.5 text-sm outline-hidden focus:border-[#C5A880]"
            >
              <option value="Passport">Passport</option>
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="Driver's License">Driver&apos;s License</option>
              <option value="Voter ID">Voter ID</option>
            </select>
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="rounded-xl border border-[#E0CDB7] bg-[#F0EBE1]/30 p-4 space-y-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#142019] flex items-center gap-1.5 font-semibold">
            <Tag className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Promotional Privilege Code</span>
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="e.g. BAGH15 or MONSOON20"
              className="flex-1 uppercase rounded-lg border border-[#E0CDB7] bg-white px-3 py-2 text-xs font-mono outline-hidden focus:border-[#C5A880]"
            />
            <button
              type="button"
              disabled={verifyingCoupon || !couponInput.trim()}
              onClick={handleApplyCoupon}
              className="rounded-lg bg-[#142019] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] hover:bg-[#23342A] disabled:opacity-40"
            >
              {verifyingCoupon ? 'Checking...' : 'Apply'}
            </button>
          </div>

          {couponMsg && (
            <p
              className={`text-xs flex items-center gap-1 font-mono ${
                couponMsg.error ? 'text-red-700' : 'text-emerald-800'
              }`}
            >
              {couponMsg.error ? (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Check className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{couponMsg.text}</span>
            </p>
          )}
        </div>

        {/* Special Requests */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-[#5F635F]">
            Dietary Preferences or Special Requests
          </label>
          <textarea
            rows={2}
            value={specialRequests}
            onChange={(e) => onUpdate({ specialRequests: e.target.value })}
            placeholder="e.g. Pure vegetarian meals, anniversary celebration, arrival by helicopter or luxury sedan..."
            className="w-full rounded-xl border border-[#E0CDB7] bg-white px-3.5 py-2 text-xs outline-hidden focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-[#E0CDB7] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#142019] hover:bg-[#F0EBE1]"
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!isFormValid || isSubmitting}
          onClick={onSubmit}
          className="rounded-full bg-[#142019] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5] hover:bg-[#23342A] disabled:opacity-40 shadow-lg"
        >
          {isSubmitting ? 'Preparing Hold...' : 'Proceed to Checkout & Hold →'}
        </button>
      </div>
    </div>
  );
}
