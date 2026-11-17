import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceProvider } from '../../types';
import { formatINR, getInitials, formatDistance } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';
import { CategoryIcon } from '../common/CategoryIcon';
import { MapPin, Navigation } from 'lucide-react';

interface ProviderCardProps {
  provider: ServiceProvider;
  onBook: (provider: ServiceProvider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onBook }) => {
  const getAvailabilityBadge = () => {
    switch (provider.availability) {
      case 'Available Today':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Available Tomorrow':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col justify-between">
      <div>
        {/* Top header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-white font-bold flex items-center justify-center text-sm shadow-2xs shrink-0">
              {getInitials(provider.name)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-[#0B1F3A] leading-snug">
                  {provider.name}
                </h3>
                {provider.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                    provider.badge.includes('Verified')
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {provider.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#667085] mt-0.5">
                <CategoryIcon categoryId={provider.category} size={13} className="text-[#3B82F6]" />
                <span className="capitalize font-medium text-gray-700">
                  {provider.category.replace('-', ' ')}
                </span>
                <span>•</span>
                <span>{provider.experienceYears} yrs exp</span>
              </div>
            </div>
          </div>

          {/* Availability pill */}
          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border shrink-0 ${getAvailabilityBadge()}`}>
            {provider.availability}
          </span>
        </div>

        {/* Distance Badge if Customer Location is Available */}
        {provider.distanceKm !== undefined && (
          <div className="mb-3 inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg px-2.5 py-1 text-xs font-semibold" title="Approximate straight-line distance, not driving travel time">
            <Navigation size={12} className="text-[#3B82F6]" />
            <span>~{formatDistance(provider.distanceKm)}</span>
            <span className="text-[10px] text-blue-600 font-normal">(straight-line)</span>
          </div>
        )}

        {/* Bio / Tagline */}
        <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 mb-3">
          {provider.tagline || provider.bio}
        </p>

        {/* Rating and Reviews */}
        <div className="mb-3">
          <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} />
        </div>

        {/* Areas & PIN codes */}
        <div className="space-y-1.5 text-xs text-[#667085] py-2.5 border-t border-gray-100 mb-3">
          <div className="flex items-start gap-1.5">
            <MapPin size={13} className="text-gray-400 shrink-0 mt-0.5" />
            <span className="text-[#172033] font-medium leading-snug">
              {provider.areas.slice(0, 3).join(', ')}
              {provider.areas.length > 3 && ` +${provider.areas.length - 3} more`}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 pl-4">
            <span>PIN Codes:</span>
            <span className="font-mono">{provider.pincodes.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#667085] tracking-wider block">
              Estimated Starting Price
            </span>
            <span className="text-lg font-bold text-[#15803D]">
              {formatINR(provider.startingPrice)}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 italic">
            excludes extra parts
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/services/${provider.id}`}
            className="w-full text-center py-2 px-3 bg-gray-100 hover:bg-gray-200 text-[#172033] rounded-lg text-xs font-semibold transition-colors"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => onBook(provider)}
            className="w-full py-2 px-3 bg-[#0B1F3A] hover:bg-[#142d52] text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            Book Service
          </button>
        </div>
      </div>
    </div>
  );
};
