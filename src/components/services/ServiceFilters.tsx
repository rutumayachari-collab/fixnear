import React from 'react';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { Search, MapPin, RotateCcw } from 'lucide-react';

interface ServiceFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  pincodeFilter: string;
  onPincodeChange: (pin: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  totalResults: number;
}

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  pincodeFilter,
  onPincodeChange,
  sortBy,
  onSortChange,
  onReset,
  totalResults,
}) => {
  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || pincodeFilter !== '' || (sortBy !== 'rating' && sortBy !== 'distance');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Top search & PIN inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Name / Keyword Search */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            placeholder="Search technician name, area or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs rounded-xl border border-gray-300 pl-8 pr-3 py-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
          />
          <Search size={14} className="absolute left-2.5 top-3 text-gray-400" />
        </div>

        {/* PIN Code filter */}
        <div className="sm:col-span-3 relative">
          <input
            type="text"
            maxLength={6}
            placeholder="Search PIN Code (e.g. 411038)"
            value={pincodeFilter}
            onChange={(e) => onPincodeChange(e.target.value.replace(/\D/g, ''))}
            className="w-full text-xs rounded-xl border border-gray-300 pl-8 pr-3 py-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
          />
          <MapPin size={14} className="absolute left-2.5 top-3 text-gray-400" />
        </div>

        {/* Sort selector */}
        <div className="sm:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full text-xs rounded-xl border border-gray-300 px-3 py-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] font-medium"
          >
            <option value="distance">Distance: Nearest First</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="price-asc">Price: Low to High (₹)</option>
            <option value="price-desc">Price: High to Low (₹)</option>
            <option value="experience">Most Experienced</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#0B1F3A] text-white shadow-2xs'
              : 'bg-gray-100 text-[#667085] hover:bg-gray-200 hover:text-black'
          }`}
        >
          All Categories
        </button>

        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#0B1F3A] text-white shadow-2xs'
                : 'bg-gray-100 text-[#667085] hover:bg-gray-200 hover:text-black'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-[#667085]">
        <span>
          Showing <strong>{totalResults}</strong> service provider{totalResults === 1 ? '' : 's'}
          {pincodeFilter.trim() && (
            <span className="ml-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              serving PIN: {pincodeFilter.trim()}
            </span>
          )}
        </span>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline"
          >
            <RotateCcw size={12} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
