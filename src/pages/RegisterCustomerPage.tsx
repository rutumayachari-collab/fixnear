import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFixNear } from '../context/FixNearContext';
import { isValidIndianPhone, isValidIndianPincode } from '../utils/validation';
import { Users, Phone, MapPin, Lock, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export const RegisterCustomerPage: React.FC = () => {
  const { registerCustomer } = useAuth();
  const { setCurrentRole, showToast } = useFixNear();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('Hindi');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full name (at least 3 characters).';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || !isValidIndianPhone(cleanPhone)) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    const cleanPin = pincode.replace(/\D/g, '');
    if (!cleanPin || !isValidIndianPincode(cleanPin)) {
      errs.pincode = 'Enter a valid 6-digit Indian PIN code (e.g. 411038).';
    }

    if (!address.trim() || address.trim().length < 5) {
      errs.address = 'Please provide your full address / flat & locality.';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const res = await registerCustomer({
      fullName: fullName.trim(),
      phone: phone.replace(/\D/g, ''),
      email: email.trim() || undefined,
      password,
      confirmPassword,
      pincode: pincode.replace(/\D/g, ''),
      address: address.trim(),
      language,
    });

    setLoading(false);

    if (res.success) {
      showToast('Registration successful! Welcome to FixNear.');
      setCurrentRole('customer');
      navigate('/my-bookings');
    } else {
      setErrors({ server: res.message });
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 sm:py-12">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-50 text-[#3B82F6] rounded-xl flex items-center justify-center mx-auto border border-blue-100">
            <Users size={22} />
          </div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Create Customer Account</h1>
          <p className="text-xs text-[#667085]">
            Register to find verified plumbers, electricians, and technicians in your neighborhood.
          </p>
        </div>

        {errors.server && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errors.server}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Rohit Kulkarni"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-xs text-[#172033] focus:outline-hidden ${
                errors.fullName ? 'border-rose-300 bg-rose-50/40' : 'border-gray-300 focus:border-[#3B82F6]'
              }`}
            />
            {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Mobile & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Indian Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9822012345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className={`w-full pl-11 pr-3 py-2.5 rounded-xl border text-xs font-mono text-[#172033] focus:outline-hidden ${
                    errors.phone ? 'border-rose-300 bg-rose-50/40' : 'border-gray-300 focus:border-[#3B82F6]'
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
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-[#172033] focus:border-[#3B82F6] focus:outline-hidden"
              />
            </div>
          </div>

          {/* PIN code & Preferred Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Home PIN Code <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 411038"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-mono font-bold text-[#172033] focus:outline-hidden ${
                    errors.pincode ? 'border-rose-300 bg-rose-50/40' : 'border-gray-300 focus:border-[#3B82F6]'
                  }`}
                />
              </div>
              {errors.pincode && <p className="text-[11px] text-rose-500 mt-1">{errors.pincode}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-[#172033] focus:border-[#3B82F6] focus:outline-hidden bg-white"
              >
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="English">English</option>
                <option value="Gujarati">Gujarati</option>
              </select>
            </div>
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Home Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Flat 302, Mayur Colony, Paud Road, Kothrud, Pune"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs text-[#172033] focus:outline-hidden ${
                errors.address ? 'border-rose-300 bg-rose-50/40' : 'border-gray-300 focus:border-[#3B82F6]'
              }`}
            />
            {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Create Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs text-[#172033] focus:outline-hidden ${
                    errors.password ? 'border-rose-300 bg-rose-50/40' : 'border-gray-300 focus:border-[#3B82F6]'
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
                    errors.confirmPassword ? 'border-rose-300 bg-rose-50/40' : 'border-gray-300 focus:border-[#3B82F6]'
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-rose-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin text-white" />
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Complete Customer Registration</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#667085] space-y-2">
          <div>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#3B82F6] hover:underline">
              Log in here
            </Link>
          </div>
          <div>
            Are you a service technician?{' '}
            <Link to="/register-helper" className="font-bold text-amber-700 hover:underline">
              Register as Helper
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
