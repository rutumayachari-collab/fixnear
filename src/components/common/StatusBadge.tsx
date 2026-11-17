import React from 'react';
import { BookingStatus } from '../../types';
import { Clock, CheckCircle2, AlertCircle, PlayCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let badgeStyle = '';
  let IconComponent = Clock;

  switch (status) {
    case 'Requested':
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
      IconComponent = Clock;
      break;
    case 'Accepted':
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
      IconComponent = AlertCircle;
      break;
    case 'In Progress':
      badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
      IconComponent = PlayCircle;
      break;
    case 'Completed':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      IconComponent = CheckCircle2;
      break;
    case 'Cancelled':
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
      IconComponent = XCircle;
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-medium gap-2',
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border ${badgeStyle} ${sizeClasses}`}>
      <IconComponent size={iconSizes} className="shrink-0" />
      <span>{status}</span>
    </span>
  );
};
