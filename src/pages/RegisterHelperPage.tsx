import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFixNear } from '../context/FixNearContext';
import { useAuth } from '../context/AuthContext';
import { SERVICE_CATEGORIES } from '../data/categories';
import { ServiceCategoryId, ServiceProvider } from '../types';
import { isValidIndianPhone, isValidIndianPincode } from '../utils/validation';
import { requestBrowserLocation, DEFAULT_PUNE_COORDS } from '../utils/geo';
import { formatINR } from '../utils/formatters';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { 
  HardHat, 
  UserCheck, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Navigation, 
  Loader2, 
  AlertCircle,
  Search,
  Lock,
} from 'lucide-react';

export const RegisterHelperPage: React.FC = () => {
  const { setSelectedWorkerId, setCurrentRole, showToast, fetchLatestData } = useFixNear();
  const { registerHelper } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<ServiceCategoryId>('plumbing');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Pune');
  const [additionalPincodes, setAdditionalPincodes] = useState('');
  const [startingPrice, setStartingPrice] = useState<number>(199);
  const [experienceYears, setExperienceYears] = useState<number>(4);
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState<string[]>(['Hindi', 'Marathi']);
  
  // Geolocation
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>(DEFAULT_PUNE_COORDS);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [registeredProvider, setRegisteredProvider] = useState<ServiceProvider | null>(null);

  // Update starting price default when category changes
  const handleCategoryChange = (newCat: ServiceCategoryId) => {
    setCategory(newCat);
    const catObj = SERVICE_CATEGORIES.find(c => c.id === newCat);
    if (catObj) {
      setStartingPrice(catObj.startingPrice);
    }
  };

  // Toggle language selection
  const toggleLanguage = (lang: string) => {
    setLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  // Detect GPS Location
  const handleDetectGPS = async () => {
    setIsDetectingLocation(true);
    try {
      const res = await requestBrowserLocation();
      setCoordinates(res.coords);
      setLocationDetected(true);
      showToast('GPS coordinates detected and attached to your profile!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not detect GPS location';
      showToast(msg);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Full name must be at least 3 characters.';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || !isValidIndianPhone(cleanPhone)) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    const cleanPin = pincode.replace(/\D/g, '');
    if (!cleanPin || !isValidIndianPincode(cleanPin)) {
      errs.pincode = 'Enter a valid 6-digit Indian PIN code (e.g. 411038).';
    }

    if (!area.trim()) {
      errs.area = 'Primary area or locality is required (e.g. Kothrud, Deccan).';
    }

    if (startingPrice < 99) {
      errs.startingPrice = 'Starting price must be at least ₹99.';
    }

    if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Form Submission to Real Backend Database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const extraPins = additionalPincodes
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length === 6 && isValidIndianPincode(p));

    const allPincodes = Array.from(new Set([pincode.trim(), ...extraPins]));

    const payload = {
      fullName: fullName.trim(),
      businessName: businessName.trim(),
      phone: phone.replace(/\D/g, ''),
      email: email.trim() || undefined,
      password,
      confirmPassword,
      category,
      pincode: pincode.replace(/\D/g, ''),
      additionalPincodes: allPincodes,
      area: area.trim(),
      city: city.trim() || 'Pune',
      description: bio.trim(),
      experienceYears: Number(experienceYears) || 4,
      startingPrice: Number(startingPrice) || 199,
      availability: 'Available Today',
      languages: languages.length > 0 ? languages : ['Hindi', 'Marathi', 'English'],
      coordinates,
    };

    const res = await registerHelper(payload);
    setLoading(false);

    if (res.success && res.helper) {
      setRegisteredProvider(res.helper);
      setSelectedWorkerId(res.helper.id);
      await fetchLatestData();
      showToast('Helper account registered and saved to database!');
    } else {
      setErrors({ server: res.message || 'Helper registration failed.' });
    }
  };

  // If successfully registered, show celebratory next-step confirmation
  if (registeredProvider) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-md p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Helper Registration Successful • Saved in Shared Database
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A]">
              Welcome, {fullName}! Your Helper Profile is Live.
            </h1>
            <p className="text-sm text-[#667085] max-w-md mx-auto">
              Your profile is saved in the database. Any customer searching for PIN code <strong>{registeredProvider.pincodes?.[0] || pincode || '411038'}</strong> will now find you in real time!
            </p>
          </div>

          {/* Quick Summary Card */}
          <div className="bg-[#F8F8F5] rounded-xl p-4 border border-gray-200 text-left space-y-2 max-w-md mx-auto text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Business / Display Name:</span>
              <span className="font-bold text-[#0B1F3A]">{registeredProvider.name}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Service Trade:</span>
              <span className="font-bold capitalize text-[#3B82F6]">{(registeredProvider.category || 'plumbing').replace('-', ' ')}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Primary Service PIN:</span>
              <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-gray-300 text-emerald-700">
                {registeredProvider.pincodes?.[0] || pincode || '411038'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Starting Visit Rate:</span>
              <span className="font-bold text-[#0B1F3A]">{formatINR(registeredProvider.startingPrice || startingPrice || 199)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Contact Phone:</span>
              <span className="font-mono font-bold text-[#0B1F3A]">+91 {registeredProvider.phone || phone}</span>
            </div>
          </div>

          {/* Next Steps for Presentation */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <h3 className="text-sm font-bold text-[#0B1F3A]">
              Demonstration Workflow:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {/* Option 1: Search as Customer */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                    Step 1: Customer Discovery Test
                  </span>
                  <p className="text-xs font-semibold text-[#0B1F3A] mt-1">
                    Search PIN <span className="font-mono font-bold text-blue-700">{registeredProvider.pincodes?.[0] || pincode || '411038'}</span> in Customer View
                  </p>
                  <p className="text-[11px] text-[#667085] mt-1">
                    Verify that this helper is returned by the backend database query.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentRole('customer');
                    const targetPin = registeredProvider.pincodes?.[0] || pincode || '411038';
                    navigate(`/services?category=${registeredProvider.category}&pincode=${targetPin}`);
                  }}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-[#0B1F3A] hover:bg-[#152E52] text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors shadow-2xs"
                >
                  <Search size={14} />
                  <span>Search PIN {registeredProvider.pincodes?.[0] || pincode || '411038'}</span>
                </button>
              </div>

              {/* Option 2: Go to Worker Dashboard */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Step 2: Helper Job Portal
                  </span>
                  <p className="text-xs font-semibold text-[#0B1F3A] mt-1">
                    Open Your Helper Dashboard
                  </p>
                  <p className="text-[11px] text-[#667085] mt-1">
                    Receive incoming jobs, accept bookings, and mark work completed.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentRole('worker');
                    setSelectedWorkerId(registeredProvider.id);
                    navigate('/worker');
                  }}
                  className="w-full mt-3 inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-gray-900 text-xs font-bold py-2.5 px-3 rounded-lg transition-colors shadow-2xs"
                >
                  <HardHat size={14} />
                  <span>Open Helper Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Page Title & Context */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1 rounded-full text-xs font-semibold">
          <HardHat size={14} className="text-amber-600" />
          <span>Local Technician Onboarding • 0% Commission • Shared Database</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
          Register as a Service Helper
        </h1>

        <p className="text-sm text-[#667085] max-w-xl mx-auto">
          Create a verified helper account with your real PIN code. When customers in your area search for your trade, your profile will appear with your upfront visit charges in ₹.
        </p>
      </div>

      {errors.server && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 max-w-2xl mx-auto">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{errors.server}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Section 1: Trade Category */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
            1. Select Your Service Trade <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SERVICE_CATEGORIES.map(cat => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#3B82F6] bg-blue-50/50 shadow-2xs'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CategoryIcon categoryId={cat.id} size={18} className={isSelected ? 'text-[#3B82F6]' : 'text-gray-500'} />
                    {isSelected && <CheckCircle2 size={16} className="text-[#3B82F6]" />}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#0B1F3A]">{cat.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">from ₹{cat.startingPrice}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Personal & Business Details */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
            2. Personal & Business Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Patil"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs text-[#172033] focus:outline-hidden ${
                  errors.fullName ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200 focus:border-[#3B82F6]'
                }`}
              />
              {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Business / Display Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Plumbing Express"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-[#172033] focus:border-[#3B82F6] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Indian Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9822012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className={`w-full pl-12 pr-3 py-2.5 rounded-xl border text-xs font-mono text-[#172033] focus:outline-hidden ${
                    errors.phone ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200 focus:border-[#3B82F6]'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                placeholder="helper@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-[#172033] focus:border-[#3B82F6] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Account Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Create Account Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-[#172033] focus:outline-hidden ${
                    errors.password ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200 focus:border-[#3B82F6]'
                  }`}
                />
              </div>
              {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-[#172033] focus:outline-hidden ${
                    errors.confirmPassword ? 'border-rose-300 bg-rose-50/30' : 'border-gray-200 focus:border-[#3B82F6]'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Location & PIN Code */}
        <div className="space-y-4 pt-4 border-t border-gray-100 bg-blue-50/30 -mx-6 sm:-mx-8 px-6 sm:px-8 py-5 border-y">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-1.5">
              <MapPin size={15} className="text-[#3B82F6]" />
              <span>3. Service Area & Real PIN Code</span>
            </label>
            <span className="text-[11px] text-[#3B82F6] font-semibold">Any 6-digit Indian PIN supported</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Primary Service PIN Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 411038"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-mono font-bold tracking-wider text-[#172033] focus:outline-hidden ${
                  errors.pincode ? 'border-rose-300 bg-rose-50' : 'border-gray-300 bg-white focus:border-[#3B82F6]'
                }`}
              />
              {errors.pincode && <p className="text-[11px] text-rose-500 mt-1">{errors.pincode}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Area / Locality Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kothrud, Paud Road"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs text-[#172033] focus:outline-hidden bg-white ${
                  errors.area ? 'border-rose-300 bg-rose-50' : 'border-gray-300 focus:border-[#3B82F6]'
                }`}
              />
              {errors.area && <p className="text-[11px] text-rose-500 mt-1">{errors.area}</p>}
            </div>
          </div>

          {/* GPS Coordinates Detection */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-xl border border-gray-200">
            <div>
              <div className="text-xs font-bold text-[#0B1F3A] flex items-center gap-1.5">
                <Navigation size={13} className="text-[#3B82F6]" />
                <span>Map Coordinates (For Leaflet Map Plotting)</span>
              </div>
              <div className="text-[11px] text-gray-500">
                {locationDetected ? (
                  <span className="text-emerald-600 font-semibold">
                    ✓ Coordinates attached: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                  </span>
                ) : (
                  <span>Attach current GPS position so nearby customers can see your straight-line distance.</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetectingLocation}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors border border-gray-300 shrink-0"
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 size={13} className="animate-spin text-blue-600" />
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <Navigation size={13} className="text-blue-600" />
                  <span>Detect GPS Location</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 4: Pricing & Bio */}
        <div className="space-y-4 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
            4. Estimated Starting Visit Charge & Experience
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Estimated Starting Visit Rate (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">₹</span>
                <input
                  type="number"
                  min={99}
                  step={10}
                  value={startingPrice}
                  onChange={(e) => setStartingPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold text-[#0B1F3A] focus:border-[#3B82F6] focus:outline-hidden"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Starting charge for inspection / minor repair.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Years of Experience
              </label>
              <select
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-[#172033] focus:border-[#3B82F6] focus:outline-hidden bg-white"
              >
                <option value={1}>1 Year Experience</option>
                <option value={2}>2 Years Experience</option>
                <option value={3}>3 Years Experience</option>
                <option value={5}>5+ Years Experience</option>
                <option value={10}>10+ Years Experience</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Short Description / Specialties
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 8+ years experience in bathroom pipe fitting, geyser repair, drainage blockage clearing. Fast 30-min response."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-[#172033] focus:border-[#3B82F6] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#667085]">
            Saves your profile to the shared database so customers can find and book you.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-[#0B1F3A] hover:bg-[#152E52] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <>
                <UserCheck size={16} />
                <span>Complete Registration & Go Live</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
