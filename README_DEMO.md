# FixNear — Full-Stack Local Repair & Service Finder
### Complete Full-Stack Architecture & College Innovation Project Guide

---

## 1. The Single Primary Website URL

### 🌐 Primary Public Website URL:
👉 **[https://senate-trip-rec-franchise.trycloudflare.com](https://senate-trip-rec-franchise.trycloudflare.com)**  
*(Accessible worldwide on all 4G/5G mobile phones, Jio, Airtel, Vi, and laptops. Single unified origin for the complete SPA + backend API.)*

### 💻 Local Primary Website URL (For your laptop browser):
👉 **[http://localhost:5001](http://localhost:5001)**

---

### 🗺️ Internal React Router Application Routes (Within the Same Domain)

You do **not** need separate URLs. Every page is connected internally through React Router links and buttons within the single primary website:

| Internal Route | Purpose | How to Reach from UI |
|---|---|---|
| `/` | **Homepage** | Click FixNear logo or "Home" in top navigation |
| `/register` | **Account Selection Hub** | Click "Register" in top navigation |
| `/register-helper` | **Helper Onboarding** | Click "I Am a Helper" or "Join as Helper" |
| `/register-customer` | **Customer Registration** | Click "I Need Help" on `/register` |
| `/login` | **Unified Login Screen** | Click "Log in" in top navigation |
| `/services` | **Directory & GPS Leaflet Map** | Click "Services" or "Find Technicians" |
| `/services/:id` | **Technician Profile Details** | Click "Details" / "View Full Profile" on any provider card |
| `/book-service/:id` | **Instant Booking Modal** | Click "Book Service" on any technician |
| `/my-bookings` | **Customer Booking Tracking** | Click "My Bookings" in top navigation |
| `/worker` | **Helper Dashboard ("Namaste! 🙏")** | Click "I'm a Helper" in banner or "Helper Portal" in nav |
| `/worker/profile` | **Helper Trade & Area Profile** | Click "Profile" tab inside Worker Portal |
| `/admin` | **Admin Dashboard & KPIs** | Click "Admin Mode" in banner or "Admin Panel" in nav |
| `/api/*` | **Unified REST API** | Handled internally on the same origin (no cross-origin issues) |

---

## 2. Technology Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Lucide Icons, Leaflet & React Leaflet.
- **Backend**: Node.js, Express.js 5, TypeScript (run via `tsx`), REST API endpoints.
- **Security & Auth**: Password hashing with `bcryptjs`, JWT token cookies, server-side data validation.
- **Database Engine**: Persistent database with multi-session sharing (`server/data/fixnear_db.json` with Mongoose MongoDB auto-detect adapter).
- **Network Proxy**: Vite reverse proxy forwards all `/api/*` calls from the browser to the backend on port 5001.

---

## 3. Step-by-Step Critical Demonstration Workflow (Section 8)

Follow these steps to demonstrate the full-stack system in front of your professor:

### Step 1: Register a Helper ("Demo Plumber")
1. Open **[https://senate-trip-rec-franchise.trycloudflare.com/register-helper](https://senate-trip-rec-franchise.trycloudflare.com/register-helper)**.
2. Select **Plumbing**.
3. Full Name: `Demo Plumber`.
4. Mobile: `9822998877` (or any valid 10-digit number).
5. Password: `password123`.
6. Real PIN Code: `411038`.
7. Starting Visit Charge: `₹199`.
8. Click **"Complete Registration & Go Live"**.
   - *Result*: The helper record is saved in the shared backend database and logged in.

### Step 2: Register a Customer ("Demo Customer")
1. Open in another tab or log out, then open:  
   **[https://senate-trip-rec-franchise.trycloudflare.com/register-customer](https://senate-trip-rec-franchise.trycloudflare.com/register-customer)**.
2. Full Name: `Demo Customer`.
3. Mobile: `9822112233`.
4. PIN Code: `411038`.
5. Password: `password123`.
6. Click **"Complete Customer Registration"**.
   - *Result*: Saved in backend database as Customer.

### Step 3: Real Helper Search by Category & PIN Code
1. Open **[https://senate-trip-rec-franchise.trycloudflare.com/services](https://senate-trip-rec-franchise.trycloudflare.com/services)**.
2. Select category **Plumbing** and enter PIN Code **`411038`**.
3. Click **Find Technicians**.
   - *Result*: Real database query returns **"Demo Plumber"** at starting charge **₹199** with **✨ Verified Helper** badge!

### Step 4: Book the Helper
1. Click **"Book Service"** on Demo Plumber's card.
2. Problem: `Kitchen tap is broken and leaking water`.
3. Pick appointment date and click **"Confirm & Request Booking"**.
   - *Result*: Backend validates request, generates unique ID (`FN-XXXXX`), and saves status as `Requested`.

### Step 5: Helper Accepts Job
1. Open the Helper Portal: **[https://senate-trip-rec-franchise.trycloudflare.com/worker](https://senate-trip-rec-franchise.trycloudflare.com/worker)**.
2. Under **New Requests**, observe the incoming job.
3. Show the **"Call Customer"** (`tel:`) direct link.
4. Click **"Accept Job"**.
   - *Result*: Status transitions to `Accepted` in backend.

### Step 6: Mark Completed & Admin Dashboard
1. Under **Accepted Jobs**, click **"Mark Completed"**.
2. Open **[https://senate-trip-rec-franchise.trycloudflare.com/admin](https://senate-trip-rec-franchise.trycloudflare.com/admin)**.
3. View dynamically updated KPIs: Total Bookings, Completed Jobs, and Completed Revenue in ₹!

---

## 4. CLI Commands

```bash
# Start backend server
npm run server

# Start frontend dev server
npm run dev

# Run automated tests (97 unit/integration tests + 14 E2E API tests)
npm test
npx tsx scripts/test-api.ts

# Production build
npm run build
```
