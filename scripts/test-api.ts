// Full-Stack End-to-End API Test verifying Section 8 Scenario
const API_URL = 'http://localhost:5001/api';

async function run() {
  console.log('========================================================');
  console.log('FIXNEAR FULL-STACK E2E BACKEND VERIFICATION TEST');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Health check
  const healthRes = await fetch(`${API_URL}/health`);
  const health = await healthRes.json();
  assert(health.status === 'healthy', 'Backend health check returns status: healthy');

  // 2. Register Helper: Demo Plumber, Plumbing, PIN 411038, starting charge ₹199
  const testPhoneHelper = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
  const helperRes = await fetch(`${API_URL}/auth/register-helper`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Demo Plumber',
      category: 'plumbing',
      pincode: '411038',
      area: 'Kothrud, Pune',
      phone: testPhoneHelper,
      password: 'testPassword123',
      confirmPassword: 'testPassword123',
      startingPrice: 199,
      experienceYears: 5,
      availability: 'Available Today',
    }),
  });
  const helperData = await helperRes.json();
  assert(helperData.success === true, 'Step 1: Helper "Demo Plumber" registered and saved to database');
  const registeredHelperId = helperData.helper?.id;
  assert(!!registeredHelperId, `Helper ID assigned: ${registeredHelperId}`);

  // 3. Register Customer: Demo Customer, PIN 411038
  const testPhoneCust = `97${Math.floor(10000000 + Math.random() * 90000000)}`;
  const custRes = await fetch(`${API_URL}/auth/register-customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Demo Customer',
      phone: testPhoneCust,
      pincode: '411038',
      address: 'Flat 101, Anand Nagar, Kothrud',
      password: 'testPassword123',
      confirmPassword: 'testPassword123',
    }),
  });
  const custData = await custRes.json();
  assert(custData.success === true, 'Step 2: Customer "Demo Customer" registered and saved to database');

  // 4. Search for Plumbing in PIN 411038
  const searchRes = await fetch(`${API_URL}/helpers?category=plumbing&pincode=411038`);
  const searchData = await searchRes.json();
  assert(searchData.success === true && searchData.count > 0, `Step 3: Search for category=plumbing&pincode=411038 returned ${searchData.count} helpers`);
  
  const foundHelper = searchData.helpers.find((h: any) => h.id === registeredHelperId);
  assert(!!foundHelper, 'Step 3: Registered "Demo Plumber" found in real backend query results');
  assert(foundHelper?.startingPrice === 199, 'Starting visit charge displays as ₹199');

  // 5. Customer books Demo Plumber
  const bookRes = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      helperId: registeredHelperId,
      customerName: 'Demo Customer',
      customerPhone: testPhoneCust,
      customerAddress: 'Flat 101, Anand Nagar, Kothrud',
      customerPincode: '411038',
      serviceCategory: 'plumbing',
      problemDescription: 'Kitchen washbasin tap is broken and leaking water',
      preferredDate: '2026-10-28',
      preferredTime: '10:00 AM - 01:00 PM',
      estimatedPrice: 199,
    }),
  });
  const bookData = await bookRes.json();
  assert(bookData.success === true, 'Step 4: Booking created successfully in database');
  const bookingId = bookData.booking?.id;
  assert(bookData.booking?.status === 'Requested', `Booking status is "Requested" with ID: ${bookingId}`);

  // 6. Helper accepts the booking
  const acceptRes = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'Accepted',
      notes: 'I will arrive at 10:30 AM with replacement washers.',
    }),
  });
  const acceptData = await acceptRes.json();
  assert(acceptData.success === true && acceptData.booking?.status === 'Accepted', 'Step 5: Helper accepted job, status changed to "Accepted"');

  // 7. Helper completes the booking
  const completeRes = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'Completed',
      notes: 'Washbasin tap valve repaired successfully.',
      finalPrice: 199,
    }),
  });
  const completeData = await completeRes.json();
  assert(completeData.success === true && completeData.booking?.status === 'Completed', 'Step 6: Helper completed job, status changed to "Completed"');

  // 8. Admin stats verification
  const adminRes = await fetch(`${API_URL}/admin/stats`);
  const adminData = await adminRes.json();
  assert(adminData.success === true, 'Step 7: Admin stats fetched from database');
  assert(adminData.stats.completedJobs > 0, `Admin stats shows completed jobs: ${adminData.stats.completedJobs}`);
  assert(adminData.stats.totalEstimatedRevenue >= 199, `Admin stats calculated dynamic revenue in ₹: ₹${adminData.stats.totalEstimatedRevenue}`);

  console.log('\n========================================================');
  console.log(`FULL-STACK E2E RESULT: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
