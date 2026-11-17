import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatINR } from '../../utils/formatters';
import { ArrowRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
              Explore Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-1">
              Popular Home Repair Services
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Select a trade to view local specialists and verified demonstration rates.
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-[#0B1F3A] hover:text-[#3B82F6] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Services</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/services?category=${cat.id}`}
              className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#3B82F6] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0B1F3A] group-hover:bg-blue-50 group-hover:text-[#3B82F6] group-hover:border-blue-200 transition-colors">
                    <CategoryIcon categoryId={cat.id} size={22} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#667085] block font-medium">Starting from</span>
                    <span className="text-base font-bold text-[#15803D]">
                      {formatINR(cat.startingPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#3B82F6] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.hindiName && (
                    <span className="text-[10px] bg-gray-100 text-[#667085] px-1.5 py-0.5 rounded font-sans">
                      {cat.hindiName}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 mb-3">
                  {cat.tagline}
                </p>

                {/* Popular bullet items */}
                <div className="space-y-1 pt-2 border-t border-gray-100">
                  {cat.popularServices.slice(0, 2).map((srv, idx) => (
                    <div key={idx} className="flex items-center text-[11px] text-[#667085]">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2 shrink-0"></span>
                      <span className="truncate">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#0B1F3A] group-hover:text-[#3B82F6]">
                <span>Find Technicians</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
