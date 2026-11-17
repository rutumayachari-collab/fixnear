import React, { useState } from 'react';
import { ServiceProvider } from '../../types';
import { useFixNear } from '../../context/FixNearContext';
import { formatINR, formatIndianPhone, getInitials } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';
import { ProviderFormModal } from './ProviderFormModal';
import { Plus, Edit2, Power, Search } from 'lucide-react';

export const AdminProvidersTable: React.FC = () => {
  const { providers, toggleProviderActive } = useFixNear();
  const [searchQuery, setSearchQuery] = useState('');
  const [providerToEdit, setProviderToEdit] = useState<ServiceProvider | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProviders = providers.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.areas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.pincodes.some(pin => pin.includes(searchQuery));

    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[#0B1F3A]">Service Providers</h3>
          <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">
            {filteredProviders.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search provider, area, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 text-xs rounded-xl border border-gray-300 pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
          </div>

          {/* Add Provider Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Provider</span>
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-[#172033]">
          <thead className="bg-gray-100/75 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-[#667085]">
            <tr>
              <th className="py-3 px-4">Provider Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Areas & PINs</th>
              <th className="py-3 px-4">Starting Rate</th>
              <th className="py-3 px-4">Availability</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filteredProviders.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {getInitials(p.name)}
                    </div>
                    <div>
                      <div className="font-bold text-[#0B1F3A] flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.badge && (
                          <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#667085] font-mono">
                        {formatIndianPhone(p.phone)} • {p.experienceYears} yrs
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="capitalize font-semibold text-gray-800 flex items-center gap-1">
                    <CategoryIcon categoryId={p.category} size={13} className="text-[#3B82F6]" />
                    {p.category.replace('-', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="max-w-[200px] truncate text-gray-700 font-normal">
                    {p.areas.join(', ')}
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    PIN: {p.pincodes.slice(0, 3).join(', ')}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#15803D]">
                  {formatINR(p.startingPrice)}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    p.availability === 'Available Today' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {p.availability}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    p.isActive 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    <button
                      onClick={() => setProviderToEdit(p)}
                      className="p-1.5 text-gray-600 hover:text-[#0B1F3A] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit Provider"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => toggleProviderActive(p.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        p.isActive 
                          ? 'text-emerald-600 hover:bg-emerald-50' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={p.isActive ? 'Deactivate Provider' : 'Activate Provider'}
                    >
                      <Power size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Providers View */}
      <div className="md:hidden divide-y divide-gray-100 p-3 space-y-3">
        {filteredProviders.map((p) => (
          <div key={p.id} className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 space-y-2 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-[#0B1F3A] text-sm block">{p.name}</span>
                <span className="text-[#667085] capitalize">{p.category.replace('-', ' ')} • {formatIndianPhone(p.phone)}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {p.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="text-[#667085]">
              <span className="font-medium text-gray-700">Areas:</span> {p.areas.join(', ')}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-gray-200">
              <span className="font-bold text-[#15803D]">{formatINR(p.startingPrice)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProviderToEdit(p)}
                  className="px-2.5 py-1 bg-white border border-gray-300 rounded text-gray-700 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleProviderActive(p.id)}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    p.isActive ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {p.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add or Edit */}
      {(showAddModal || providerToEdit) && (
        <ProviderFormModal
          isOpen={true}
          onClose={() => {
            setShowAddModal(false);
            setProviderToEdit(null);
          }}
          providerToEdit={providerToEdit}
        />
      )}
    </div>
  );
};
