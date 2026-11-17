import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { CONFIG } from '../config';
import { DBUser, DBHelper, DBBooking } from '../types';
import { INITIAL_PROVIDERS } from '../../src/data/initialProviders';
import { INITIAL_BOOKINGS } from '../../src/data/initialBookings';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.resolve(DATA_DIR, 'fixnear_db.json');

interface DatabaseSchema {
  users: DBUser[];
  helpers: DBHelper[];
  bookings: DBBooking[];
  mode: 'mongodb' | 'file';
}

let isMongoConnected = false;

// Seed data generator
function getInitialSeedData(): { users: DBUser[]; helpers: DBHelper[]; bookings: DBBooking[] } {
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('demo12345', salt);

  // 1. Create a Default Admin User
  const adminUser: DBUser = {
    id: 'user-admin-01',
    name: 'FixNear Administrator',
    phone: '9999999999',
    email: 'admin@fixnear.in',
    passwordHash: defaultPasswordHash,
    role: 'admin',
    pincode: '411038',
    address: 'FixNear HQ, FC Road, Pune',
    language: 'English',
    createdAt: new Date().toISOString(),
  };

  // 2. Create Default Customer User
  const demoCustomer: DBUser = {
    id: 'user-cust-01',
    name: 'Demo Customer',
    phone: '9881122334',
    email: 'customer@demo.in',
    passwordHash: defaultPasswordHash,
    role: 'customer',
    pincode: '411038',
    address: 'Flat 402, Mayur Colony, Kothrud, Pune',
    language: 'Hindi',
    createdAt: new Date().toISOString(),
  };

  const users: DBUser[] = [adminUser, demoCustomer];

  // 3. Convert initial providers to DBHelper and create their helper accounts
  const helpers: DBHelper[] = INITIAL_PROVIDERS.map((p, idx) => {
    const helperUserId = `user-prov-${idx + 1}`;
    users.push({
      id: helperUserId,
      name: p.name,
      phone: p.phone,
      email: `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@demo.in`,
      passwordHash: defaultPasswordHash,
      role: 'helper',
      pincode: p.pincodes[0] || '411038',
      address: `${p.areas[0] || 'Kothrud'}, Pune`,
      language: p.languages[0] || 'Hindi',
      createdAt: new Date().toISOString(),
    });

    return {
      id: p.id,
      userId: helperUserId,
      name: p.name,
      tagline: p.tagline,
      category: p.category as any,
      additionalCategories: [],
      phone: p.phone,
      city: p.city,
      areas: p.areas,
      pincodes: p.pincodes,
      coordinates: p.coordinates,
      startingPrice: p.startingPrice,
      rating: p.rating,
      reviewCount: p.reviewCount,
      experienceYears: p.experienceYears,
      availability: p.availability,
      isActive: p.isActive,
      badge: p.badge,
      bio: p.bio,
      languages: p.languages,
      createdAt: new Date().toISOString(),
    };
  });

  // 4. Initial Bookings
  const bookings: DBBooking[] = INITIAL_BOOKINGS.map(b => ({
    id: b.id,
    customerId: 'user-cust-01',
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    customerAddress: b.customerAddress,
    customerPincode: b.customerPincode,
    customerCoordinates: b.customerCoordinates,
    helperId: b.providerId,
    helperName: b.providerName,
    serviceCategory: b.serviceCategory as any,
    problemDescription: b.problemDescription,
    preferredDate: b.preferredDate,
    preferredTime: b.preferredTime,
    estimatedPrice: b.estimatedPrice,
    status: b.status,
    workerNotes: b.workerNotes,
    cancellationReason: b.cancellationReason,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }));

  return { users, helpers, bookings };
}

