import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useFixNear } from '../../context/FixNearContext';
import { Users, HardHat, ShieldCheck, RotateCcw, Sparkles, UserPlus } from 'lucide-react';
import { Modal } from './Modal';

export const DemoRoleBanner: React.FC = () => {
  const { setCurrentRole, resetDemoData, bookings } = useFixNear();
  const navigate = useNavigate();
  const location = useLocation();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync role based on route if user navigates directly
  const activeMode = location.pathname.startsWith('/worker') 
    ? 'worker' 
    : location.pathname.startsWith('/admin') 
    ? 'admin' 
    : 'customer';

  const handleRoleSwitch = (role: 'customer' | 'worker' | 'admin') => {
    setCurrentRole(role);
    if (role === 'customer') {
      if (location.pathname.startsWith('/worker') || location.pathname.startsWith('/admin')) {
        navigate('/');
      }
    } else if (role === 'worker') {
      navigate('/worker');
    } else if (role === 'admin') {
      navigate('/admin');
    }
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
    navigate('/');
  };

  const pendingRequests = bookings.filter(b => b.status === 'Requested').length;

  return (
    <>
      <div className="bg-[#0B1F3A] text-white border-b border-[#1E3A5F] py-2 px-3 sm:px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Left badge */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wide text-gray-200 uppercase text-[11px] flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-400" />
              Demo Mode Active
            </span>
            <span className="hidden md:inline text-gray-400 border-l border-gray-700 pl-2">
              Shared reactive state across all roles
            </span>
          </div>

          {/* Role switcher buttons */}
          <div className="flex items-center gap-1.5 bg-[#152E52] p-1 rounded-lg border border-white/10">
            <button
              onClick={() => handleRoleSwitch('customer')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                activeMode === 'customer'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              title="Customer Mode: Browse, search by PIN code, and book repairs"
            >
              <Users size={13} />
              <span>Need Help (Customer)</span>
            </button>

            <button
              onClick={() => handleRoleSwitch('worker')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all relative ${
                activeMode === 'worker'
                  ? 'bg-amber-400 text-gray-900 shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              title="Helper Mode: View requests, accept jobs, and update job status"
            >
              <HardHat size={13} />
              <span>I'm a Helper (Worker)</span>
              {pendingRequests > 0 && (
                <span className="ml-0.5 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {pendingRequests}
                </span>
              )}
            </button>

            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                activeMode === 'admin'
                  ? 'bg-[#3B82F6] text-white shadow-xs'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              title="Admin Portal: Monitor jobs, revenue, and provider directory"
            >
              <ShieldCheck size={13} />
              <span>Admin</span>
            </button>

            {/* Quick Register Helper Button */}
            <Link
              to="/register-helper"
              className="flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all text-xs"
              title="Register a new technician with a real PIN code"
            >
              <UserPlus size={13} />
              <span className="hidden sm:inline">+ Register Helper</span>
            </Link>
          </div>

          {/* Reset Demo Data */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1 text-gray-300 hover:text-rose-300 px-2 py-1 rounded hover:bg-white/5 transition-colors"
              title="Reset demonstration state back to original sample data"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset Demonstration Data?"
        subtitle="Restore the default sample providers and bookings"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#667085]">
            This action will clear any newly submitted bookings, provider status edits, and custom records in this browser session. It will reset the platform to the original demo dataset.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <strong>Note for College Presentation:</strong> Use this anytime you want to restart your live demonstration sequence from scratch.
          </div>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
            >
              Yes, Reset Data
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
