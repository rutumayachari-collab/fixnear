export type ServiceCategoryId = 
  | 'plumbing' 
  | 'electrical' 
  | 'ac-repair' 
  | 'appliance-repair' 
  | 'carpentry' 
  | 'home-cleaning';

export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  hindiName?: string;
  tagline: string;
  iconName: string;
  startingPrice: number;
  description: string;
  popularServices: string[];
  safetyNotice?: string;
}

export type AvailabilityStatus = 'Available Today' | 'Available Tomorrow' | 'Busy';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  tagline: string;
  category: ServiceCategoryId;
  phone: string; // 10-digit Indian number e.g. "9822012345"
  city: string; // "Pune"
  areas: string[]; // e.g. ["Kothrud", "Deccan", "Karve Nagar"]
  pincodes: string[]; // e.g. ["411038", "411004", "411052"]
  coordinates: Coordinates; // Fixed sample coordinates in Pune area
  startingPrice: number; // in INR
  rating: number; // e.g. 4.8
  reviewCount: number;
  experienceYears: number;
  availability: AvailabilityStatus;
  isActive: boolean;
  badge?: string; // e.g. "Top Rated", "Fast Response", "Specialist"
  bio: string;
  languages: string[];
  distanceKm?: number; // Calculated straight-line distance from customer
  email?: string;
  additionalCategories?: string[];
}

export type BookingStatus = 
  | 'Requested' 
  | 'Accepted' 
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled';

export interface Booking {
  id: string; // e.g. "FN-84920"
  customerName: string;
  customerPhone: string; // 10-digit Indian number
  customerAddress: string;
  pincode: string; // 6-digit Indian PIN
  area: string;
  category: ServiceCategoryId;
  providerId: string;
  providerName: string;
  problemDescription: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // e.g. "10:00 AM - 01:00 PM"
  estimatedPrice: number; // in INR
  finalPrice?: number;
  status: BookingStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  cancellationReason?: string;
  workerNotes?: string;
  notes?: string;
  customerCoordinates?: Coordinates;
}

export type AppRole = 'customer' | 'worker' | 'admin';

export interface SmartMatchResult {
  category: ServiceCategory;
  confidence: 'high' | 'medium' | 'low';
  matchedKeywords: string[];
  safetyWarning?: string;
  isDangerous?: boolean;
}

export interface DashboardStats {
  totalBookings: number;
  newRequests: number;
  activeJobs: number;
  completedJobs: number;
  cancelledJobs: number;
  totalEstimatedRevenue: number;
  activeProviders: number;
}

export interface CustomerLocationState {
  coords: Coordinates | null;
  accuracy?: number;
  isLocating: boolean;
  error: string | null;
  pincodeFallback: string | null;
  method: 'gps' | 'pincode' | 'none';
}
