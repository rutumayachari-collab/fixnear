import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, IndianRupee } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      {/* Informative notice bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-3 px-4 text-xs text-[#667085]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center gap-1.5">
            <IndianRupee size={14} className="text-[#0B1F3A]" />
            <span><strong>Transparent Pricing:</strong> All listed prices (₹199, ₹249, ₹499) are estimated starting visit charges. Final repair costs depend on diagnostic checks, labor, and required spare parts.</span>
          </div>
          <div className="text-[11px] text-gray-500">
            FixNear does not charge hidden platform fees.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-white">
                <Wrench size={16} className="text-[#3B82F6]" />
              </div>
              <span className="text-lg font-bold text-[#0B1F3A]">FixNear</span>
            </div>
            <p className="text-xs text-[#667085] leading-relaxed">
              FixNear connects Indian households with reliable local repair professionals for plumbing, electrical, AC servicing, carpentry, and home maintenance.
            </p>
            <div className="pt-2 text-xs text-[#667085]">
              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-[11px] font-medium border border-blue-100">
                College Innovation Project
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#172033] mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link to="/services?category=plumbing" className="hover:text-[#0B1F3A]">Plumbing Repair (from ₹199)</Link></li>
              <li><Link to="/services?category=electrical" className="hover:text-[#0B1F3A]">Electrical Faults (from ₹199)</Link></li>
              <li><Link to="/services?category=ac-repair" className="hover:text-[#0B1F3A]">AC Servicing & Gas (from ₹499)</Link></li>
              <li><Link to="/services?category=appliance-repair" className="hover:text-[#0B1F3A]">Washing Machine & Fridge (from ₹249)</Link></li>
              <li><Link to="/services?category=carpentry" className="hover:text-[#0B1F3A]">Carpentry & Hinges (from ₹199)</Link></li>
              <li><Link to="/services?category=home-cleaning" className="hover:text-[#0B1F3A]">Home Cleaning (from ₹299)</Link></li>
            </ul>
          </div>

          {/* Customer & Roles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#172033] mb-3">
              Demonstration Modes
            </h4>
            <ul className="space-y-2 text-xs text-[#667085]">
              <li><Link to="/" className="hover:text-[#0B1F3A]">Customer Booking Flow</Link></li>
              <li><Link to="/my-bookings" className="hover:text-[#0B1F3A]">Customer Booking Tracker</Link></li>
              <li><Link to="/worker" className="hover:text-[#0B1F3A] font-medium text-amber-700">Worker Mode (Namaste Screen)</Link></li>
              <li><Link to="/admin" className="hover:text-[#0B1F3A] font-medium text-blue-700">Admin Management Console</Link></li>
            </ul>
          </div>

          {/* Compliance & About */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#172033] mb-3">
              Important Disclaimers
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed mb-3">
              This platform is developed as a working academic prototype for an Innovation subject presentation. Technicians and bookings are fictional demonstration records.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#667085]">
              <Shield size={14} className="text-emerald-600 shrink-0" />
              <span>Independent local service network concept</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-[#667085] gap-3">
          <p>© 2026 FixNear — Local Repair & Service Finder. Built with React & TypeScript.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-900 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-gray-900 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-gray-900 cursor-pointer">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
