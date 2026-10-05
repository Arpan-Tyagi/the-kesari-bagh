'use client';

// Promotion Engine & Discount Privilege Management
import { useState } from 'react';
import { EstateService } from '@/lib/services/estate-service';
import { Tag, Plus, Check } from 'lucide-react';
import { CouponForm } from './CouponForm';

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState(() => EstateService.getCoupons());
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setCoupons([...EstateService.getCoupons()]);
    setShowForm(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="border-b border-[#E0CDB7] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#9E7F55]">
            Revenue Architecture
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#142019] mt-1 font-light">
            Privilege Promotion Engine
          </h1>
          <p className="text-xs text-[#5F635F] mt-1">
            Configure discount privileges, minimum tariffs, and usage quotas.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-full bg-[#142019] px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#FBF9F5] hover:bg-[#23342A] self-start"
        >
          <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>{showForm ? 'Close Form' : 'New Privilege Code'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2 font-mono">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {showForm && (
        <CouponForm
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0CDB7] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#E0CDB7] text-[#5F635F] uppercase tracking-wider">
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Privilege Value</th>
                <th className="py-3 px-3">Min Tariff</th>
                <th className="py-3 px-3">Valid Until</th>
                <th className="py-3 px-3">Usage</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="py-4 px-3 font-bold text-[#142019] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{c.code}</span>
                  </td>
                  <td className="py-4 px-3 font-semibold text-[#142019]">
                    {c.discount_type === 'percentage'
                      ? `${c.discount_value}% Off`
                      : `₹${c.discount_value.toLocaleString('en-IN')} Off`}
                  </td>
                  <td className="py-4 px-3 text-[#5F635F]">
                    {c.min_booking_amount ? `₹${c.min_booking_amount.toLocaleString('en-IN')}` : 'None'}
                  </td>
                  <td className="py-4 px-3 text-[#5F635F]">{c.valid_until}</td>
                  <td className="py-4 px-3 text-[#5F635F]">
                    {c.used_count} / {c.usage_limit}
                  </td>
                  <td className="py-4 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
