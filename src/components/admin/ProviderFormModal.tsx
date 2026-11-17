import React, { useState, useEffect } from 'react';
import { ServiceProvider, ServiceCategoryId, AvailabilityStatus } from '../../types';
import { SERVICE_CATEGORIES } from '../../data/categories';
import { useFixNear } from '../../context/FixNearContext';
import { Modal } from '../common/Modal';
import { isValidIndianPhone } from '../../utils/validation';
import { DEFAULT_PUNE_COORDS } from '../../utils/geo';

interface ProviderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerToEdit?: ServiceProvider | null;
}

export const ProviderFormModal: React.FC<ProviderFormModalProps> = ({
  isOpen,
  onClose,
  providerToEdit,
}) => {
  const { addProvider, updateProvider } = useFixNear();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<ServiceCategoryId>('plumbing');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Pune');
  const [areasInput, setAreasInput] = useState('');
  const [pincodesInput, setPincodesInput] = useState('');
  const [latInput, setLatInput] = useState('18.5204');
  const [lngInput, setLngInput] = useState('73.8567');
  const [startingPrice, setStartingPrice] = useState('199');
  const [rating, setRating] = useState('4.8');
  const [reviewCount, setReviewCount] = useState('50');
  const [experienceYears, setExperienceYears] = useState('5');
  const [availability, setAvailability] = useState<AvailabilityStatus>('Available Today');
  const [bio, setBio] = useState('');
  const [badge, setBadge] = useState('Top Rated');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (providerToEdit) {
      setName(providerToEdit.name);
      setTagline(providerToEdit.tagline);
      setCategory(providerToEdit.category);
      setPhone(providerToEdit.phone);
      setCity(providerToEdit.city || 'Pune');
      setAreasInput(providerToEdit.areas.join(', '));
      setPincodesInput(providerToEdit.pincodes.join(', '));
      setLatInput(String(providerToEdit.coordinates?.lat || DEFAULT_PUNE_COORDS.lat));
      setLngInput(String(providerToEdit.coordinates?.lng || DEFAULT_PUNE_COORDS.lng));
      setStartingPrice(String(providerToEdit.startingPrice));
      setRating(String(providerToEdit.rating));
      setReviewCount(String(providerToEdit.reviewCount));
      setExperienceYears(String(providerToEdit.experienceYears));
      setAvailability(providerToEdit.availability);
      setBio(providerToEdit.bio);
      setBadge(providerToEdit.badge || '');
    } else {
      setName('');
      setTagline('');
      setCategory('plumbing');
      setPhone('');
      setCity('Pune');
      setAreasInput('Kothrud, Deccan');
      setPincodesInput('411038, 411004');
      setLatInput('18.5074');
      setLngInput('73.8077');
      setStartingPrice('199');
      setRating('4.8');
      setReviewCount('45');
      setExperienceYears('6');
      setAvailability('Available Today');
      setBio('');
      setBadge('Top Rated');
    }
    setErrors({});
  }, [providerToEdit, isOpen]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Technician / business name is required.';
    if (!isValidIndianPhone(phone)) errs.phone = 'Valid 10-digit Indian mobile number required.';
    if (!areasInput.trim()) errs.areas = 'At least one locality/area is required.';
    if (!pincodesInput.trim()) errs.pincodes = 'At least one 6-digit PIN code is required.';
    if (isNaN(Number(startingPrice)) || Number(startingPrice) <= 0) {
      errs.startingPrice = 'Valid starting price in ₹ is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAreas = areasInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedPincodes = pincodesInput.split(',').map(s => s.trim().replace(/\D/g, '')).filter(Boolean);
    const lat = Number(latInput) || DEFAULT_PUNE_COORDS.lat;
    const lng = Number(lngInput) || DEFAULT_PUNE_COORDS.lng;

    if (providerToEdit) {
      updateProvider({
        ...providerToEdit,
        name: name.trim(),
        tagline: tagline.trim() || `${name} Service Expert`,
        category,
        phone: phone.trim().replace(/\D/g, ''),
        city: city.trim(),
        areas: parsedAreas,
        pincodes: parsedPincodes,
        coordinates: { lat, lng },
        startingPrice: Number(startingPrice),
        rating: Number(rating) || 4.8,
        reviewCount: Number(reviewCount) || 50,
        experienceYears: Number(experienceYears) || 5,
        availability,
        bio: bio.trim() || `${name} provides professional home service across ${city}.`,
        badge: badge.trim() || undefined,
      });
    } else {
      addProvider({
        name: name.trim(),
        tagline: tagline.trim() || `${name} Service Expert`,
        category,
        phone: phone.trim().replace(/\D/g, ''),
        city: city.trim(),
        areas: parsedAreas,
        pincodes: parsedPincodes,
        coordinates: { lat, lng },
        startingPrice: Number(startingPrice),
        rating: Number(rating) || 4.8,
        reviewCount: Number(reviewCount) || 50,
        experienceYears: Number(experienceYears) || 5,
        availability,
        isActive: true,
        bio: bio.trim() || `${name} provides professional home service across ${city}.`,
        badge: badge.trim() || undefined,
        languages: ['Marathi', 'Hindi', 'English'],
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={providerToEdit ? `Edit Provider: ${providerToEdit.name}` : 'Add New Service Provider'}
      subtitle="Register an independent local technician in the Pune demonstration platform"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name & Trade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Provider / Technician Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Shinde Plumbing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 bg-white"
            />
            {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Service Trade <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategoryId)}
              className="w-full rounded-lg border border-gray-300 p-2 bg-white"
            >
              {SERVICE_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Phone & Starting Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Indian Mobile (10-digit) <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              placeholder="9822012345"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg border border-gray-300 p-2 bg-white"
            />
            {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Starting Visit Charge (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder="199"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 bg-white"
            />
            {errors.startingPrice && <p className="text-[11px] text-rose-600 mt-1">{errors.startingPrice}</p>}
          </div>
        </div>

        {/* Areas & PIN codes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Service Areas (comma separated) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Kothrud, Deccan, Karve Nagar"
              value={areasInput}
              onChange={(e) => setAreasInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 bg-white"
            />
            {errors.areas && <p className="text-[11px] text-rose-600 mt-1">{errors.areas}</p>}
          </div>

          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              PIN Codes (comma separated) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="411038, 411004"
              value={pincodesInput}
              onChange={(e) => setPincodesInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 bg-white"
            />
            {errors.pincodes && <p className="text-[11px] text-rose-600 mt-1">{errors.pincodes}</p>}
          </div>
        </div>

        {/* Map Coordinates (Pune area) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Map Latitude (Pune ~18.52)
            </label>
            <input
              type="text"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-1.5 bg-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Map Longitude (Pune ~73.85)
            </label>
            <input
              type="text"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-1.5 bg-white font-mono"
            />
          </div>
        </div>

        {/* Experience & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Experience (Years)
            </label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
              className="w-full rounded-lg border border-gray-300 p-2 bg-white"
            >
              <option value="Available Today">Available Today</option>
              <option value="Available Tomorrow">Available Tomorrow</option>
              <option value="Busy">Busy</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#172033] mb-1">
              Badge Label
            </label>
            <input
              type="text"
              placeholder="Top Rated / Specialist"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 bg-white"
            />
          </div>
        </div>

        {/* Tagline / Bio */}
        <div>
          <label className="block font-semibold text-[#172033] mb-1">
            Short Service Description / Tagline
          </label>
          <input
            type="text"
            placeholder="Expert in pipe leakage and sanitary fittings"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 bg-white"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#0B1F3A] hover:bg-[#142d52] rounded-lg shadow-xs"
          >
            {providerToEdit ? 'Save Changes' : 'Add Provider'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
