import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Booking, 
  ServiceProvider, 
  BookingStatus, 
  AppRole, 
  DashboardStats,
  CustomerLocationState,
  Coordinates
} from '../types';
import { INITIAL_PROVIDERS } from '../data/initialProviders';
import { INITIAL_BOOKINGS } from '../data/initialBookings';
import { 
  loadFromStorage, 
  saveToStorage, 
  clearDemoStorage, 
  STORAGE_KEYS 
} from '../utils/storage';
import { generateBookingId } from '../utils/validation';
import { calculateDistanceKm, requestBrowserLocation, DEFAULT_PUNE_COORDS } from '../utils/geo';
import { helpersAPI, bookingsAPI, adminAPI } from '../services/api';

interface FixNearContextType {
  bookings: Booking[];
  providers: ServiceProvider[];
  currentRole: AppRole;
  selectedWorkerId: string;
  customerLocation: CustomerLocationState;
  setCurrentRole: (role: AppRole) => void;
  setSelectedWorkerId: (id: string) => void;
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus, notes?: string, finalPrice?: number) => Promise<void>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  addProvider: (providerData: Omit<ServiceProvider, 'id'>) => Promise<ServiceProvider>;
  updateProvider: (provider: ServiceProvider) => Promise<void>;
  toggleProviderActive: (id: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
  getDashboardStats: () => DashboardStats;
  requestCustomerLocation: () => Promise<void>;
  clearCustomerLocation: () => void;
  setPincodeFallback: (pin: string) => void;
  fetchLatestData: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

const FixNearContext = createContext<FixNearContextType | undefined>(undefined);

export const normalizeHelper = (p: any): ServiceProvider => ({
  id: String(p.id || p._id || `prov-${Math.random()}`),
  name: String(p.name || 'Technician'),
  tagline: String(p.tagline || ''),
  category: p.category || 'plumbing',
  additionalCategories: Array.isArray(p.additionalCategories) ? p.additionalCategories : [],
  phone: String(p.phone || '9822012345'),
  email: p.email ? String(p.email) : undefined,
  city: String(p.city || 'Pune'),
  areas: Array.isArray(p.areas) && p.areas.length > 0 ? p.areas : [String(p.area || 'Pune')],
  pincodes: Array.isArray(p.pincodes) && p.pincodes.length > 0 ? p.pincodes : [String(p.pincode || '411038')],
  coordinates: p.coordinates && typeof p.coordinates.lat === 'number' ? p.coordinates : DEFAULT_PUNE_COORDS,
  startingPrice: Number(p.startingPrice) || 199,
  rating: Number(p.rating) || 5.0,
  reviewCount: Number(p.reviewCount) || 1,
  experienceYears: Number(p.experienceYears) || 3,
  availability: p.availability || 'Available Today',
  isActive: p.isActive !== false,
  badge: String(p.badge || '✨ Verified Helper'),
  bio: String(p.bio || ''),
  languages: Array.isArray(p.languages) && p.languages.length > 0 ? p.languages : ['Hindi', 'Marathi'],
});

export const normalizeBooking = (b: any): Booking => ({
  id: String(b.id || `FN-${Date.now()}`),
  providerId: String(b.providerId || b.helperId || ''),
  providerName: String(b.providerName || b.helperName || 'Technician'),
  category: b.category || 'plumbing',
  customerName: String(b.customerName || 'Customer'),
  customerPhone: String(b.customerPhone || '9881122334'),
  customerAddress: String(b.customerAddress || b.address || ''),
  area: String(b.area || 'Pune'),
  pincode: String(b.pincode || '411038'),
  problemDescription: String(b.problemDescription || ''),
  preferredDate: String(b.preferredDate || new Date().toISOString().split('T')[0]),
  preferredTime: String(b.preferredTime || 'Morning (9 AM - 12 PM)'),
  estimatedPrice: Number(b.estimatedPrice) || 199,
  finalPrice: b.finalPrice !== undefined ? Number(b.finalPrice) : undefined,
  status: b.status || 'Requested',
  createdAt: String(b.createdAt || new Date().toISOString()),
  updatedAt: String(b.updatedAt || new Date().toISOString()),
  notes: b.notes ? String(b.notes) : undefined,
});

export const FixNearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [providers, setProviders] = useState<ServiceProvider[]>(() => {
    const raw = loadFromStorage<ServiceProvider[]>(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
    return Array.isArray(raw) ? raw.map(normalizeHelper) : INITIAL_PROVIDERS.map(normalizeHelper);
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const raw = loadFromStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    return Array.isArray(raw) ? raw.map(normalizeBooking) : INITIAL_BOOKINGS.map(normalizeBooking);
  });

  const [currentRole, setCurrentRoleState] = useState<AppRole>(() => 
    loadFromStorage<AppRole>(STORAGE_KEYS.CURRENT_ROLE, 'customer')
  );

  const [selectedWorkerId, setSelectedWorkerIdState] = useState<string>(() => 
    loadFromStorage<string>(STORAGE_KEYS.SELECTED_WORKER, 'prov-01')
  );

  // Customer Location State
  const [customerLocation, setCustomerLocation] = useState<CustomerLocationState>({
    coords: null,
    isLocating: false,
    error: null,
    pincodeFallback: null,
    method: 'none',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Sync to local storage as fallback
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PROVIDERS, providers);
  }, [providers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  // Fetch from backend API
  const fetchLatestData = useCallback(async () => {
    try {
      const [helpersRes, bookingsRes] = await Promise.all([
        helpersAPI.search({}).catch(() => null),
        bookingsAPI.getAll({}).catch(() => null),
      ]);

      if (helpersRes?.success && Array.isArray(helpersRes.helpers)) {
        setProviders(helpersRes.helpers.map(normalizeHelper));
      }

      if (bookingsRes?.success && Array.isArray(bookingsRes.bookings)) {
        setBookings(bookingsRes.bookings.map(normalizeBooking));
      }
    } catch {
      // Backend silent fallback to localStorage
    }
  }, []);

  // Initial fetch and 4-second polling for real-time synchronization between sessions
  useEffect(() => {
    fetchLatestData();
    const interval = setInterval(fetchLatestData, 4000);
    return () => clearInterval(interval);
  }, [fetchLatestData]);

  const setCurrentRole = useCallback((role: AppRole) => {
    setCurrentRoleState(role);
    saveToStorage(STORAGE_KEYS.CURRENT_ROLE, role);
  }, []);

  const setSelectedWorkerId = useCallback((id: string) => {
    setSelectedWorkerIdState(id);
    saveToStorage(STORAGE_KEYS.SELECTED_WORKER, id);
  }, []);

  // Request location with Browser Geolocation API
  const requestCustomerLocation = useCallback(async () => {
    setCustomerLocation(prev => ({ ...prev, isLocating: true, error: null }));
    try {
      const result = await requestBrowserLocation();
      setCustomerLocation({
        coords: result.coords,
        accuracy: result.accuracy,
        isLocating: false,
        error: null,
        pincodeFallback: null,
        method: 'gps',
      });
      showToast('GPS location detected! Showing nearest technicians in Pune.');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Location detection failed';
      setCustomerLocation(prev => ({
        ...prev,
        isLocating: false,
        error: errMsg,
        method: prev.pincodeFallback ? 'pincode' : 'none',
      }));
      showToast(errMsg);
    }
  }, [showToast]);

  const clearCustomerLocation = useCallback(() => {
    setCustomerLocation({
      coords: null,
      isLocating: false,
      error: null,
      pincodeFallback: null,
      method: 'none',
    });
    showToast('Location filter cleared.');
  }, [showToast]);

  const setPincodeFallback = useCallback((pin: string) => {
    setCustomerLocation(prev => ({
      ...prev,
      pincodeFallback: pin,
      method: 'pincode',
      error: null,
    }));
  }, []);

  // Compute straight-line distances dynamically for providers if customer coordinates exist
  const providersWithDistances = useMemo(() => {
    if (!customerLocation.coords) {
      return providers.map(p => ({ ...p, distanceKm: undefined }));
    }

    return providers.map(p => {
      const distanceKm = calculateDistanceKm(customerLocation.coords!, p.coordinates || DEFAULT_PUNE_COORDS);
      return {
        ...p,
        distanceKm,
      };
    });
  }, [providers, customerLocation.coords]);

  // Create Booking with Backend Sync
  const createBooking = useCallback(async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Booking> => {
    const payload = {
      ...bookingData,
      helperId: bookingData.providerId,
      customerCoordinates: customerLocation.coords || undefined,
    };

    try {
      const res = await bookingsAPI.create(payload);
      if (res.success && res.booking) {
        const created: Booking = {
          ...res.booking,
          providerId: res.booking.helperId,
          providerName: res.booking.helperName,
        };
        setBookings(prev => [created, ...prev]);
        showToast(`Booking ${created.id} submitted! Status: Requested.`);
        return created;
      }
    } catch (err: any) {
      console.warn('Backend booking creation error, falling back locally:', err);
    }

    // Local fallback
    const now = new Date().toISOString();
    const newBooking: Booking = {
      ...bookingData,
      id: generateBookingId(),
      status: 'Requested',
      createdAt: now,
      updatedAt: now,
      customerCoordinates: customerLocation.coords || undefined,
    };

    setBookings(prev => [newBooking, ...prev]);
    showToast(`Booking ${newBooking.id} submitted! Status: Requested.`);
    return newBooking;
  }, [showToast, customerLocation.coords]);

  // Update Booking Status with Backend Sync
  const updateBookingStatus = useCallback(async (bookingId: string, status: BookingStatus, notes?: string, finalPrice?: number) => {
    try {
      await bookingsAPI.updateStatus(bookingId, status, notes, finalPrice);
    } catch (err: any) {
      console.warn('Backend status update error, falling back locally:', err);
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status,
          updatedAt: new Date().toISOString(),
          workerNotes: notes !== undefined ? notes : b.workerNotes,
        };
      }
      return b;
    }));
    showToast(`Booking ${bookingId} updated to "${status}".`);
  }, [showToast]);

  // Cancel Booking
  const cancelBooking = useCallback(async (bookingId: string, reason?: string) => {
    try {
      await bookingsAPI.updateStatus(bookingId, 'Cancelled', undefined, undefined, reason);
    } catch (err) {
      console.warn('Backend cancel error, falling back locally:', err);
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Cancelled',
          cancellationReason: reason || 'Cancelled by customer',
          updatedAt: new Date().toISOString(),
        };
      }
      return b;
    }));
    showToast(`Booking ${bookingId} has been cancelled.`);
  }, [showToast]);

  // Add Provider with Backend Sync
  const addProvider = useCallback(async (providerData: Omit<ServiceProvider, 'id'>): Promise<ServiceProvider> => {
    const newId = `prov-${Date.now().toString().slice(-4)}`;
    const newProvider: ServiceProvider = {
      ...providerData,
      id: newId,
      coordinates: providerData.coordinates || DEFAULT_PUNE_COORDS,
    };
    setProviders(prev => [newProvider, ...prev]);
    showToast(`Service provider "${newProvider.name}" added successfully.`);
    return newProvider;
  }, [showToast]);

  const updateProvider = useCallback(async (updated: ServiceProvider) => {
    try {
      await helpersAPI.updateProfile(updated.id, updated);
    } catch {
      // fallback
    }
    setProviders(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(`Provider "${updated.name}" updated.`);
  }, [showToast]);

  const toggleProviderActive = useCallback(async (id: string) => {
    try {
      const res = await adminAPI.toggleHelperActive(id);
      if (res.success && res.helper) {
        setProviders(prev => prev.map(p => p.id === id ? { ...p, isActive: res.helper.isActive } : p));
        showToast(`Provider status toggled.`);
        return;
      }
    } catch {
      // fallback
    }

    setProviders(prev => prev.map(p => {
      if (p.id === id) {
        const nextState = !p.isActive;
        showToast(`Provider "${p.name}" is now ${nextState ? 'Active' : 'Deactivated'}.`);
        return { ...p, isActive: nextState };
      }
      return p;
    }));
  }, [showToast]);

  const resetDemoData = useCallback(async () => {
    try {
      await adminAPI.resetDemo();
    } catch {
      // fallback
    }
    clearDemoStorage();
    setProviders(INITIAL_PROVIDERS);
    setBookings(INITIAL_BOOKINGS);
    setCurrentRoleState('customer');
    setSelectedWorkerIdState('prov-01');
    setCustomerLocation({
      coords: null,
      isLocating: false,
      error: null,
      pincodeFallback: null,
      method: 'none',
    });
    showToast('Demonstration database has been reset to defaults.');
  }, [showToast]);

  const getDashboardStats = useCallback((): DashboardStats => {
    const totalBookings = bookings.length;
    const newRequests = bookings.filter(b => b.status === 'Requested').length;
    const activeJobs = bookings.filter(b => b.status === 'Accepted' || b.status === 'In Progress').length;
    const completedJobs = bookings.filter(b => b.status === 'Completed').length;
    const cancelledJobs = bookings.filter(b => b.status === 'Cancelled').length;
    const totalEstimatedRevenue = bookings
      .filter(b => b.status === 'Completed')
      .reduce((acc, curr) => acc + (curr.estimatedPrice || 0), 0);
    const activeProviders = providers.filter(p => p.isActive).length;

    return {
      totalBookings,
      newRequests,
      activeJobs,
      completedJobs,
      cancelledJobs,
      totalEstimatedRevenue,
      activeProviders,
    };
  }, [bookings, providers]);

  const value = useMemo(() => ({
    bookings,
    providers: providersWithDistances,
    currentRole,
    selectedWorkerId,
    customerLocation,
    setCurrentRole,
    setSelectedWorkerId,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    addProvider,
    updateProvider,
    toggleProviderActive,
    resetDemoData,
    getDashboardStats,
    requestCustomerLocation,
    clearCustomerLocation,
    setPincodeFallback,
    fetchLatestData,
    toastMessage,
    showToast,
    hideToast,
  }), [
    bookings,
    providersWithDistances,
    currentRole,
    selectedWorkerId,
    customerLocation,
    setCurrentRole,
    setSelectedWorkerId,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    addProvider,
    updateProvider,
    toggleProviderActive,
    resetDemoData,
    getDashboardStats,
    requestCustomerLocation,
    clearCustomerLocation,
    setPincodeFallback,
    fetchLatestData,
    toastMessage,
    showToast,
    hideToast,
  ]);

  return (
    <FixNearContext.Provider value={value}>
      {children}
    </FixNearContext.Provider>
  );
};

export const useFixNear = (): FixNearContextType => {
  const context = useContext(FixNearContext);
  if (!context) {
    throw new Error('useFixNear must be used within a FixNearProvider');
  }
  return context;
};
