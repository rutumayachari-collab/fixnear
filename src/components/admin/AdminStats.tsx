import React from 'react';
import { DashboardStats } from '../../types';
import { formatINR } from '../../utils/formatters';
import { ClipboardList, Clock, PlayCircle, CheckCircle2, IndianRupee, Users } from 'lucide-react';

interface AdminStatsProps {
  stats: DashboardStats;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      icon: ClipboardList,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      label: 'New Requests',
      value: stats.newRequests,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      badge: stats.newRequests > 0 ? `${stats.newRequests} Pending` : undefined,
    },
    {
      label: 'Active / In Progress',
      value: stats.activeJobs,
      icon: PlayCircle,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      label: 'Completed Jobs',
      value: stats.completedJobs,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Completed Value',
      value: formatINR(stats.totalEstimatedRevenue),
      icon: IndianRupee,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Active Providers',
      value: stats.activeProviders,
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#667085] leading-snug">
                {c.label}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${c.color}`}>
                <Icon size={16} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
                {c.value}
              </span>
              {c.badge && (
                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                  Action
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