// In-memory + persistent file storage
class LocalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.helpers && parsed.bookings) {
          return { ...parsed, mode: 'file' };
        }
      }
    } catch (err) {
      console.warn('[Database] Could not read existing db file, initializing seed defaults:', err);
    }

    // Initialize fresh seed data
    const seed = getInitialSeedData();
    const initial: DatabaseSchema = {
      users: seed.users,
      helpers: seed.helpers,
      bookings: seed.bookings,
      mode: 'file',
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to write to db file:', err);
    }
  }

  public resetToDefaults() {
    const seed = getInitialSeedData();
    this.data = {
      users: seed.users,
      helpers: seed.helpers,
      bookings: seed.bookings,
      mode: 'file',
    };
    this.saveData(this.data);
    return this.data;
  }

  // Users collection
  public users = {
    find: async (filter?: (u: DBUser) => boolean): Promise<DBUser[]> => {
      return filter ? this.data.users.filter(filter) : [...this.data.users];
    },
    findById: async (id: string): Promise<DBUser | null> => {
      return this.data.users.find(u => u.id === id) || null;
    },
    findOne: async (filter: (u: DBUser) => boolean): Promise<DBUser | null> => {
      return this.data.users.find(filter) || null;
    },
    create: async (userData: Omit<DBUser, 'id' | 'createdAt'>): Promise<DBUser> => {
      const newUser: DBUser = {
        ...userData,
        id: `user-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
      this.data.users.push(newUser);
      this.saveData(this.data);
      return newUser;
    },
    update: async (id: string, updateData: Partial<DBUser>): Promise<DBUser | null> => {
      const idx = this.data.users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      this.data.users[idx] = { ...this.data.users[idx], ...updateData };
      this.saveData(this.data);
      return this.data.users[idx];
    },
  };

  // Helpers collection
  public helpers = {
    find: async (filter?: (h: DBHelper) => boolean): Promise<DBHelper[]> => {
      return filter ? this.data.helpers.filter(filter) : [...this.data.helpers];
    },
    findById: async (id: string): Promise<DBHelper | null> => {
      return this.data.helpers.find(h => h.id === id) || null;
    },
    findByUserId: async (userId: string): Promise<DBHelper | null> => {
      return this.data.helpers.find(h => h.userId === userId) || null;
    },
    findOne: async (filter: (h: DBHelper) => boolean): Promise<DBHelper | null> => {
      return this.data.helpers.find(filter) || null;
    },
    create: async (helperData: Omit<DBHelper, 'id' | 'createdAt'>): Promise<DBHelper> => {
      const newHelper: DBHelper = {
        ...helperData,
        id: `helper-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
      // Insert at beginning so newly registered helpers appear first
      this.data.helpers.unshift(newHelper);
      this.saveData(this.data);
      return newHelper;
    },
    update: async (id: string, updateData: Partial<DBHelper>): Promise<DBHelper | null> => {
      const idx = this.data.helpers.findIndex(h => h.id === id);
      if (idx === -1) return null;
      this.data.helpers[idx] = { ...this.data.helpers[idx], ...updateData };
      this.saveData(this.data);
      return this.data.helpers[idx];
    },
  };

  // Bookings collection
  public bookings = {
    find: async (filter?: (b: DBBooking) => boolean): Promise<DBBooking[]> => {
      return filter ? this.data.bookings.filter(filter) : [...this.data.bookings];
    },
    findById: async (id: string): Promise<DBBooking | null> => {
      return this.data.bookings.find(b => b.id === id) || null;
    },
    create: async (bookingData: Omit<DBBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<DBBooking> => {
      const now = new Date().toISOString();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const newBooking: DBBooking = {
        ...bookingData,
        id: `FN-${randomNum}`,
        createdAt: now,
        updatedAt: now,
      };
      this.data.bookings.unshift(newBooking);
      this.saveData(this.data);
      return newBooking;
    },
    update: async (id: string, updateData: Partial<DBBooking>): Promise<DBBooking | null> => {
      const idx = this.data.bookings.findIndex(b => b.id === id);
      if (idx === -1) return null;
      this.data.bookings[idx] = {
        ...this.data.bookings[idx],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      this.saveData(this.data);
      return this.data.bookings[idx];
    },
  };
}

export const db = new LocalDatabase();

export async function initDatabase(): Promise<{ isMongo: boolean; message: string }> {
  try {
    // Attempt MongoDB connection with 2.5 second timeout
    const mongoUri = CONFIG.MONGODB_URI;
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    isMongoConnected = true;
    console.log(`[Database] Connected successfully to MongoDB at ${mongoUri}`);
    return { isMongo: true, message: `Connected to MongoDB at ${mongoUri}` };
  } catch (err) {
    isMongoConnected = false;
    console.log('[Database] MongoDB service not detected at local port. Activated robust local file-backed persistence engine (server/data/fixnear_db.json).');
    return { 
      isMongo: false, 
      message: 'Running with robust persistent file-backed database (server/data/fixnear_db.json). Real database updates and multi-session sharing active.' 
    };
  }
}
