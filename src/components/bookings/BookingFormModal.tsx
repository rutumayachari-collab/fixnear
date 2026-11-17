import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFixNear } from '../../context/FixNearContext';
import { ServiceProvider, ServiceCategoryId, Booking } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { isValidIndianPhone, isValidIndianPincode, isFutureOrToday } from '../../utils/validation';
import { formatINR } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { CheckCircle2, Calendar, Clock, MapPin, Phone, User, Info, ArrowRight } from 'lucide-react';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProvider?: ServiceProvider | null;
  initialCategory?: ServiceCategoryId | null;
}

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  initialProvider,
  initialCategory,
}) => {
  const { providers, createBooking } = useFixNear();
  const navigate = useNavigate();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryId>('plumbing');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [problemDescription, setProblemDescription] = useState('');
  const [pincode, setPincode] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 01:00 PM');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success state after booking
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Initialize or reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const cat = initialCategory || (initialProvider ? initialProvider.category : 'plumbing');
      setSelectedCategory(cat);

      if (initialProvider) {
        setSelectedProviderId(initialProvider.id);
        if (initialProvider.pincodes.length > 0) {
          setPincode(initialProvider.pincodes[0]);
        }
        if (initialProvider.areas.length > 0) {
          setArea(initialProvider.areas[0]);
        }
      } else {
        const match = providers.find(p => p.category === cat && p.isActive);
        setSelectedProviderId(match ? match.id : '');
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setPreferredDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen, initialProvider, initialCategory, providers]);

  const handleClose = () => {
    setCreatedBooking(null);
    setErrors({});
    onClose();
  };

  // Update available providers when category changes
  const categoryProviders = providers.filter(p => p.category === selectedCategory && p.isActive);

  const handleCategoryChange = (newCat: ServiceCategoryId) => {
    setSelectedCategory(newCat);
    const available = providers.filter(p => p.category === newCat && p.isActive);
    if (available.length > 0) {
      setSelectedProviderId(available[0].id);
    } else {
      setSelectedProviderId('');
    }
  };

  const selectedProviderObj = providers.find(p => p.id === selectedProviderId);
  const estimatedPrice = selectedProviderObj?.startingPrice || 199;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.customerName = 'Please enter your full name (at least 2 letters).';
    }

    if (!isValidIndianPhone(customerPhone)) {
      errs.customerPhone = 'Enter a valid 10-digit Indian mobile number (e.g. 9845012345).';
    }

    if (!problemDescription.trim() || problemDescription.trim().length < 8) {
      errs.problemDescription = 'Please briefly describe the issue (minimum 8 characters).';
    }

    if (!isValidIndianPincode(pincode)) {
      errs.pincode = 'Enter a valid 6-digit Indian PIN code (e.g. 560034).';
    }

    if (!area.trim()) {
      errs.area = 'Please mention your locality/area (e.g. Koramangala).';
    }

    if (!address.trim() || address.trim().length < 5) {
      errs.address = 'Enter your flat/house number and street address.';
    }

    if (!preferredDate) {
      errs.preferredDate = 'Please pick an appointment date.';
    } else if (!isFutureOrToday(preferredDate)) {
      errs.preferredDate = 'Appointment date cannot be in the past.';
    }

    if (!selectedProviderId) {
      errs.selectedProviderId = 'Please select a service provider.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const newBooking = await createBooking({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim().replace(/\D/g, ''),
        customerAddress: address.trim(),
        pincode: pincode.trim(),
        area: area.trim(),
        category: selectedCategory,
        providerId: selectedProviderId,
        providerName: selectedProviderObj?.name || 'Assigned Local Specialist',
        problemDescription: problemDescription.trim(),
        preferredDate,
        preferredTime,
        estimatedPrice,
      });

      setCreatedBooking(newBooking);
    } catch (err) {
      console.error('Booking submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdBooking ? "Booking Submitted Successfully!" : "Book a Local Service Request"}
      subtitle={createdBooking ? "Demo Request Generated & Stored" : "Fill in your details for doorstep service"}
      maxWidth="lg"
    >
      {createdBooking ? (
        /* Success Screen */
        <div className="space-y-5 text-center py-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">
              Demonstration Booking ID
            </span>
            <div className="text-2xl font-mono font-bold text-[#0B1F3A] mt-0.5">
              {createdBooking.id}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-xs text-[#667085]">Initial Status:</span>
              <StatusBadge status={createdBooking.status} size="md" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#667085]">Service:</span>
              <span className="font-semibold text-[#172033] capitalize">{createdBooking.category.replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Technician / Provider:</span>
              <span className="font-semibold text-[#172033]">{createdBooking.providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Estimated Starting Price:</span>
              <span className="font-semibold text-[#15803D]">{formatINR(createdBooking.estimatedPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Appointment:</span>
              <span className="font-semibold text-[#172033]">{createdBooking.preferredDate} ({createdBooking.preferredTime})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Service Area & PIN:</span>
              <span className="font-semibold text-[#172033]">{createdBooking.area} ({createdBooking.pincode})</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 text-left flex items-start gap-2">
            <Info size={16} className="text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong>Presentation Tip:</strong> Switch to <strong>Worker Mode</strong> using the top banner to accept this job as a technician, or open <strong>My Bookings</strong> to view the live status tracker.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                handleClose();
                navigate('/my-bookings');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              View in My Bookings
            </button>
            <button
              onClick={() => {
                handleClose();
                navigate('/worker');
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Switch to Worker Mode</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category & Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Service Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value as ServiceCategoryId)}
                className="w-full text-xs rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
              >
                {SERVICE_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} (from {formatINR(cat.startingPrice)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Service Provider <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                className={`w-full text-xs rounded-lg border px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] ${
                  errors.selectedProviderId ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
                }`}
              >
                {categoryProviders.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} • {formatINR(p.startingPrice)} ({p.availability})
                  </option>
                ))}
              </select>
              {errors.selectedProviderId && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.selectedProviderId}</p>
              )}
            </div>
          </div>

          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full text-xs rounded-lg border pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] ${
                    errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
                  }`}
                />
                <User size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
              {errors.customerName && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit Indian Mobile (e.g. 9845012345)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  className={`w-full text-xs rounded-lg border pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] ${
                    errors.customerPhone ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
                  }`}
                />
                <Phone size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
              {errors.customerPhone && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.customerPhone}</p>
              )}
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-xs font-medium text-[#172033] mb-1">
              Problem Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Kitchen tap is dripping continuously, need replacement or washer change"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className={`w-full text-xs rounded-lg border p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] ${
                errors.problemDescription ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
              }`}
            />
            {errors.problemDescription && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.problemDescription}</p>
            )}
          </div>

          {/* Locality & PIN Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Area / Locality <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Koramangala 4th Block"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className={`w-full text-xs rounded-lg border px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] ${
                  errors.area ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
                }`}
              />
              {errors.area && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.area}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Indian PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="6-digit PIN (e.g. 560034)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className={`w-full text-xs rounded-lg border px-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] ${
                  errors.pincode ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
                }`}
              />
              {errors.pincode && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.pincode}</p>
              )}
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-medium text-[#172033] mb-1">
              Flat / House No. & Complete Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Flat 302, Sai Residency, 7th Cross"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full text-xs rounded-lg border pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] ${
                  errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
                }`}
              />
              <MapPin size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            </div>
            {errors.address && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.address}</p>
            )}
          </div>

          {/* Appointment Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Preferred Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className={`w-full text-xs rounded-lg border pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6] ${
                    errors.preferredDate ? 'border-rose-400 bg-rose-50/30' : 'border-gray-300'
                  }`}
                />
                <Calendar size={14} className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none" />
              </div>
              {errors.preferredDate && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.preferredDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#172033] mb-1">
                Preferred Time Slot <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full text-xs rounded-lg border border-gray-300 pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3B82F6]"
                >
                  <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="03:00 PM - 06:00 PM">Late Afternoon (03:00 PM - 06:00 PM)</option>
                  <option value="06:00 PM - 08:00 PM">Evening (06:00 PM - 08:00 PM)</option>
                </select>
                <Clock size={14} className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Pricing transparency note */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs flex items-start justify-between gap-3">
            <div>
              <span className="text-[#667085] block">Estimated starting visit charge:</span>
              <span className="text-base font-bold text-[#15803D]">{formatINR(estimatedPrice)}</span>
              <p className="text-[11px] text-[#667085] mt-0.5">
                Final charges depend on the scope of work, labor time, and any required replacement spare parts.
              </p>
            </div>
            <span className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-500 shrink-0 font-medium">
              Demo Booking
            </span>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0B1F3A] hover:bg-[#142d52] rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Demo Booking'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
