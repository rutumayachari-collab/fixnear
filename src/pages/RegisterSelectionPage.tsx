import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, HardHat, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, LogIn } from 'lucide-react';

export const RegisterSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-140px)] py-10 sm:py-16 bg-[#F8F8F5] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-3 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#0B1F3A] transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0B1F3A] border border-blue-200 px-3.5 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck size={14} className="text-[#3B82F6]" />
            <span>Join FixNear Community • Pune Neighborhoods</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
            How would you like to use FixNear?
          </h1>
          <p className="text-sm text-[#667085] max-w-lg mx-auto">
            Choose your account type below to get started. Both profiles connect via our shared database in real time.
          </p>
        </div>

        {/* Two Large Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Customer / Need Help */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 hover:border-[#3B82F6] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="w-14 h-14 bg-blue-50 text-[#3B82F6] rounded-2xl flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform shadow-2xs">
                <Users size={28} />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B82F6] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  For Households & Residents
                </span>
                <h2 className="text-2xl font-extrabold text-[#0B1F3A] mt-2">
                  I Need Help
                </h2>
                <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                  Looking for a verified plumber, electrician, AC mechanic, carpenter or repair specialist in your area.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-2 text-xs text-[#172033]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Search local technicians by 6-digit PIN code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Compare transparent starting rates in ₹ (from ₹199)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Track booking status live from request to completion</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/register-customer')}
                className="w-full py-3.5 px-4 bg-[#0B1F3A] hover:bg-[#152E52] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group-hover:bg-[#3B82F6]"
              >
                <span>Continue as Customer ("I Need Help")</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Card 2: Helper / Service Provider */}
          <div className="bg-white rounded-3xl border-2 border-amber-200 hover:border-amber-400 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform shadow-2xs">
                <HardHat size={28} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    For Technicians & Workers
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    0% Commission
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#0B1F3A] mt-2">
                  I Am a Helper
                </h2>
                <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                  Join as an independent plumber, electrician, technician or carpenter to receive direct customer bookings.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-2 text-xs text-[#172033]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                  <span>List your services and set your own starting price in ₹</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                  <span>Receive customer jobs matching your registered PIN code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                  <span>One-click mobile portal to accept jobs and call customers</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/register-helper')}
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-gray-900 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>Continue as Helper ("I Am a Helper")</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

        </div>

        {/* Footer Account Link */}
        <div className="text-center pt-4">
          <p className="text-xs text-[#667085]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#0B1F3A] hover:underline inline-flex items-center gap-1">
              <span>Log in here</span>
              <LogIn size={13} />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
