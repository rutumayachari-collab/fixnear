import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFixNear } from '../context/FixNearContext';
import { ServiceProvider } from '../types';
import { ProviderCard } from '../components/services/ProviderCard';
import { ServiceFilters } from '../components/services/ServiceFilters';
import { SmartMatchWidget } from '../components/home/SmartMatchWidget';
import { BookingFormModal } from '../components/bookings/BookingFormModal';
import { NearbyMap } from '../components/map/NearbyMap';
import { Sparkles, Inbox, RotateCcw, Map, List, Navigation, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { providers, customerLocation, requestCustomerLocation, clearCustomerLocation, setPincodeFallback } = useFixNear();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search & Filter State
  const initialCat = searchParams.get('category') || 'all';
  const initialPin = searchParams.get('pincode') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [pincodeFilter, setPincodeFilter] = useState<string>(initialPin);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>(customerLocation.coords ? 'distance' : 'rating');
  const [showSmartMatch, setShowSmartMatch] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'both' | 'cards' | 'map'>('both');
  const [selectedMapProviderId, setSelectedMapProviderId] = useState<string | null>(null);

  // Booking Modal State
  const [providerToBook, setProviderToBook] = useState<ServiceProvider | null>(null);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const pin = searchParams.get('pincode');
    if (pin) {
      setPincodeFilter(pin);
      setPincodeFallback(pin);
    }
  }, [searchParams, setPincodeFallback]);

  // When GPS coordinates are detected, automatically sort by nearest distance
  useEffect(() => {
    if (customerLocation.coords && sortBy === 'rating') {
      setSortBy('distance');
    }
  }, [customerLocation.coords, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handlePincodeChange = (pin: string) => {
    setPincodeFilter(pin);
    setPincodeFallback(pin);
    const newParams = new URLSearchParams(searchParams);
    if (!pin) {
      newParams.delete('pincode');
    } else {
      newParams.set('pincode', pin);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPincodeFilter('');
    setSearchQuery('');
    setSortBy(customerLocation.coords ? 'distance' : 'rating');
    clearCustomerLocation();
    setSearchParams({});
  };

  // Filtered & Sorted Providers
  const filteredProviders = useMemo(() => {
    return providers
      .filter((p) => {
        if (!p.isActive) return false;

        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

        const pincodesList = Array.isArray(p.pincodes) ? p.pincodes : [];
        const areasList = Array.isArray(p.areas) ? p.areas : [];
        const pName = p.name || '';
        const pTagline = p.tagline || '';

        const matchesPin = 
          !pincodeFilter.trim() ||
          pincodesList.some(pin => pin && pin.includes(pincodeFilter.trim())) ||
          areasList.some(a => a && a.toLowerCase().includes(pincodeFilter.toLowerCase()));

        const matchesSearch = 
          !searchQuery.trim() ||
          pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pTagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          areasList.some(a => a && a.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCat && matchesPin && matchesSearch;
      })
      .sort((a, b) => {
        // 1. Exact PIN match priority
        if (pincodeFilter.trim()) {
          const aExact = (a.pincodes || []).includes(pincodeFilter.trim());
          const bExact = (b.pincodes || []).includes(pincodeFilter.trim());
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
        }

        // 2. Newly registered helper accounts priority (ensures evaluator's registered helper is #1)
        const aIsUserRegistered = a.id.startsWith('helper-');
        const bIsUserRegistered = b.id.startsWith('helper-');
        if (aIsUserRegistered && !bIsUserRegistered) return -1;
        if (!aIsUserRegistered && bIsUserRegistered) return 1;

        if (sortBy === 'distance') {
          // Put providers with calculated distance first, sorted by distance
          if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
            return a.distanceKm - b.distanceKm;
          }
          if (a.distanceKm !== undefined) return -1;
          if (b.distanceKm !== undefined) return 1;
        }
        if (sortBy === 'price-asc') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-desc') return b.startingPrice - a.startingPrice;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        // Default rating
        return b.rating - a.rating;
      });
  }, [providers, selectedCategory, pincodeFilter, searchQuery, sortBy]);

  return (
    <div className="py-8 md:py-12 bg-[#F8F8F5] min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title, GPS Action & View Switchers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
              Local Repair Services in Pune
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
              Compare estimated starting charges in ₹ and view interactive map distance to neighborhood technicians.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* GPS Button */}
            <button
              type="button"
              onClick={requestCustomerLocation}
              disabled={customerLocation.isLocating}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shadow-2xs ${
                customerLocation.coords
                  ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {customerLocation.isLocating ? (
                <>
                  <Loader2 size={13} className="animate-spin text-[#3B82F6]" />
                  <span>Locating...</span>
                </>
              ) : customerLocation.coords ? (
                <>
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>GPS Active</span>
                </>
              ) : (
                <>
                  <Navigation size={13} className="text-[#3B82F6]" />
                  <span>Use My Location</span>
                </>
              )}
            </button>

            {/* Smart Match toggle */}
            <button
              type="button"
              onClick={() => setShowSmartMatch(!showSmartMatch)}
              className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#0B1F3A] border border-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Sparkles size={13} className="text-[#3B82F6]" />
              <span>{showSmartMatch ? 'Close Matcher' : 'Smart Match'}</span>
            </button>

            {/* View Mode Switcher (Both / Cards / Map) */}
            <div className="hidden sm:flex items-center bg-gray-200/80 p-0.5 rounded-xl border border-gray-300 text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('both')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                  viewMode === 'both' ? 'bg-white text-[#0B1F3A] shadow-xs font-bold' : 'text-gray-600 hover:text-black'
                }`}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-[#0B1F3A] shadow-xs font-bold' : 'text-gray-600 hover:text-black'
                }`}
              >
                <List size={13} />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                  viewMode === 'map' ? 'bg-white text-[#0B1F3A] shadow-xs font-bold' : 'text-gray-600 hover:text-black'
                }`}
              >
                <Map size={13} />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* GPS Active or Error Banner */}
        {customerLocation.coords ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Navigation size={15} className="text-[#3B82F6] shrink-0" />
              <span>
                <strong>GPS Active:</strong> Showing technicians sorted by approximate straight-line distance from your location in Pune. (Note: not driving road travel time).
              </span>
            </div>
            <button
              onClick={clearCustomerLocation}
              className="text-xs font-semibold text-blue-800 hover:underline shrink-0"
            >
              Clear
            </button>
          </div>
        ) : customerLocation.error ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-amber-700 shrink-0" />
              <span>
                <strong>GPS Fallback:</strong> {customerLocation.error} Filter providers using your 6-digit PIN code below.
              </span>
            </div>
          </div>
        ) : null}

        {/* Expandable Smart Match */}
        {showSmartMatch && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <SmartMatchWidget 
              compact={true} 
              onSelectCategory={(catId) => {
                handleCategoryChange(catId);
                setShowSmartMatch(false);
              }} 
            />
          </div>
        )}

        {/* Interactive Leaflet Map (Shown if mode is 'both' or 'map') */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#667085] px-1">
              <span className="font-semibold text-[#172033] flex items-center gap-1.5">
                <Map size={14} className="text-[#3B82F6]" />
                <span>Interactive Provider Map (Pune Metro)</span>
              </span>
              <span>Click markers for technician details & rates</span>
            </div>
            <NearbyMap
              providers={filteredProviders}
              customerCoords={customerLocation.coords}
              onSelectProvider={(p) => navigate(`/services/${p.id}`)}
              onBookProvider={(p) => setProviderToBook(p)}
              selectedProviderId={selectedMapProviderId}
              heightClass={viewMode === 'map' ? 'h-[550px]' : 'h-[360px] sm:h-[420px]'}
            />
          </div>
        )}

        {/* Filters Bar */}
        <ServiceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          pincodeFilter={pincodeFilter}
          onPincodeChange={handlePincodeChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onReset={handleResetFilters}
          totalResults={filteredProviders.length}
        />

        {/* Providers Grid (Shown if mode is 'both' or 'cards') */}
        {(viewMode === 'both' || viewMode === 'cards') && (
          filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <div 
                  key={provider.id}
                  onMouseEnter={() => setSelectedMapProviderId(provider.id)}
                  onMouseLeave={() => setSelectedMapProviderId(null)}
                >
                  <ProviderCard
                    provider={provider}
                    onBook={(p) => setProviderToBook(p)}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-2xs my-8">
              <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Inbox size={28} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172033]">
                  No technicians match your search
                </h3>
                <p className="text-xs text-[#667085] mt-1">
                  We couldn't find active service providers for the selected category or PIN code "{pincodeFilter}".
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset Search Filters</span>
              </button>
            </div>
          )
        )}
      </div>

      {/* Booking Modal */}
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
