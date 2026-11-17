import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useFixNear } from '../context/FixNearContext';
import { formatINR, getInitials, formatDistance } from '../utils/formatters';
import { RatingStars } from '../components/common/RatingStars';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { BookingFormModal } from '../components/bookings/BookingFormModal';
import { SERVICE_CATEGORIES } from '../data/categories';
import { MapPin, ArrowLeft, CheckCircle2, AlertCircle, Navigation, Phone } from 'lucide-react';

export const ProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { providers } = useFixNear();
  const location = useLocation();
  const isDirectBookingRoute = location.pathname.startsWith('/book-service');
  const [showBookingModal, setShowBookingModal] = useState(isDirectBookingRoute);

  const provider = providers.find((p) => p.id === id);

  if (!provider) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#0B1F3A]">Service Provider Not Found</h2>
        <p className="text-xs text-[#667085]">
          The technician profile you are looking for does not exist or has been deactivated.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1F3A] text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft size={14} />
          <span>Back to All Services</span>
        </Link>
      </div>
    );
  }

  const categoryObj = SERVICE_CATEGORIES.find(c => c.id === provider.category);

  return (
    <div className="py-8 md:py-12 bg-[#F8F8F5] min-h-[calc(100vh-140px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#0B1F3A]"
        >
          <ArrowLeft size={14} />
          <span>Back to Services Listing</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0B1F3A] text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-xs">
                {getInitials(provider.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                    {provider.name}
                  </h1>
                  {provider.badge && (
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded-full">
                      {provider.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#667085] mt-1">
                  <CategoryIcon categoryId={provider.category} size={15} className="text-[#3B82F6]" />
                  <span className="capitalize font-semibold text-gray-800">
                    {provider.category.replace('-', ' ')} Specialist • Pune
                  </span>
                  <span>•</span>
                  <span>{provider.experienceYears} Years Field Experience</span>
                </div>

                {/* Distance Badge if available */}
                {provider.distanceKm !== undefined && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg px-2.5 py-0.5 text-xs font-semibold">
                    <Navigation size={12} className="text-[#3B82F6]" />
                    <span>~{formatDistance(provider.distanceKm)} from your location (approx. straight-line)</span>
                  </div>
                )}

                <div className="mt-2.5">
                  <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} />
                </div>
              </div>
            </div>

            {/* Availability Badge */}
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start">
              {provider.availability}
            </span>
          </div>

          {/* About / Bio */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-2">
              About the Technician
            </h3>
            <p className="text-xs sm:text-sm text-[#172033] leading-relaxed">
              {provider.bio}
            </p>
          </div>

          {/* Pricing & Transparency Requirement */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#667085] block">
                  Estimated Starting Inspection / Visit Charge:
                </span>
                <span className="text-2xl font-black text-[#15803D]">
                  {formatINR(provider.startingPrice)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <a
                  href={`tel:${provider.phone}`}
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
                  title="Direct phone call via device dialer"
                >
                  <Phone size={14} />
                  <span>Call Technician</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(true)}
                  className="px-6 py-3 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Book This Technician
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <p>
                <strong>Transparent Pricing Note:</strong> The ₹{provider.startingPrice} charge covers the technician's doorstep visit and diagnosis in Pune. Final repair costs depend on the labor required and any replacement spare parts needed. The technician will quote the exact total before starting repair work.
              </p>
            </div>
          </div>

          {/* Areas Covered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1">
                <MapPin size={13} />
                <span>Service Localities</span>
              </span>
              <p className="text-xs text-[#172033] font-medium leading-relaxed">
                {(provider.areas || ['Pune']).join(' • ')}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Served PIN Codes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(provider.pincodes || []).map(pin => (
                  <span key={pin} className="px-2 py-0.5 bg-white border border-gray-300 rounded font-mono text-[11px] text-gray-700">
                    {pin}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Popular services in this trade */}
          {categoryObj && (
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-2.5">
                Common Work Handled
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#172033]">
                {categoryObj.popularServices.map((srv, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingModal && (
        <BookingFormModal
          isOpen={true}
          onClose={() => setShowBookingModal(false)}
          initialProvider={provider}
        />
      )}
    </div>
  );
};
