import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFixNear } from '../../context/FixNearContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Wrench, 
  Menu, 
  X, 
  CalendarCheck, 
  Compass, 
  PlusCircle, 
  HardHat, 
  LogIn, 
  UserPlus, 
  LogOut, 
  User, 
  ShieldCheck 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { bookings, setCurrentRole } = useFixNear();
  const { user, logout } = useAuth();

  const activeBookingsCount = bookings.filter(
    b => b.status === 'Requested' || b.status === 'Accepted' || b.status === 'In Progress'
  ).length;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    await logout();
    setCurrentRole('customer');
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-[41px] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#152E52] transition-colors">
              <Wrench size={20} className="text-[#3B82F6] transform -rotate-12 group-hover:rotate-0 transition-transform duration-200" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-xl font-bold tracking-tight text-[#0B1F3A]">FixNear</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] ml-0.5"></span>
              </div>
              <p className="text-[10px] text-[#667085] font-medium leading-none tracking-wider uppercase">
                Local Repair Finder
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-[#0B1F3A] bg-gray-100 font-semibold' 
                  : 'text-[#667085] hover:text-[#172033] hover:bg-gray-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/services"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/services') 
                  ? 'text-[#0B1F3A] bg-gray-100 font-semibold' 
                  : 'text-[#667085] hover:text-[#172033] hover:bg-gray-50'
              }`}
            >
              <Compass size={16} />
              <span>Services</span>
            </Link>

            {/* If Customer or not logged in: My Bookings */}
            {(!user || user.role === 'customer') && (
              <Link
                to="/my-bookings"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive('/my-bookings') 
                    ? 'text-[#0B1F3A] bg-gray-100 font-semibold' 
                    : 'text-[#667085] hover:text-[#172033] hover:bg-gray-50'
                }`}
              >
                <CalendarCheck size={16} />
                <span>My Bookings</span>
                {activeBookingsCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold text-white bg-[#3B82F6] rounded-full">
                    {activeBookingsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Helper Portal link for helper or unauthenticated */}
            {(!user || user.role !== 'helper') && (
              <Link
                to="/register-helper"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/register-helper')
                    ? 'text-amber-800 bg-amber-50 font-bold border border-amber-200'
                    : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/70'
                }`}
              >
                <HardHat size={16} className="text-amber-600" />
                <span>Join as Helper</span>
              </Link>
            )}

            {/* If Helper logged in: Helper Dashboard */}
            {user?.role === 'helper' && (
              <Link
                to="/worker"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/worker')
                    ? 'text-amber-900 bg-amber-100 font-bold'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                <HardHat size={16} className="text-amber-600" />
                <span>Helper Portal</span>
              </Link>
            )}

            {/* If Admin logged in: Admin Dashboard */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/admin')
                    ? 'text-blue-900 bg-blue-100 font-bold'
                    : 'text-blue-800 hover:bg-blue-50'
                }`}
              >
                <ShieldCheck size={16} className="text-blue-600" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Right Action Group */}
          <div className="hidden sm:flex items-center gap-2.5">
            {user ? (
              /* Authenticated User Menu */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-[#0B1F3A]">
                  <User size={13} className="text-[#3B82F6]" />
                  <span>{user.name.split(' ')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    user.role === 'helper'
                      ? 'bg-amber-100 text-amber-800'
                      : user.role === 'admin'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Log Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              /* Guest Actions: Log in & Register */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-[#0B1F3A] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogIn size={14} />
                  <span>Log in</span>
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-[#0B1F3A] px-3 py-2 rounded-lg transition-colors border border-gray-200"
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Primary CTA */}
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 bg-[#0B1F3A] hover:bg-[#142d52] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle size={15} />
              <span>Book a Repair</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {user && (
            <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[#3B82F6]" />
                <div>
                  <div className="font-bold text-[#0B1F3A]">{user.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{user.role} account</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          )}

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/') ? 'text-[#0B1F3A] bg-gray-100 font-semibold' : 'text-[#667085]'
            }`}
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/services') ? 'text-[#0B1F3A] bg-gray-100 font-semibold' : 'text-[#667085]'
            }`}
          >
            Find Services
          </Link>

          {(!user || user.role === 'customer') && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/my-bookings') ? 'text-[#0B1F3A] bg-gray-100 font-semibold' : 'text-[#667085]'
              }`}
            >
              <span>My Bookings</span>
              {activeBookingsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-[#3B82F6] rounded-full">
                  {activeBookingsCount}
                </span>
              )}
            </Link>
          )}

          <Link
            to="/register-helper"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold ${
              isActive('/register-helper') ? 'text-amber-800 bg-amber-50' : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <HardHat size={18} className="text-amber-600" />
            <span>Join as Helper (Technician)</span>
          </Link>

          {!user && (
            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-gray-100 text-xs font-bold text-[#0B1F3A]"
              >
                Register
              </Link>
            </div>
          )}

          <div className="pt-2">
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0B1F3A] text-white py-2.5 rounded-lg text-sm font-semibold"
            >
              <PlusCircle size={16} />
              <span>Book a Repair</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
