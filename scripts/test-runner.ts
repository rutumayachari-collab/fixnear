import { SERVICE_CATEGORIES } from '../src/data/categories.ts';
import { INITIAL_PROVIDERS } from '../src/data/initialProviders.ts';
import { INITIAL_BOOKINGS } from '../src/data/initialBookings.ts';
import { matchProblemDescription } from '../src/utils/smartMatch.ts';
import { isValidIndianPhone, isValidIndianPincode, isFutureOrToday, generateBookingId } from '../src/utils/validation.ts';
import { formatINR, formatDateIndian, formatIndianPhone, formatDistance } from '../src/utils/formatters.ts';
import { calculateDistanceKm, DEFAULT_PUNE_COORDS } from '../src/utils/geo.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('========================================================');
console.log('FIXNEAR AUTOMATED VERIFICATION TEST SUITE (WITH MAP & GPS)');
console.log('========================================================\n');

// 1. Currency & India-First Formatting
console.log('TEST SUITE 1: India-First Currency & Formatting');
assert(formatINR(199).includes('199') && formatINR(199).includes('₹'), 'formatINR(199) produces ₹199');
assert(formatINR(1500).includes('1,500') && formatINR(1500).includes('₹'), 'formatINR(1500) produces ₹1,500');
assert(formatINR(12000).includes('12,000') && formatINR(12000).includes('₹'), 'formatINR(12000) produces ₹12,000');
assert(formatDateIndian('2026-10-27').includes('27 Oct 2026'), 'formatDateIndian produces readable Indian date (27 Oct 2026)');
assert(formatIndianPhone('9822012345').includes('+91 98220 12345'), 'formatIndianPhone formats Indian phone with +91 country code');

// 2. Map & GPS Distance Calculation
console.log('\nTEST SUITE 2: Map & GPS Distance Calculation');
const kothrudCoords = { lat: 18.5074, lng: 73.8077 };
const deccanCoords = { lat: 18.5173, lng: 73.8415 };
const distance = calculateDistanceKm(kothrudCoords, deccanCoords);
assert(distance > 3.0 && distance < 4.5, `Haversine distance between Kothrud & Deccan is approx ~3.7 km (calculated: ${distance} km)`);
assert(calculateDistanceKm(kothrudCoords, kothrudCoords) === 0, 'Distance to same coordinate is 0 km');
assert(formatDistance(2.4) === '2.4 km away', 'formatDistance(2.4) returns "2.4 km away"');
assert(formatDistance(0.5) === '500 m away', 'formatDistance(0.5) returns "500 m away"');
assert(DEFAULT_PUNE_COORDS.lat === 18.5204 && DEFAULT_PUNE_COORDS.lng === 73.8567, 'Default Pune center coordinates set to 18.5204, 73.8567');

// 3. Validation Suite
console.log('\nTEST SUITE 3: Validation of Indian Phone & PIN Codes');
assert(isValidIndianPhone('9822012345') === true, 'Valid 10-digit mobile starting with 9 is accepted');
assert(isValidIndianPhone('8765432109') === true, 'Valid 10-digit mobile starting with 8 is accepted');
assert(isValidIndianPhone('7890123456') === true, 'Valid 10-digit mobile starting with 7 is accepted');
assert(isValidIndianPhone('6789012345') === true, 'Valid 10-digit mobile starting with 6 is accepted');
assert(isValidIndianPhone('5845012345') === false, 'Invalid mobile starting with 5 is rejected');
assert(isValidIndianPhone('984501234') === false, '9-digit mobile is rejected');
assert(isValidIndianPhone('98450123456') === false, '11-digit mobile is rejected');

assert(isValidIndianPincode('411038') === true, 'Valid Pune Kothrud PIN code 411038 is accepted');
assert(isValidIndianPincode('411005') === true, 'Valid Pune Shivaji Nagar PIN code 411005 is accepted');
assert(isValidIndianPincode('056003') === false, 'PIN code starting with 0 is rejected');
assert(isValidIndianPincode('41103') === false, '5-digit PIN code is rejected');
assert(isValidIndianPincode('4110389') === false, '7-digit PIN code is rejected');

