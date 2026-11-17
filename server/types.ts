export type UserRole = 'customer' | 'helper' | 'admin';

export interface DBUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  passwordHash: string;
  role: UserRole;
  pincode: string;
  address: string;
  language?: string;
  createdAt: string;
}

export type ServiceCategoryId = 
  | 'plumbing' 
  | 'electrical' 
  | 'ac-repair' 
  | 'appliance-repair' 
  | 'carpentry' 
  | 'home-cleaning'
  | 'other';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DBHelper {
  id: string;
  userId: string;
  name: string;
  tagline: string;
  category: ServiceCategoryId;
  additionalCategories?: ServiceCategoryId[];
  phone: string;
  email?: string;
  city: string;
  areas: string[];
  pincodes: string[];
  coordinates: Coordinates;
  startingPrice: number;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  availability: 'Available Today' | 'Available Tomorrow' | 'Busy';
  isActive: boolean;
  badge?: string;
  bio: string;
  languages: string[];
  createdAt: string;
}

export type BookingStatus = 
  | 'Requested' 
  | 'Accepted' 
  | 'Rejected' 
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled';

export interface DBBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerPincode: string;
  customerCoordinates?: Coordinates;
  helperId: string;
  helperName: string;
  serviceCategory: ServiceCategoryId;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  estimatedPrice: number;
  finalPrice?: number;
  status: BookingStatus;
  workerNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthJWTPayload {
  userId: string;
  role: UserRole;
  name: string;
  phone: string;
  helperId?: string;
}
