import React, { useState } from 'react';
import { Booking, BookingStatus } from '../../types';
import { useFixNear } from '../../context/FixNearContext';
import { StatusBadge } from '../common/StatusBadge';
import { BookingDetailModal } from '../bookings/BookingDetailModal';
import { formatINR, formatDateIndian, formatIndianPhone } from '../../utils/formatters';
import { Search, Eye } from 'lucide-react';

export const AdminBookingsTable: React.FC = () => {
  const { bookings, updateBookingStatus } = useFixNear();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.area.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus, `Status updated by Administrator to ${newStatus}.`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[#0B1F3A]">Service Bookings</h3>
          <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">
            {filteredBookings.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search ID, customer, provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 text-xs rounded-xl border border-gray-300 pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>

          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-gray-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Requested">Requested (New)</option>
            <option value="Accepted">Accepted</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-[#172033]">
          <thead className="bg-gray-100/75 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-[#667085]">
            <tr>
              <th className="py-3 px-4">Booking ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Trade & Provider</th>
              <th className="py-3 px-4">Appointment</th>
              <th className="py-3 px-4">Est. Charge</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4 text-right">Admin Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No bookings found matching current filters.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B1F3A]">
                    {b.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold">{b.customerName}</div>
                    <div className="text-[11px] text-[#667085] font-mono">{formatIndianPhone(b.customerPhone)}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[150px]">{b.area} ({b.pincode})</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize font-semibold text-blue-900 block">
                      {b.category.replace('-', ' ')}
                    </span>
                    <span className="text-[11px] text-[#667085]">{b.providerName}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div>{formatDateIndian(b.preferredDate)}</div>
                    <div className="text-[11px] text-[#667085]">{b.preferredTime}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#15803D]">
                    {formatINR(b.estimatedPrice)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {/* Status Change Selector */}
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                        className="text-[11px] bg-white border border-gray-300 rounded-lg px-2 py-1 font-semibold text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-[#3B82F6]"
                      >
                        <option value="Requested">Requested</option>
                        <option value="Accepted">Accepted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setSelectedBookingForDetails(b)}
                        className="p-1.5 text-gray-500 hover:text-[#0B1F3A] hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Full Booking Details"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card-Based Booking Layout */}
      <div className="md:hidden divide-y divide-gray-100 p-3 space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No bookings found matching current filters.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div key={b.id} className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#0B1F3A]">{b.id}</span>
                <StatusBadge status={b.status} size="sm" />
              </div>

              <div>
                <span className="font-semibold text-sm text-[#172033] block">{b.customerName}</span>
                <span className="text-[#667085]">{formatIndianPhone(b.customerPhone)} • {b.area}</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-gray-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Trade:</span>
                  <span className="font-semibold capitalize">{b.category.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Provider:</span>
                  <span className="font-medium text-gray-800">{b.providerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Schedule:</span>
                  <span>{formatDateIndian(b.preferredDate)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#15803D]">
                  <span>Est. Charge:</span>
                  <span>{formatINR(b.estimatedPrice)}</span>
                </div>
              </div>

              {/* Status change on mobile */}
              <div className="flex items-center justify-between pt-1">
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                  className="text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-semibold text-gray-700"
                >
                  <option value="Requested">Requested</option>
                  <option value="Accepted">Accepted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => setSelectedBookingForDetails(b)}
                  className="px-3 py-1.5 bg-[#0B1F3A] text-white rounded-lg text-xs font-semibold"
                >
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details modal */}
      {selectedBookingForDetails && (
        <BookingDetailModal
          booking={selectedBookingForDetails}
          isOpen={true}
          onClose={() => setSelectedBookingForDetails(null)}
          allowCancel={false}
        />
      )}
    </div>
  );
};
