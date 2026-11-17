import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFixNear } from '../context/FixNearContext';
import { Lock, Phone, ArrowRight, UserCheck, HardHat, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { setCurrentRole, setSelectedWorkerId, showToast } = useFixNear();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide your mobile number/email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login({ identifier: identifier.trim(), password });
    setLoading(false);

    if (result.success) {
      showToast(result.message);
      if (result.role === 'helper') {
        setCurrentRole('worker');
        navigate('/worker');
      } else if (result.role === 'admin') {
        setCurrentRole('admin');
        navigate('/admin');
      } else {
        setCurrentRole('customer');
        const redirect = searchParams.get('redirect') || '/my-bookings';
        navigate(redirect);
      }
    } else {
      setError(result.message);
    }
  };

  // Quick Demo One-Click Logins for Presentation
  const handleQuickLogin = async (type: 'customer' | 'helper' | 'admin') => {
    setLoading(true);
    setError(null);

    let phone = '';
    let pass = 'demo12345';

    if (type === 'customer') {
      phone = '9881122334';
    } else if (type === 'helper') {
      phone = '9822012345'; // Ramesh Shinde
    } else if (type === 'admin') {
      phone = '9999999999';
    }

    const res = await login({ identifier: phone, password: pass });
    setLoading(false);

    if (res.success) {
      showToast(`Logged in as Demo ${type.toUpperCase()}!`);
      if (type === 'helper') {
        setCurrentRole('worker');
        setSelectedWorkerId('prov-01');
        navigate('/worker');
      } else if (type === 'admin') {
        setCurrentRole('admin');
        navigate('/admin');
      } else {
        setCurrentRole('customer');
        navigate('/my-bookings');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#0B1F3A] text-white rounded-xl flex items-center justify-center mx-auto shadow-2xs">
            <Lock size={22} className="text-[#3B82F6]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Log in to FixNear</h1>
          <p className="text-xs text-[#667085]">
            Access your customer bookings or technician service portal.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mobile Number or Email
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. 9822012345 or user@demo.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs text-[#172033] focus:border-[#3B82F6] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-xs text-[#172033] focus:border-[#3B82F6] focus:outline-hidden"
              />
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
                <span>Log In</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins for Fast Professor Evaluation */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">
            One-Click Demo Evaluator Logins:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-700 flex flex-col items-center gap-1 text-center"
            >
              <UserCheck size={14} className="text-[#3B82F6]" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('helper')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-700 flex flex-col items-center gap-1 text-center"
            >
              <HardHat size={14} className="text-amber-500" />
              <span>Helper</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-[11px] font-semibold text-gray-700 flex flex-col items-center gap-1 text-center"
            >
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Register Links */}
        <div className="pt-2 text-center space-y-2 text-xs text-[#667085]">
          <div>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#3B82F6] hover:underline">
              Register as Customer
            </Link>
          </div>
          <div>
            Want to offer services?{' '}
            <Link to="/register-helper" className="font-bold text-amber-700 hover:underline">
              Register as Helper
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
