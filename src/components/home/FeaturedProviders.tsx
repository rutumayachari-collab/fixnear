import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFixNear } from '../../context/FixNearContext';
import { ServiceProvider } from '../../types';
import { formatINR, getInitials, formatDistance } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';
import { CategoryIcon } from '../common/CategoryIcon';
import { BookingFormModal } from '../bookings/BookingFormModal';
import { MapPin, ArrowRight, Navigation } from 'lucide-react';

export const FeaturedProviders: React.FC = () => {
  const { providers } = useFixNear();
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<ServiceProvider | null>(null);

  // Take first 4 active providers
  const featured = providers.filter(p => p.isActive).slice(0, 4);

  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
              Verified Demonstration Specialists
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-1">
              Featured Service Providers
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Top-rated independent technicians ready for doorstep booking in Pune.
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-[#0B1F3A] hover:text-[#3B82F6] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Explore All 10 Technicians</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((provider) => (
            <div
              key={provider.id}
              className="bg-[#FBFBFA] rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with avatar & badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0B1F3A] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-2xs">
                    {getInitials(provider.name)}
                  </div>
                  {provider.badge && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-2 py-0.5 rounded-full">
                      {provider.badge}
                    </span>
                  )}
                </div>

                {/* Name & trade */}
                <h3 className="text-sm font-bold text-[#0B1F3A] leading-tight mb-1">
                  {provider.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#667085] mb-2">
                  <CategoryIcon categoryId={provider.category} size={14} className="text-[#3B82F6]" />
                  <span className="capitalize">{provider.category.replace('-', ' ')}</span>
                  <span>•</span>
                  <span>{provider.experienceYears} yrs exp</span>
                </div>

                {/* Distance if calculated */}
                {provider.distanceKm !== undefined && (
                  <div className="mb-2 inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 rounded px-2 py-0.5 text-[11px] font-semibold">
                    <Navigation size={11} className="text-[#3B82F6]" />
                    <span>~{formatDistance(provider.distanceKm)} (straight-line)</span>
                  </div>
                )}

                {/* Rating */}
                <div className="mb-3">
                  <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} />
                </div>

                {/* Location */}
                <div className="flex items-start gap-1.5 text-xs text-[#667085] mb-3">
                  <MapPin size={13} className="shrink-0 text-gray-400 mt-0.5" />
                  <span className="line-clamp-1">{(provider.areas || ['Pune']).join(', ')}</span>
                </div>

                {/* Pricing */}
                <div className="pt-2 border-t border-gray-200 flex items-baseline justify-between mb-4">
                  <span className="text-[11px] text-[#667085]">Est. Visit Charge:</span>
                  <span className="text-base font-bold text-[#15803D]">
                    {formatINR(provider.startingPrice)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedProviderForBooking(provider)}
                  className="w-full py-2 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                >
                  Book Service
                </button>
                <Link
                  to={`/services/${provider.id}`}
                  className="block text-center text-xs text-gray-600 hover:text-black font-medium py-1"
                >
                  View Full Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form Modal */}
      {selectedProviderForBooking && (
        <BookingFormModal
          isOpen={true}
          onClose={() => setSelectedProviderForBooking(null)}
          initialProvider={selectedProviderForBooking}
        />
      )}
    </section>
  );
};
