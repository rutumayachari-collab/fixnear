import React, { useState } from 'react';
import { Booking } from '../../types';
import { formatINR, formatDateIndian, formatIndianPhone } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { Phone, CheckCircle2, MapPin, Calendar, Wrench } from 'lucide-react';

interface WorkerJobCardProps {
  job: Booking;
  onAccept: (jobId: string) => void;
  onComplete: (jobId: string, notes?: string) => void;
}

export const WorkerJobCard: React.FC<WorkerJobCardProps> = ({ job, onAccept, onComplete }) => {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');

  const handleConfirmComplete = () => {
    onComplete(job.id, completionNotes.trim() || 'Work completed successfully by technician.');
    setShowCompleteModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 shadow-xs space-y-4 hover:border-gray-300 transition-colors">
        {/* Header: Service name & status */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
              Job ID: {job.id}
            </span>
            <h3 className="text-lg font-bold text-[#0B1F3A] capitalize flex items-center gap-1.5 mt-0.5">
              <Wrench size={16} className="text-[#3B82F6]" />
              {job.category.replace('-', ' ')}
            </h3>
          </div>
          <StatusBadge status={job.status} size="md" />
        </div>

        {/* Problem description */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5">
          <span className="text-[11px] uppercase font-bold text-amber-900 block mb-1">
            Customer Problem:
          </span>
          <p className="text-sm font-medium text-[#172033] leading-relaxed">
            "{job.problemDescription}"
          </p>
        </div>

        {/* Schedule & Location details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2 text-gray-700">
            <Calendar size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-[#172033]">Date & Time</span>
              <span>{formatDateIndian(job.preferredDate)}</span>
              <span className="block text-[#667085] text-[11px]">{job.preferredTime}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-gray-700">
            <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-[#172033]">Customer Address</span>
              <span className="leading-snug">{job.customerAddress}</span>
              <span className="block text-[#667085] text-[11px]">Area: {job.area} ({job.pincode})</span>
            </div>
          </div>
        </div>

        {/* Customer contact & pricing */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#667085] block">
              Customer: {job.customerName}
            </span>
            <span className="text-sm font-mono font-bold text-[#172033]">
              {formatIndianPhone(job.customerPhone)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#667085] block">
              Estimated Charge
            </span>
            <span className="text-base font-bold text-[#15803D]">
              {formatINR(job.estimatedPrice)}
            </span>
          </div>
        </div>

        {/* Action Buttons (Large, touch-friendly!) */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Action 1: Call Customer */}
          <a
            href={`tel:${job.customerPhone}`}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Phone size={18} />
            <span>Call Customer</span>
          </a>

          {/* Action 2: If Requested -> Accept Job */}
          {job.status === 'Requested' && (
            <button
              type="button"
              onClick={() => onAccept(job.id)}
              className="flex-1 py-3 px-4 bg-[#0B1F3A] hover:bg-[#142d52] active:bg-[#071324] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>Accept Job</span>
            </button>
          )}

          {/* Action 3: If Accepted / In Progress -> Mark Completed */}
          {(job.status === 'Accepted' || job.status === 'In Progress') && (
            <button
              type="button"
              onClick={() => setShowCompleteModal(true)}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <CheckCircle2 size={18} />
              <span>Mark as Completed</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Marking Job Completed */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Repair Job?"
        subtitle={`Booking ID: ${job.id} for ${job.customerName}`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#667085]">
            Confirm that you have completed this repair work. This will update the status to <strong>Completed</strong> in both Customer and Admin portals.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1">
              Work Notes / Spare Parts Used (Optional):
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Replaced faulty washer and cleared pipe blockage. Work done."
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              className="w-full text-xs rounded-lg border border-gray-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowCompleteModal(false)}
              className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmComplete}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              Yes, Job Done
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
