'use client';

// Searchable and Filterable Reservation Control Center powered by TanStack Table
import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { EstateService } from '@/lib/services/estate-service';
import { updateBookingStatusAction } from '@/actions/admin-actions';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { BookingEntity, BookingStatus } from '@/types/database';
import { getReservationColumns } from './columns';

export default function ReservationsAdminPage() {
  "use no memo";
  const [bookings, setBookings] = useState<BookingEntity[]>(() => EstateService.getBookings());
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    await updateBookingStatusAction(id, status);
    setBookings([...EstateService.getBookings()]);
  };

  const filteredData = useMemo(() => {
    if (statusFilter === 'all') return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  const columns = useMemo(
    () => getReservationColumns(handleUpdateStatus),
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title & Search */}
      <div className="border-b border-[#E0CDB7] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#9E7F55]">
            TanStack Powered Folio Control
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#142019] mt-1 font-light">
            Guest Reservations
          </h1>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F635F]" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="w-full pl-10 pr-4 py-2 text-xs font-mono rounded-full border border-[#E0CDB7] bg-white outline-hidden focus:border-[#C5A880]"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'confirmed', 'checked_in', 'cancelled'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
              statusFilter === filter
                ? 'bg-[#142019] text-[#FBF9F5] shadow-xs'
                : 'bg-white border border-[#E0CDB7] text-[#5F635F] hover:bg-[#F0EBE1]'
            }`}
          >
            {filter.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* TanStack Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0CDB7] shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-[#E0CDB7] text-[#5F635F] uppercase tracking-wider">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-3 px-3">
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? 'cursor-pointer select-none flex items-center gap-1' : ''}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && <ArrowUpDown className="w-3 h-3 opacity-60" />}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-[#5F635F]">
                    No reservations matched your query.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-[#FBF9F5] transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 px-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-[#F0EBE1] pt-4 text-xs font-mono text-[#5F635F]">
          <div>
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-[#E0CDB7] disabled:opacity-40 hover:bg-[#FBF9F5]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-[#E0CDB7] disabled:opacity-40 hover:bg-[#FBF9F5]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
