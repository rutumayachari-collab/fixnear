import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFixNear } from '../context/FixNearContext';
import { HeroSearch } from '../components/home/HeroSearch';
import { SmartMatchWidget } from '../components/home/SmartMatchWidget';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedProviders } from '../components/home/FeaturedProviders';
import { HowItWorks } from '../components/home/HowItWorks';
import { NearbyMap } from '../components/map/NearbyMap';
import { BookingFormModal } from '../components/bookings/BookingFormModal';
import { ServiceProvider } from '../types';
import { Map, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { providers, customerLocation } = useFixNear();
  const navigate = useNavigate();
  const [providerToBook, setProviderToBook] = useState<ServiceProvider | null>(null);

  return (
    <div className="space-y-0">
      <HeroSearch />
      
      {/* Smart Repair Match Section */}
      <section className="py-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SmartMatchWidget />
        </div>
      </section>

      <CategoryGrid />

      {/* Interactive Leaflet Map Showcase Section */}
      <section className="py-12 bg-[#F8F8F5] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6] flex items-center gap-1.5">
                <Map size={13} />
                <span>Nearby Services Map & GPS</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-1">
                Explore Local Technicians in Pune
              </h2>
              <p className="text-xs sm:text-sm text-[#667085] mt-1">
                View real-time straight-line distances from your location to specialists across Kothrud, Baner, Viman Nagar, Hinjewadi, and Deccan.
              </p>
            </div>
            <Link
              to="/services"
              className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Open Full Directory</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <NearbyMap
            providers={providers}
            customerCoords={customerLocation.coords}
            onSelectProvider={(p) => navigate(`/services/${p.id}`)}
            onBookProvider={(p) => setProviderToBook(p)}
            heightClass="h-[360px] sm:h-[420px]"
          />
        </div>
      </section>

      <FeaturedProviders />
      <HowItWorks />

      {/* Booking Form Modal */}
      {providerToBook && (
        <BookingFormModal
          isOpen={true}
          onClose={() => setProviderToBook(null)}
          initialProvider={providerToBook}
        />
      )}
    </div>
  );
};
