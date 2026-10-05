'use client';

// Room Inventory & Seasonal Tariff Management
import { useState } from 'react';
import { EstateService } from '@/lib/services/estate-service';
import { updateRoomPricingAction } from '@/actions/admin-actions';
import { Check, AlertCircle } from 'lucide-react';

export default function InventoryAdminPage() {
  const [rooms, setRooms] = useState(() => EstateService.getRooms());
  const [editTariff, setEditTariff] = useState<Record<string, { base: number; weekend: number }>>(() => {
    const initial: Record<string, { base: number; weekend: number }> = {};
    EstateService.getRooms().forEach((r) => {
      initial[r.id] = { base: r.base_price, weekend: r.weekend_price };
    });
    return initial;
  });

  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ id: string; text: string; error: boolean } | null>(null);

  const handleSaveTariff = async (roomId: string) => {
    setSavingId(roomId);
    setMessage(null);

    const values = editTariff[roomId];
    const res = await updateRoomPricingAction(roomId, values.base, values.weekend);
    setSavingId(null);

    if (res.success) {
      setMessage({ id: roomId, text: res.message, error: false });
      setRooms([...EstateService.getRooms()]);
    } else {
      setMessage({ id: roomId, text: res.message || 'Update failed', error: true });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="border-b border-[#E0CDB7] pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#9E7F55]">
          Estate Keys
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#142019] mt-1 font-light">
          Suite Inventory &amp; Tariffs
        </h1>
        <p className="text-xs text-[#5F635F] mt-1">
          Adjust weekday and weekend tariffs for all 4 authentic estate keys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => {
          const values = editTariff[room.id] || { base: room.base_price, weekend: room.weekend_price };
          const isSaving = savingId === room.id;
          const msg = message?.id === room.id ? message : null;

          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0CDB7] shadow-xs space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] bg-[#142019] px-2.5 py-0.5 rounded-full text-white">
                    {room.floor_level} Floor
                  </span>
                  <span className="text-xs font-mono text-[#5F635F]">
                    {room.square_meters} m² ({room.square_footage} sq.ft)
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-[#142019] font-medium">
                  {room.name}
                </h3>
                <p className="text-xs text-[#5F635F] leading-relaxed">
                  {room.short_description}
                </p>
              </div>

              {/* Tariff Inputs */}
              <div className="space-y-4 pt-4 border-t border-[#F0EBE1]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
                      Weekday Tariff (₹)
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={values.base}
                      onChange={(e) =>
                        setEditTariff({
                          ...editTariff,
                          [room.id]: { ...values, base: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-sm font-mono font-semibold text-[#142019] outline-hidden focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#5F635F]">
                      Weekend Tariff (₹)
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={values.weekend}
                      onChange={(e) =>
                        setEditTariff({
                          ...editTariff,
                          [room.id]: { ...values, weekend: Number(e.target.value) },
                        })
                      }
                      className="w-full rounded-xl border border-[#E0CDB7] bg-[#FBF9F5] px-3.5 py-2 text-sm font-mono font-semibold text-[#142019] outline-hidden focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {msg && (
                  <p
                    className={`text-xs flex items-center gap-1 font-mono ${
                      msg.error ? 'text-red-700' : 'text-emerald-800'
                    }`}
                  >
                    {msg.error ? (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <Check className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{msg.text}</span>
                  </p>
                )}

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveTariff(room.id)}
                  className="w-full rounded-full bg-[#142019] py-3 text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] hover:bg-[#23342A] transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Updating Tariff...' : 'Save Suite Tariff'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
