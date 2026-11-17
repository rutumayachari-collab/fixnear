import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFixNear } from '../../context/FixNearContext';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { Search, MapPin, ShieldCheck, IndianRupee, PhoneCall, ArrowRight, Navigation, Loader2, CheckCircle2, AlertCircle, HardHat } from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const { customerLocation, requestCustomerLocation, clearCustomerLocation, setPincodeFallback } = useFixNear();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pincode, setPincode] = useState<string>('');
  const navigate = useNavigate();

  const handleUseLocation = async () => {
    await requestCustomerLocation();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') {
      params.append('category', selectedCategory);
    }
    if (pincode.trim()) {
      params.append('pincode', pincode.trim());
      setPincodeFallback(pincode.trim());
    }
    navigate(`/services?${params.toString()}`);
  };

  return (
    <section className="relative pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden bg-gradient-to-b from-white to-[#F8F8F5] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0B1F3A] border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
            <ShieldCheck size={14} className="text-[#3B82F6]" />
            <span>Fair Estimates • Pune Households • GPS Distance & Direct Contact</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B1F3A] leading-tight">
            Find trusted help for your home.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#667085] max-w-2xl mx-auto leading-relaxed">
            FixNear connects you with local independent plumbers, electricians, AC technicians, and repair specialists in your Pune neighborhood. Compare starting charges in ₹ and book in minutes.
          </p>

          {/* Search Box */}
          <form 
            onSubmit={handleSearch}
            className="mt-6 bg-white p-3 rounded-2xl shadow-md border border-gray-200 space-y-3 text-left"
          >
            <div className="flex flex-col md:flex-row items-center gap-2.5">
              {/* Category selection */}
              <div className="w-full md:w-1/2 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <Search size={18} className="text-gray-400 shrink-0" />
                <div className="w-full">
                  <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Service Needed
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#172033] focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">All Service Categories</option>
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} (from ₹{cat.startingPrice})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PIN Code / Locality */}
              <div className="w-full md:w-1/2 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <MapPin size={18} className="text-gray-400 shrink-0" />
                <div className="w-full">
                  <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Pune PIN Code / Area
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 411038 or Kothrud"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#172033] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3.5 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0"
              >
                <span>Find Technicians</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* "Use My Location" Button & GPS Status Bar */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={customerLocation.isLocating}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all border ${
                    customerLocation.coords
                      ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {customerLocation.isLocating ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-[#3B82F6]" />
                      <span>Detecting your location...</span>
                    </>
                  ) : customerLocation.coords ? (
                    <>
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Location Detected (~{customerLocation.coords.lat.toFixed(2)}°N)</span>
                    </>
                  ) : (
                    <>
                      <Navigation size={13} className="text-[#3B82F6]" />
                      <span>Use My Location (GPS)</span>
                    </>
                  )}
                </button>

                {customerLocation.coords && (
                  <button
                    type="button"
                    onClick={clearCustomerLocation}
                    className="text-[11px] text-[#667085] hover:text-rose-600 underline"
                  >
                    Clear GPS
                  </button>
                )}
              </div>

              <span className="text-[11px] text-[#667085] hidden sm:inline">
                Calculates straight-line distance to nearby Pune technicians.
              </span>
            </div>

            {/* Error Message for Location if Denied */}
            {customerLocation.error && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {customerLocation.error}
                </span>
              </div>
            )}
          </form>

          {/* Dual Portal Callout: Need Help vs I am a Helper */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3 sm:p-4 text-left flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400 text-gray-900 shrink-0">
                <HardHat size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B1F3A] flex items-center gap-1.5">
                  <span>Are you a service worker or technician?</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">0% Commission</span>
                </div>
                <p className="text-[11px] text-[#667085] mt-0.5">
                  Register with your real PIN code so local households can find and call you directly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => navigate('/register-helper')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0B1F3A] hover:bg-[#152E52] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
              >
                <HardHat size={14} className="text-amber-400" />
                <span>I Am a Helper</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Quick value props */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#667085]">
            <div className="flex items-center gap-1.5">
              <IndianRupee size={14} className="text-[#15803D]" />
              <span>Transparent starting rates from ₹199</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Navigation size={14} className="text-[#3B82F6]" />
              <span>Interactive Leaflet Map & GPS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhoneCall size={14} className="text-[#0B1F3A]" />
              <span>Direct call via local phone dialer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
