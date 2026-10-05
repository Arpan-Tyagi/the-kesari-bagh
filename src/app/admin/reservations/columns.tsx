// TanStack Table Column Definitions for Reservations Control
import { createColumnHelper } from '@tanstack/react-table';
import { BookingEntity, BookingStatus } from '@/types/database';

const columnHelper = createColumnHelper<BookingEntity>();

export function getReservationColumns(
  onUpdateStatus: (id: string, status: BookingStatus) => Promise<void>
) {
  return [
    columnHelper.accessor('reference_code', {
      header: 'Ref ID',
      cell: (info) => (
        <span className="font-semibold text-[#142019]">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('guest_name', {
      header: 'Guest Details',
      cell: (info) => {
        const row = info.row.original;
        return (
          <div>
            <div className="font-serif text-sm font-semibold text-[#142019]">{row.guest_name}</div>
            <div className="text-[11px] text-[#5F635F]">{row.guest_email}</div>
            <div className="text-[10px] text-[#9E7F55]">{row.guest_phone}</div>
          </div>
        );
      },
    }),
    columnHelper.accessor('check_in', {
      header: 'Stay Dates',
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="text-[11px]">
            <div>{row.check_in} → {row.check_out}</div>
            <div className="text-[#5F635F]">{row.nights_count} Night(s)</div>
          </div>
        );
      },
    }),
    columnHelper.accessor('guests_count', {
      header: 'Guests',
      cell: (info) => <div className="text-center">{info.getValue()}</div>,
    }),
    columnHelper.accessor('total_price', {
      header: 'Gross Folio',
      cell: (info) => (
        <span className="font-semibold text-[#142019]">
          ₹{info.getValue().toLocaleString('en-IN')}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const val = info.getValue();
        return (
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold ${
              val === 'confirmed'
                ? 'bg-emerald-100 text-emerald-800'
                : val === 'checked_in'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            {val}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => {
        const b = info.row.original;
        return (
          <div className="text-right space-x-1.5">
            {b.status !== 'checked_in' && b.status !== 'cancelled' && (
              <button
                onClick={() => onUpdateStatus(b.id, 'checked_in')}
                className="rounded-md bg-[#142019] px-2.5 py-1 text-[10px] text-[#FBF9F5] hover:bg-[#23342A]"
              >
                Check-in
              </button>
            )}
            {b.status === 'checked_in' && (
              <button
                onClick={() => onUpdateStatus(b.id, 'confirmed')}
                className="rounded-md border border-[#C5A880] px-2 py-1 text-[10px] text-[#142019] hover:bg-[#F0EBE1]"
              >
                Reset
              </button>
            )}
            {b.status !== 'cancelled' && (
              <button
                onClick={() => onUpdateStatus(b.id, 'cancelled')}
                className="rounded-md border border-red-300 px-2 py-1 text-[10px] text-red-700 hover:bg-red-50"
              >
                Cancel
              </button>
            )}
          </div>
        );
      },
    }),
  ];
}
