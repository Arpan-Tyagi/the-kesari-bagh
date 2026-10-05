'use client';

// Step 2: Curated Estate Addons (Barbecue, Elly Encounter, Paragliding, Chandelier Dinner)
import { CURATED_ADDONS } from '@/lib/data/mock-estate-data';
import { Check, Plus } from 'lucide-react';

interface BookingStepAddonsProps {
  selectedAddonIds: string[];
  onToggleAddon: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function BookingStepAddons({
  selectedAddonIds,
  onToggleAddon,
  onBack,
  onNext,
}: BookingStepAddonsProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#E0CDB7]/60 pb-4">
        <h3 className="font-serif text-2xl text-[#142019]">Step 2: Curated Add-ons</h3>
        <p className="text-xs text-[#5F635F]">
          Enrich your stay with bespoke dining, equestrian sessions, and adventures.
        </p>
      </div>

      <div className="space-y-3">
        {CURATED_ADDONS.map((addon) => {
          const isSelected = selectedAddonIds.includes(addon.id);
          return (
            <div
              key={addon.id}
              onClick={() => onToggleAddon(addon.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'border-[#C5A880] bg-[#142019]/5 ring-1 ring-[#C5A880]'
                  : 'border-[#E0CDB7] bg-white hover:border-[#C5A880]/60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#9E7F55] bg-[#F0EBE1] px-2 py-0.5 rounded-full">
                    {addon.category}
                  </span>
                  <h4 className="font-serif text-base text-[#142019] font-medium">{addon.name}</h4>
                </div>
                <p className="text-xs text-[#5F635F] leading-relaxed max-w-lg">
                  {addon.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-serif text-base font-semibold text-[#142019]">
                  ₹{addon.price.toLocaleString('en-IN')}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#142019] text-[#C5A880]' : 'border border-[#E0CDB7] text-[#5F635F]'
                  }`}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </div>
            </div>
          );
        })}
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
          onClick={onNext}
          className="rounded-full bg-[#142019] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF9F5] hover:bg-[#23342A]"
        >
          Continue to Details →
        </button>
      </div>
    </div>
  );
}
