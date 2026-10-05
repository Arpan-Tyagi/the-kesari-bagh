'use client';

// Real-Time Pricing Summary Panel with Indian Boutique Hospitality 18% GST
import { PricingBreakdown } from '@/types/booking';
import { RoomEntity } from '@/types/database';
import { ShieldCheck, Tag } from 'lucide-react';

interface BookingPricingSummaryProps {
  room: RoomEntity;
  pricing: PricingBreakdown | null;
  couponCode?: string;
}

export function BookingPricingSummary({
  room,
  pricing,
  couponCode,
}: BookingPricingSummaryProps) {
  if (!pricing) {
    return (
      <div className="rounded-2xl border border-[#E0CDB7] bg-white p-6 space-y-4">
        <h4 className="font-serif text-lg text-[#142019]">Tariff Summary</h4>
        <p className="text-xs text-[#5F635F]">Calculating bespoke tariff...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#C5A880]/40 bg-[#F0EBE1]/40 p-6 space-y-5">
      <div className="border-b border-[#C5A880]/30 pb-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A880]">
          Folio Estimation
        </span>
        <h4 className="font-serif text-xl text-[#142019]">{room.name}</h4>
      </div>

      <div className="space-y-2.5 text-xs font-mono text-[#5F635F]">
        <div className="flex justify-between">
          <span>Room Tariff ({pricing.nightsCount} Night{pricing.nightsCount > 1 ? 's' : ''})</span>
          <span className="text-[#142019] font-medium">₹{pricing.baseRoomSubtotal.toLocaleString('en-IN')}</span>
        </div>

        {pricing.addonsSubtotal > 0 && (
          <div className="flex justify-between">
            <span>Curated Add-ons</span>
            <span className="text-[#142019] font-medium">+ ₹{pricing.addonsSubtotal.toLocaleString('en-IN')}</span>
          </div>
        )}

        {pricing.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-800">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>Privilege Discount ({couponCode})</span>
            </span>
            <span>- ₹{pricing.discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between pt-1 border-t border-[#E0CDB7]/60">
          <span>Taxable Subtotal</span>
          <span className="text-[#142019] font-medium">₹{pricing.taxableAmount.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between">
          <span>Hospitality GST (18%)</span>
          <span className="text-[#142019] font-medium">₹{pricing.gstAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="border-t border-[#C5A880]/40 pt-4 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-[#142019] font-semibold">
          Final Payable
        </span>
        <span className="font-serif text-2xl font-bold text-[#142019]">
          ₹{pricing.finalPayableAmount.toLocaleString('en-IN')}
        </span>
      </div>

      <div className="rounded-xl bg-white p-3 border border-[#E0CDB7] text-[11px] text-[#5F635F] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
        <span>Rate includes estate recreation, pool access, and library retreat.</span>
      </div>
    </div>
  );
}
