import React, { useState } from 'react';
import { Booking } from '../../types';
import { useFixNear } from '../../context/FixNearContext';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { formatINR, formatDateIndian, formatIndianPhone } from '../../utils/formatters';
import { MapPin, Phone, User, Wrench, Trash2 } from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  allowCancel?: boolean;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
  allowCancel = true,
}) => {
  const { cancelBooking } = useFixNear();
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!booking) return null;

  const handleConfirmCancel = () => {
    cancelBooking(booking.id, cancelReason.trim() || 'Cancelled by user request');
    setShowCancelPrompt(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Booking Details: {booking.id}</span>
          <StatusBadge status={booking.status} size="sm" />
        </div>
      }
      subtitle={`Created on ${formatDateIndian(booking.createdAt)}`}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Service & Provider */}
        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
            <span className="font-semibold text-sm text-[#0B1F3A] capitalize flex items-center gap-1.5">
              <Wrench size={14} className="text-[#3B82F6]" />
              {booking.category.replace('-', ' ')} Service
            </span>
            <span className="font-bold text-[#15803D] text-sm">
              {formatINR(booking.estimatedPrice)}
            </span>
          </div>

          <div className="space-y-1.5 text-[#172033]">
            <div className="flex justify-between">
              <span className="text-[#667085]">Assigned Provider:</span>
              <span className="font-semibold">{booking.providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Appointment Schedule:</span>
              <span className="font-medium">{formatDateIndian(booking.preferredDate)} ({booking.preferredTime})</span>
            </div>
          </div>
        </div>

        {/* Problem description */}
        <div>
          <span className="font-semibold text-[#172033] block mb-1">Issue Reported:</span>
          <p className="p-3 bg-white border border-gray-200 rounded-lg text-[#172033] leading-relaxed">
            {booking.problemDescription}
          </p>
        </div>

        {/* Customer & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
            <span className="text-[#667085] block font-medium">Customer Contact</span>
            <div className="flex items-center gap-1.5 font-semibold text-[#172033]">
              <User size={13} className="text-gray-400" />
              <span>{booking.customerName}</span>
            </div>
            <a
              href={`tel:${booking.customerPhone}`}
              className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold text-xs mt-0.5 hover:underline"
              title="Click to call via mobile dialer"
            >
              <Phone size={13} className="text-emerald-600" />
              <span>{formatIndianPhone(booking.customerPhone)}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Call</span>
            </a>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1">
            <span className="text-[#667085] block font-medium">Service Address</span>
            <div className="flex items-start gap-1.5 text-[#172033]">
              <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium leading-snug">{booking.customerAddress}</p>
                <p className="text-[11px] text-[#667085]">{booking.area}, PIN: {booking.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Worker notes or cancellation reason */}
        {booking.workerNotes && (
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900">
            <span className="font-semibold block mb-0.5">Technician / Update Note:</span>
            <p>{booking.workerNotes}</p>
          </div>
        )}

        {booking.cancellationReason && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
            <span className="font-semibold block mb-0.5">Cancellation Reason:</span>
            <p>{booking.cancellationReason}</p>
          </div>
        )}

        {/* Cancel section if allowed and requested */}
        {allowCancel && booking.status === 'Requested' && (
          <div className="pt-2 border-t border-gray-100">
            {!showCancelPrompt ? (
              <button
                type="button"
                onClick={() => setShowCancelPrompt(true)}
                className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-800 font-medium hover:underline text-xs"
              >
                <Trash2 size={13} />
                <span>Cancel this booking request</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                <span className="font-semibold text-rose-900 block">Are you sure you want to cancel?</span>
                <input
                  type="text"
                  placeholder="Optional reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full text-xs rounded border border-rose-300 p-2 bg-white"
                />
                <div className="flex items-center gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCancelPrompt(false)}
                    className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                  >
                    No, keep
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    className="px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700 font-semibold"
                  >
                    Yes, Cancel Request
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#142d52] text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
};
