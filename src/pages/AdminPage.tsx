import React, { useState } from 'react';
import { useFixNear } from '../context/FixNearContext';
import { AdminStats } from '../components/admin/AdminStats';
import { AdminBookingsTable } from '../components/admin/AdminBookingsTable';
import { AdminProvidersTable } from '../components/admin/AdminProvidersTable';
import { Modal } from '../components/common/Modal';
import { ShieldCheck, ClipboardList, Users, RotateCcw } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { getDashboardStats, resetDemoData } = useFixNear();
  const [activeTab, setActiveTab] = useState<'bookings' | 'providers'>('bookings');
  const [showResetModal, setShowResetModal] = useState(false);

  const stats = getDashboardStats();

  const handleConfirmReset = () => {
    resetDemoData();
    setShowResetModal(false);
  };

  return (
    <div className="py-8 md:py-10 bg-[#F8F8F5] min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck size={18} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
                Administrator Console
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Demonstration oversight of bookings, technician assignments, and localized platform metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowResetModal(true)}
              className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* Dynamic Calculated Stats */}
        <AdminStats stats={stats} />

        {/* Tab switchers */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-[#0B1F3A] text-white shadow-2xs'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <ClipboardList size={15} />
            <span>Bookings Management ({stats.totalBookings})</span>
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'providers'
                ? 'bg-[#0B1F3A] text-white shadow-2xs'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            <Users size={15} />
            <span>Provider Directory ({stats.activeProviders})</span>
          </button>
        </div>

        {/* Active Tab View */}
        {activeTab === 'bookings' ? (
          <AdminBookingsTable />
        ) : (
          <AdminProvidersTable />
        )}
      </div>

      {/* Confirmation Modal for Reset */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Platform Demo Data?"
        subtitle="Restore initial sample providers and bookings"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#667085]">
            This will reset all service bookings, provider active toggles, and worker job assignments to their original demonstration state.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <strong>College Innovation Presentation:</strong> You can use this button right before showing the live workflow to the judges or audience.
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
            <button
              onClick={() => setShowResetModal(false)}
              className="px-3.5 py-2 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReset}
              className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
            >
              Yes, Reset Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
