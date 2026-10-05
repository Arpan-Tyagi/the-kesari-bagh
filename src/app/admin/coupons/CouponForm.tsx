'use client';

// Create Privilege Coupon Form Modal / Card Component
import { useState } from 'react';
import { createPromotionCouponAction } from '@/actions/admin-actions';

interface CouponFormProps {
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

export function CouponForm({ onSuccess, onCancel }: CouponFormProps) {
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 15,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: '2026-12-31',
    min_booking_amount: 15000,
    usage_limit: 50,
  });

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const res = await createPromotionCouponAction({
      code: newCoupon.code,
      discount_type: newCoupon.discount_type,
      discount_value: Number(newCoupon.discount_value),
      valid_from: newCoupon.valid_from,
      valid_until: newCoupon.valid_until,
      min_booking_amount: Number(newCoupon.min_booking_amount),
      usage_limit: Number(newCoupon.usage_limit),
      is_active: true,
    });

    setSaving(false);
    if (res.success) {
      onSuccess(res.message);
    } else {
      setErrorMsg(res.message || 'Creation failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0CDB7] shadow-md space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-[#142019]">Issue Privilege Code</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-mono text-[#5F635F] hover:text-[#142019]"
        >
          Cancel
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 font-mono">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
            Code (e.g. MONSOON25)
          </label>
          <input
            type="text"
            required
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
            className="w-full uppercase rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs font-mono font-bold text-[#142019] outline-hidden focus:border-[#C5A880]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
            Type
          </label>
          <select
            value={newCoupon.discount_type}
            onChange={(e) =>
              setNewCoupon({
                ...newCoupon,
                discount_type: e.target.value as 'percentage' | 'fixed',
              })
            }
            className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs font-mono text-[#142019] outline-hidden focus:border-[#C5A880]"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
            Discount Value
          </label>
          <input
            type="number"
            required
            value={newCoupon.discount_value}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs font-mono font-bold text-[#142019] outline-hidden focus:border-[#C5A880]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
            Min Tariff Required (₹)
          </label>
          <input
            type="number"
            value={newCoupon.min_booking_amount}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, min_booking_amount: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs font-mono text-[#142019] outline-hidden focus:border-[#C5A880]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
            Valid Until
          </label>
          <input
            type="date"
            required
            value={newCoupon.valid_until}
            onChange={(e) => setNewCoupon({ ...newCoupon, valid_until: e.target.value })}
            className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs font-mono text-[#142019] outline-hidden focus:border-[#C5A880]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
            Usage Quota
          </label>
          <input
            type="number"
            value={newCoupon.usage_limit}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, usage_limit: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-xs font-mono text-[#142019] outline-hidden focus:border-[#C5A880]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#142019] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] hover:bg-[#23342A] disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Activate Privilege'}
        </button>
      </div>
    </form>
  );
}
