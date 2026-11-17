import React, { useState } from 'react';
import { ServiceProvider, AvailabilityStatus } from '../../types';
import { useFixNear } from '../../context/FixNearContext';
import { formatIndianPhone, formatINR } from '../../utils/formatters';
import { Phone, MapPin, Wrench, Clock, ShieldCheck } from 'lucide-react';

interface WorkerProfileProps {
  provider: ServiceProvider;
}

export const WorkerProfile: React.FC<WorkerProfileProps> = ({ provider }) => {
  const { updateProvider } = useFixNear();
  const [availability, setAvailability] = useState<AvailabilityStatus>(provider?.availability || 'Available Today');
  const [isEditingArea, setIsEditingArea] = useState(false);
  const [areasText, setAreasText] = useState((provider?.areas || ['Pune']).join(', '));

  if (!provider) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-xs text-gray-500">
        No technician profile selected.
      </div>
    );
  }

  const handleToggleAvailability = (newStatus: AvailabilityStatus) => {
    setAvailability(newStatus);
    updateProvider({
      ...provider,
      availability: newStatus,
    });
  };

  const handleSaveAreas = () => {
    const updatedAreas = areasText.split(',').map(s => s.trim()).filter(Boolean);
    updateProvider({
      ...provider,
      areas: updatedAreas,
    });
    setIsEditingArea(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 shadow-xs space-y-6">
      <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-2xl bg-[#0B1F3A] text-white flex items-center justify-center font-bold text-xl shadow-xs">
          {provider.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#0B1F3A]">{provider.name}</h3>
          <p className="text-xs text-[#667085] capitalize font-medium">
            {provider.category.replace('-', ' ')} Specialist • {provider.experienceYears} Years
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <ShieldCheck size={14} />
            <span>Demonstration Technician Account</span>
          </div>
        </div>
      </div>

      {/* Availability Status Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#667085] mb-2">
          Work Availability Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['Available Today', 'Available Tomorrow', 'Busy'] as AvailabilityStatus[]).map((status) => {
            const isSelected = availability === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleToggleAvailability(status)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact & Trade details */}
      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#667085] flex items-center gap-1.5 font-medium">
            <Phone size={14} className="text-gray-400" />
            <span>Mobile Phone:</span>
          </span>
          <span className="font-mono font-bold text-[#172033]">
            {formatIndianPhone(provider.phone)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#667085] flex items-center gap-1.5 font-medium">
            <Wrench size={14} className="text-gray-400" />
            <span>Trade Category:</span>
          </span>
          <span className="font-semibold text-[#172033] capitalize">
            {provider.category.replace('-', ' ')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#667085] flex items-center gap-1.5 font-medium">
            <Clock size={14} className="text-gray-400" />
            <span>Starting Visit Charge:</span>
          </span>
          <span className="font-bold text-[#15803D]">
            {formatINR(provider.startingPrice)}
          </span>
        </div>
      </div>

      {/* Service Areas */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1">
            <MapPin size={13} />
            <span>Service Localities</span>
          </label>
          {!isEditingArea ? (
            <button
              onClick={() => setIsEditingArea(true)}
              className="text-xs text-[#3B82F6] font-semibold hover:underline"
            >
              Edit Areas
            </button>
          ) : (
            <button
              onClick={handleSaveAreas}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Save Changes
            </button>
          )}
        </div>

        {!isEditingArea ? (
          <div className="flex flex-wrap gap-1.5">
            {provider.areas.map(area => (
              <span key={area} className="px-2.5 py-1 bg-gray-100 text-[#172033] rounded-lg text-xs font-medium border border-gray-200">
                {area}
              </span>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={areasText}
              onChange={(e) => setAreasText(e.target.value)}
              placeholder="Koramangala, HSR Layout, BTM Layout"
              className="w-full text-xs rounded-lg border border-gray-300 p-2 bg-white"
            />
            <p className="text-[11px] text-[#667085]">Separate multiple localities with commas.</p>
          </div>
        )}
      </div>

      {/* PIN Codes */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#667085] block mb-2">
          Service PIN Codes
        </span>
        <div className="flex flex-wrap gap-1.5">
          {provider.pincodes.map(pin => (
            <span key={pin} className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-mono font-medium border border-blue-200">
              {pin}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
