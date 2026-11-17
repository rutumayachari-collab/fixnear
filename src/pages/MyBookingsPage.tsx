import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFixNear } from '../context/FixNearContext';
import { Booking } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { BookingDetailModal } from '../components/bookings/BookingDetailModal';
import { formatINR, formatDateIndian } from '../utils/formatters';
import { Search, PlusCircle, Inbox } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { bookings } = useFixNear();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const provName = (b.providerName || (b as any).helperName || '').toLowerCase();
    const custName = (b.customerName || '').toLowerCase();
    const desc = (b.problemDescription || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      b.id.toLowerCase().includes(q) ||
      provName.includes(q) ||
      custName.includes(q) ||
      desc.includes(q);

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-8 md:py-12 bg-[#F8F8F5] min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                My Bookings & Service Status
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {bookings.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Track real-time progress of your repair requests from submission to completion.
            </p>
          </div>

          <Link
            to="/services"
            className="self-start sm:self-auto px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-2"
          >
            <PlusCircle size={15} />
            <span>Book New Service</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by Booking ID, technician or problem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs rounded-xl border border-gray-300 pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['all', 'Requested', 'Accepted', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
                  statusFilter === st
                    ? 'bg-[#0B1F3A] text-white shadow-2xs'
                    : 'bg-gray-100 text-[#667085] hover:bg-gray-200 hover:text-black'
                }`}
              >
                {st === 'all' ? 'All Bookings' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Display: Responsive Table on Desktop, Cards on Mobile */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs text-[#172033]">
                <thead className="bg-gray-100/75 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Service & Provider</th>
                    <th className="py-3 px-4">Booked Date</th>
                    <th className="py-3 px-4">Preferred Appointment</th>
                    <th className="py-3 px-4">Est. Charge</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#0B1F3A]">
                        {b.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-sm capitalize">
                          {b.category.replace('-', ' ')}
                        </div>
                        <div className="text-[11px] text-[#667085] flex items-center gap-1">
                          <span>Technician:</span>
                          <span className="font-medium text-gray-700">{b.providerName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {formatDateIndian(b.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold">{formatDateIndian(b.preferredDate)}</div>
                        <div className="text-[11px] text-[#667085]">{b.preferredTime}</div>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#15803D]">
                        {formatINR(b.estimatedPrice)}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={b.status} size="md" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedBookingForDetails(b)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card-Based Booking View */}
            <div className="md:hidden space-y-3">
              {filteredBookings.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="font-mono font-bold text-sm text-[#0B1F3A]">{b.id}</span>
                    <StatusBadge status={b.status} size="sm" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#172033] capitalize">
                      {b.category.replace('-', ' ')} Service
                    </h3>
                    <p className="text-[#667085] mt-0.5">
                      Technician: <strong>{b.providerName}</strong>
                    </p>
                  </div>

                  <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200 line-clamp-2">
                    "{b.problemDescription}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#667085]">
                    <div>
                      <span className="block font-medium">Appointment:</span>
                      <span className="font-semibold text-gray-800">{formatDateIndian(b.preferredDate)}</span>
                    </div>
                    <div>
                      <span className="block font-medium">Estimated Charge:</span>
                      <span className="font-bold text-[#15803D] text-xs">{formatINR(b.estimatedPrice)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setSelectedBookingForDetails(b)}
                      className="w-full py-2 bg-[#0B1F3A] text-white rounded-lg text-xs font-semibold text-center"
                    >
                      View Details & Progress
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-2xs my-8">
            <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
              <Inbox size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172033]">
                No bookings found
              </h3>
              <p className="text-xs text-[#667085] mt-1">
                {statusFilter !== 'all' || searchQuery
                  ? 'No service bookings match your search query or filter.'
                  : "You haven't requested any home repair service yet."}
              </p>
            </div>
            <div className="pt-1">
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                <PlusCircle size={14} />
                <span>Book Your First Repair</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Details modal */}
      {selectedBookingForDetails && (
        <BookingDetailModal
          booking={selectedBookingForDetails}
          isOpen={true}
          onClose={() => setSelectedBookingForDetails(null)}
          allowCancel={true}
        />
      )}
    </div>
  );
};