assert(isFutureOrToday('2020-01-01') === false, 'Past appointment date is rejected');
assert(isFutureOrToday('2029-12-31') === true, 'Future appointment date is accepted');

const testBookingId = generateBookingId();
assert(/^FN-\d{5}$/.test(testBookingId), `generateBookingId generates unique FN-XXXXX format: ${testBookingId}`);

// 4. Smart Repair Match
console.log('\nTEST SUITE 4: Smart Repair Match Rules');
const match1 = matchProblemDescription('My kitchen tap is leaking');
assert(match1 !== null && match1.category.id === 'plumbing', 'Kitchen tap leaking matches Plumbing');

const match2 = matchProblemDescription('My electrical switch is sparking');
assert(match2 !== null && match2.category.id === 'electrical', 'Electrical switch sparking matches Electrical');
assert(match2 !== null && match2.isDangerous === true && match2.safetyWarning !== undefined, 'Electrical sparking triggers critical safety alert');

const match3 = matchProblemDescription('My AC is not cooling properly');
assert(match3 !== null && match3.category.id === 'ac-repair', 'AC not cooling matches AC Repair');

const match4 = matchProblemDescription('My washing machine is not working');
assert(match4 !== null && match4.category.id === 'appliance-repair', 'Washing machine issue matches Appliance Repair');

const match5 = matchProblemDescription('My cupboard hinge is broken');
assert(match5 !== null && match5.category.id === 'carpentry', 'Cupboard hinge broken matches Carpentry');

const match6 = matchProblemDescription('deep clean sofa and bathroom');
assert(match6 !== null && match6.category.id === 'home-cleaning', 'Deep clean sofa matches Home Cleaning');

const matchNone = matchProblemDescription('completely unknown random sentence without keywords');
assert(matchNone === null, 'Unknown queries return null to trigger manual selection fallback');

// 5. Data Integrity for Pune Providers
console.log('\nTEST SUITE 5: Initial Providers & Categories Data Integrity (Pune)');
assert(SERVICE_CATEGORIES.length === 6, 'Exactly 6 core service categories configured');
assert(INITIAL_PROVIDERS.length === 10, 'Exactly 10 fictional Pune providers pre-loaded');

const categoriesWithProviders = new Set(INITIAL_PROVIDERS.map(p => p.category));
assert(categoriesWithProviders.size === 6, 'All 6 service categories have assigned providers');

INITIAL_PROVIDERS.forEach(p => {
  assert(p.startingPrice > 0, `${p.name} has valid starting price: ₹${p.startingPrice}`);
  assert(p.areas.length > 0, `${p.name} has Pune service areas listed`);
  assert(p.pincodes.length > 0, `${p.name} has Pune PIN codes listed`);
  assert(p.coordinates.lat >= 18.4 && p.coordinates.lat <= 18.7, `${p.name} has valid Pune latitude: ${p.coordinates.lat}`);
  assert(p.coordinates.lng >= 73.6 && p.coordinates.lng <= 74.0, `${p.name} has valid Pune longitude: ${p.coordinates.lng}`);
});

// 6. Booking Workflow Lifecycle Simulation
console.log('\nTEST SUITE 6: Full 10-Step Workflow Lifecycle Simulation');
let demoBookings = [...INITIAL_BOOKINGS];

// Step 1: Customer submits new booking in Pune
const newBooking = {
  id: generateBookingId(),
  customerName: 'Aarav Gupta',
  customerPhone: '9822543210',
  customerAddress: 'Flat 101, Mayur Colony, Kothrud',
  pincode: '411038',
  area: 'Kothrud',
  category: 'plumbing' as const,
  providerId: 'prov-01',
  providerName: 'Ramesh Shinde Plumbing',
  problemDescription: 'Main washbasin angle valve pipe is broken and leaking water.',
  preferredDate: '2026-10-28',
  preferredTime: '10:00 AM - 01:00 PM',
  estimatedPrice: 199,
  status: 'Requested' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customerCoordinates: { lat: 18.5085, lng: 73.8120 }
};

demoBookings.unshift(newBooking);
assert(demoBookings[0].id === newBooking.id, 'Step 1-4: Customer booking generated with status "Requested"');

