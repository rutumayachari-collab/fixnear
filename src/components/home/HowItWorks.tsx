import React from 'react';
import { Link } from 'react-router-dom';
import { Search, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Find the service you need',
      desc: 'Browse plumbing, electrical, AC servicing, carpentry, or appliance repair. Filter by your 6-digit Indian PIN code to locate local technicians near your home.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Compare estimated charges',
      desc: 'View transparent starting prices in ₹ with zero hidden markup. Select a suitable date and preferred time slot for the technician visit.',
      icon: CalendarCheck,
    },
    {
      num: '03',
      title: 'Track your booking progress',
      desc: 'Receive a unique booking ID. The technician reviews the job in Worker Mode, accepts your request, and contacts you directly to complete the repair.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-16 bg-[#F8F8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3B82F6]">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] mt-1">
            How FixNear Works
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-2">
            A practical, direct bridge between Indian households and local skilled technicians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-gray-200 relative flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-extrabold text-gray-200 font-mono">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#0B1F3A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#667085] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#0B1F3A]">
                  <span>Step {step.num} of 3</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-lg font-bold text-[#0B1F3A]">
              Need a quick repair right now?
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              Explore available local providers in your neighborhood or test the demonstration booking flow.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/services"
              className="px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Find a Service</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/services"
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#172033] text-xs font-semibold rounded-lg transition-colors"
            >
              Book a Repair
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
