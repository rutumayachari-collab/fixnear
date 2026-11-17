import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFixNear } from '../../context/FixNearContext';
import { WorkerJobCard } from './WorkerJobCard';
import { WorkerProfile } from './WorkerProfile';
import { HardHat, CheckCircle2, Clock, Inbox, UserPlus } from 'lucide-react';

interface WorkerDashboardProps {
  initialTab?: 'new' | 'accepted' | 'completed' | 'profile';
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ initialTab = 'new' }) => {
  const location = useLocation();
  const defaultTab = location.pathname.includes('/profile') ? 'profile' : initialTab;
  const { 
    bookings, 
    providers, 
    selectedWorkerId, 
    setSelectedWorkerId, 
    updateBookingStatus 
  } = useFixNear();

  const [activeTab, setActiveTab] = useState<'new' | 'accepted' | 'completed' | 'profile'>(defaultTab);

  // Currently selected worker
  const currentWorker = providers.find(p => p.id === selectedWorkerId) || providers[0];

  // Filter jobs for this worker, or if 'all', show all
  const isAllWorkers = selectedWorkerId === 'all';
  const workerBookings = bookings.filter(b => {
    if (isAllWorkers) return true;
    if (!currentWorker) return true;
    return b.providerId === currentWorker.id || (b as any).helperId === currentWorker.id;
  });

  const newJobs = workerBookings.filter(b => b.status === 'Requested');
  const acceptedJobs = workerBookings.filter(b => b.status === 'Accepted' || b.status === 'In Progress');
  const completedJobs = workerBookings.filter(b => b.status === 'Completed');

  const handleAcceptJob = (jobId: string) => {
    updateBookingStatus(jobId, 'Accepted', 'Job accepted by technician.');
    setActiveTab('accepted');
  };

  const handleCompleteJob = (jobId: string, notes?: string) => {
    updateBookingStatus(jobId, 'Completed', notes || 'Job completed successfully.');
    setActiveTab('completed');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F5] pb-24">
      {/* Mobile-first Header */}
      <div className="bg-[#0B1F3A] text-white pt-6 pb-8 px-4 sm:px-6 shadow-sm">
        <div className="max-w-xl mx-auto space-y-3">
          {/* Worker identity dropdown / switcher for presentation */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 border-b border-white/10">
            <span className="text-gray-300 font-medium flex items-center gap-1.5">
              <HardHat size={14} className="text-amber-400" />
              <span>Worker Demonstration Portal</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-[11px] hidden sm:inline">Active Profile:</span>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="bg-[#1E3A5F] text-white text-xs font-semibold rounded-lg px-2.5 py-1 border border-white/20 focus:outline-hidden"
              >
                <option value="all">⚡ All Technician Jobs (Demo View)</option>
                {providers.filter(p => p.isActive).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.badge?.includes('Verified') ? '✨ ' : ''}{p.name} ({p.category}) - PIN: {p.pincodes?.[0] || '411038'}
                  </option>
                ))}
              </select>

              <Link
                to="/register-helper"
                className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-2 py-1 rounded text-xs transition-colors shrink-0"
                title="Register a new helper profile"
              >
                <UserPlus size={12} />
                <span className="hidden sm:inline">+ New Helper</span>
              </Link>
            </div>
          </div>

          {/* Namaste Greeting Requirement */}
          <div className="pt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Namaste!</span>
              <span className="text-amber-400">🙏</span>
            </h1>
            <p className="text-sm text-gray-300 mt-0.5">
              Here are your service requests.
            </p>
          </div>
        </div>
      </div>

      {/* Main Container - Mobile First Max Width */}
      <div className="max-w-xl mx-auto px-4 -mt-4">
        {/* Four Clear Navigation Tabs with Counters */}
        <div className="bg-white rounded-2xl p-1.5 shadow-md border border-gray-200 grid grid-cols-4 gap-1 text-center mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('new')}
            className={`py-3 px-1 rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center gap-1 ${
              activeTab === 'new'
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>New</span>
              {newJobs.length > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeTab === 'new' ? 'bg-amber-400 text-gray-900' : 'bg-rose-500 text-white'
                }`}>
                  {newJobs.length}
                </span>
              )}
            </div>
            <span className="text-[10px] opacity-80 font-normal">Requests</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accepted')}
            className={`py-3 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'accepted'
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>Accepted</span>
              {acceptedJobs.length > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeTab === 'accepted' ? 'bg-blue-400 text-gray-900' : 'bg-blue-100 text-blue-800'
                }`}>
                  {acceptedJobs.length}
                </span>
              )}
            </div>
            <span className="text-[10px] opacity-80 font-normal">In Progress</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`py-3 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'completed'
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>Done</span>
              {completedJobs.length > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeTab === 'completed' ? 'bg-emerald-400 text-gray-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {completedJobs.length}
                </span>
              )}
            </div>
            <span className="text-[10px] opacity-80 font-normal">Completed</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              activeTab === 'profile'
                ? 'bg-[#0B1F3A] text-white shadow-xs'
                : 'text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            <span>Profile</span>
            <span className="text-[10px] opacity-80 font-normal">My Details</span>
          </button>
        </div>

        {/* Tab 1: New Jobs */}
        {activeTab === 'new' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#667085] px-1">
              <span className="font-semibold text-[#172033]">
                New Requests ({newJobs.length})
              </span>
              <span>Accept quickly to secure booking</span>
            </div>

            {newJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <Inbox size={24} />
                </div>
                <h3 className="text-base font-bold text-[#172033]">No pending requests</h3>
                <p className="text-xs text-[#667085] max-w-xs mx-auto">
                  You are all caught up! When a customer books a repair for your service trade, it will appear here immediately.
                </p>
              </div>
            ) : (
              newJobs.map(job => (
                <WorkerJobCard
                  key={job.id}
                  job={job}
                  onAccept={handleAcceptJob}
                  onComplete={handleCompleteJob}
                />
              ))
            )}
          </div>
        )}

        {/* Tab 2: Accepted Jobs */}
        {activeTab === 'accepted' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#667085] px-1">
              <span className="font-semibold text-[#172033]">
                Jobs In Progress ({acceptedJobs.length})
              </span>
              <span>Call customer before visiting</span>
            </div>

            {acceptedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Clock size={24} />
                </div>
                <h3 className="text-base font-bold text-[#172033]">No active jobs</h3>
                <p className="text-xs text-[#667085] max-w-xs mx-auto">
                  Accept a new request from the New Jobs tab to start working on it.
                </p>
              </div>
            ) : (
              acceptedJobs.map(job => (
                <WorkerJobCard
                  key={job.id}
                  job={job}
                  onAccept={handleAcceptJob}
                  onComplete={handleCompleteJob}
                />
              ))
            )}
          </div>
        )}

        {/* Tab 3: Completed Jobs */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#667085] px-1">
              <span className="font-semibold text-[#172033]">
                Completed Jobs History ({completedJobs.length})
              </span>
              <span>Past work record</span>
            </div>

            {completedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-base font-bold text-[#172033]">No completed jobs yet</h3>
                <p className="text-xs text-[#667085] max-w-xs mx-auto">
                  When you complete work and mark it done, the completed record will be saved here.
                </p>
              </div>
            ) : (
              completedJobs.map(job => (
                <WorkerJobCard
                  key={job.id}
                  job={job}
                  onAccept={handleAcceptJob}
                  onComplete={handleCompleteJob}
                />
              ))
            )}
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <WorkerProfile provider={currentWorker} />
        )}
      </div>
    </div>
  );
};