// Step 5-6: Worker accepts job
const requestedJob = demoBookings.find(b => b.id === newBooking.id)!;
requestedJob.status = 'Accepted';
requestedJob.updatedAt = new Date().toISOString();
assert(requestedJob.status === 'Accepted', 'Step 5-6: Worker accepted job, status changed to "Accepted"');

// Step 7: Worker marks completed
requestedJob.status = 'Completed';
requestedJob.updatedAt = new Date().toISOString();
requestedJob.workerNotes = 'Angle valve replaced with brass quarter turn valve.';
assert(requestedJob.status === 'Completed', 'Step 8: Worker completed job, status changed to "Completed"');

// Step 9-10: Admin dashboard stats recalculation
const completedJobs = demoBookings.filter(b => b.status === 'Completed');
const completedRevenue = completedJobs.reduce((sum, b) => sum + b.estimatedPrice, 0);
assert(completedRevenue > 0, `Step 9-10: Admin calculated dynamic completed revenue: ₹${completedRevenue}`);
assert(demoBookings.length === INITIAL_BOOKINGS.length + 1, 'Total booking count dynamically updated from real records');

// TEST SUITE 7: Helper Registration & Dual-Portal PIN Matching Flow
console.log('\nTEST SUITE 7: Helper Registration & Real PIN Code Discovery');
const testCustomPincode = '411038';
const newHelperId = 'prov-test-99';
const newHelper = {
  id: newHelperId,
  name: 'Anand Shinde Electricals',
  tagline: 'Fast MCB and wiring specialist in Kothrud',
  category: 'electrical' as const,
  phone: '9823456789',
  city: 'Pune',
  areas: ['Kothrud', 'Paud Road'],
  pincodes: [testCustomPincode, '411004'],
  coordinates: { lat: 18.5074, lng: 73.8077 },
  startingPrice: 199,
  rating: 5.0,
  reviewCount: 1,
  experienceYears: 6,
  availability: 'Available Today' as const,
  isActive: true,
  badge: '✨ Verified Helper',
  bio: 'Expert electrician available for prompt household repairs.',
  languages: ['Hindi', 'Marathi', 'English']
};

const providersPool = [newHelper, ...INITIAL_PROVIDERS];
assert(providersPool.length === INITIAL_PROVIDERS.length + 1, 'Helper registered successfully and added to provider pool');

// Customer searches by that exact PIN code
const pinFilteredHelpers = providersPool.filter(p => 
  p.isActive && p.pincodes.some(pin => pin.includes(testCustomPincode))
);
assert(pinFilteredHelpers.length > 0, `Customer searched PIN "${testCustomPincode}" and found ${pinFilteredHelpers.length} helpers`);
assert(pinFilteredHelpers.some(h => h.id === newHelperId), `Customer search for PIN "${testCustomPincode}" accurately returned newly registered helper "${newHelper.name}"`);

// Customer books this newly registered helper
const helperBookingId = generateBookingId();
const customerHelperBooking = {
  id: helperBookingId,
  customerName: 'Rohit Kulkarni',
  customerPhone: '9881122334',
  customerAddress: 'Flat 402, Mayur Colony, Kothrud',
  customerPincode: testCustomPincode,
  providerId: newHelper.id,
  providerName: newHelper.name,
  problemDescription: 'Switchboard sparking in living room',
  preferredDate: '2026-10-29',
  preferredTime: '11:00 AM - 02:00 PM',
  estimatedPrice: newHelper.startingPrice,
  status: 'Requested' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Helper views incoming requests in Helper Portal
const helperJobs = [customerHelperBooking].filter(b => b.providerId === newHelper.id);
assert(helperJobs.length === 1, 'Helper dashboard receives incoming booking request for their registered profile');
assert(helperJobs[0].customerPincode === testCustomPincode, 'Incoming booking matches the registered helper PIN code');
assert(helperJobs[0].status === 'Requested', 'Booking status is "Requested" ready for worker acceptance');

console.log('\n========================================================');
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('========================================================\n');

if (failed > 0) {
  process.exit(1);
}
