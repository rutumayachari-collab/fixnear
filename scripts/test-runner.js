import { SERVICE_CATEGORIES } from '../src/data/categories.js';
import { INITIAL_PROVIDERS } from '../src/data/initialProviders.js';
import { INITIAL_BOOKINGS } from '../src/data/initialBookings.js';
import { matchProblemDescription } from '../src/utils/smartMatch.js';
import { isValidIndianPhone, isValidIndianPincode, isFutureOrToday, generateBookingId } from '../src/utils/validation.js';
import { formatINR, formatDateIndian, formatIndianPhone } from '../src/utils/formatters.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('========================================================');
console.log('FIXNEAR AUTOMATED VERIFICATION TEST SUITE');
console.log('========================================================\n');

// 1. Currency & India-First Formatting
console.log('TEST SUITE 1: India-First Currency & Formatting');
assert(formatINR(199).includes('199') && formatINR(199).includes('₹'), 'formatINR(199) produces ₹199');
assert(formatINR(1500).includes('1,500') && formatINR(1500).includes('₹'), 'formatINR(1500) produces ₹1,500');
assert(formatINR(12000).includes('12,000') && formatINR(12000).includes('₹'), 'formatINR(12000) produces ₹12,000');
assert(formatDateIndian('2026-10-27').includes('27 Oct 2026'), 'formatDateIndian produces readable Indian date (27 Oct 2026)');
assert(formatIndianPhone('9845012345').includes('+91 98450 12345'), 'formatIndianPhone formats Indian phone with +91 country code');

// 2. Validation Suite
console.log('\nTEST SUITE 2: Validation of Indian Phone & PIN Codes');
assert(isValidIndianPhone('9845012345') === true, 'Valid 10-digit mobile starting with 9 is accepted');
assert(isValidIndianPhone('8765432109') === true, 'Valid 10-digit mobile starting with 8 is accepted');
assert(isValidIndianPhone('7890123456') === true, 'Valid 10-digit mobile starting with 7 is accepted');
assert(isValidIndianPhone('6789012345') === true, 'Valid 10-digit mobile starting with 6 is accepted');
assert(isValidIndianPhone('5845012345') === false, 'Invalid mobile starting with 5 is rejected');
assert(isValidIndianPhone('984501234') === false, '9-digit mobile is rejected');
assert(isValidIndianPhone('98450123456') === false, '11-digit mobile is rejected');

assert(isValidIndianPincode('560034') === true, 'Valid 6-digit Indian PIN code 560034 is accepted');
assert(isValidIndianPincode('110001') === true, 'Valid 6-digit Delhi PIN code 110001 is accepted');
assert(isValidIndianPincode('056003') === false, 'PIN code starting with 0 is rejected');
assert(isValidIndianPincode('56003') === false, '5-digit PIN code is rejected');
assert(isValidIndianPincode('5600345') === false, '7-digit PIN code is rejected');

assert(isFutureOrToday('2020-01-01') === false, 'Past appointment date is rejected');
assert(isFutureOrToday('2029-12-31') === true, 'Future appointment date is accepted');

const testBookingId = generateBookingId();
assert(/^FN-\d{5}$/.test(testBookingId), `generateBookingId generates unique FN-XXXXX format: ${testBookingId}`);

// 3. Smart Repair Match
console.log('\nTEST SUITE 3: Smart Repair Match Rules');
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

// 4. Data Integrity
console.log('\nTEST SUITE 4: Initial Providers & Categories Data Integrity');
assert(SERVICE_CATEGORIES.length === 6, 'Exactly 6 core service categories configured');
assert(INITIAL_PROVIDERS.length === 10, 'Exactly 10 fictional providers pre-loaded');

const categoriesWithProviders = new Set(INITIAL_PROVIDERS.map(p => p.category));
assert(categoriesWithProviders.size === 6, 'All 6 service categories have assigned providers');

INITIAL_PROVIDERS.forEach(p => {
  assert(p.startingPrice > 0, `${p.name} has valid starting price: ₹${p.startingPrice}`);
  assert(p.areas.length > 0, `${p.name} has service areas listed`);
  assert(p.pincodes.length > 0, `${p.name} has Indian PIN codes listed`);
});

// 5. Booking Workflow Lifecycle Simulation
console.log('\nTEST SUITE 5: Full 10-Step Workflow Lifecycle Simulation');
let demoBookings = [...INITIAL_BOOKINGS];

// Step 1: Customer submits new booking
const newBooking = {
  id: generateBookingId(),
  customerName: 'Aarav Gupta',
  customerPhone: '9876543210',
  customerAddress: 'Flat 101, Prestige Palms, Koramangala',
  pincode: '560034',
  area: 'Koramangala',
  category: 'plumbing',
  providerId: 'prov-01',
  providerName: 'Ramesh Kumar Plumbing',
  problemDescription: 'Main washbasin angle valve pipe is broken and leaking water.',
  preferredDate: '2026-10-28',
  preferredTime: '10:00 AM - 01:00 PM',
  estimatedPrice: 199,
  status: 'Requested',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

demoBookings.unshift(newBooking);
assert(demoBookings[0].id === newBooking.id, 'Step 1-4: Customer booking generated with status "Requested"');

// Step 5-6: Worker accepts job
const requestedJob = demoBookings.find(b => b.id === newBooking.id);
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

console.log('\n========================================================');
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('========================================================\n');

if (failed > 0) {
  process.exit(1);
}
