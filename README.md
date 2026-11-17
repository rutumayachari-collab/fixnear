# FixNear — Local Repair & Service Finder
> **College Innovation Project** — Practical, India-first local home repair and service booking platform.

FixNear connects Indian households with trusted local repair technicians (plumbers, electricians, AC technicians, carpenters, and appliance mechanics) at transparent starting prices in Indian Rupees (₹), with zero hidden platform markups.

---

## 🚀 Quick Start Guide

### 1. Installation
Install the project dependencies:
```bash
npm install
```

### 2. Run Development Server
Start the local Vite development server:
```bash
npm run dev
```

### 3. Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

### 4. Run Automated Tests
Execute the 66-check verification test suite:
```bash
npm test
```

### 5. Production Build
Verify TypeScript compilation and generate the optimized production bundle:
```bash
npm run build
```

---

## 🎯 College Presentation Demonstration Sequence

Follow this step-by-step walkthrough to present the problem and solution to judges or faculty:

| Step | Mode | Action | What to Highlight to Judges |
|------|------|--------|-----------------------------|
| **1** | **Customer** | Open `http://localhost:5173` | Professional SaaS design system (Navy `#0B1F3A`, warm neutral background `#F8F8F5`), India-first INR pricing (`₹199`, `₹499`), and the 3-Step "How It Works" guide. |
| **2** | **Customer** | Test **Smart Repair Match** on Home page | Type: `"My electrical switch is sparking"`. The rule-based keyword engine detects **Electrical Repair**, quotes ₹199 starting price, and triggers a **critical electrical safety alert** advising users to turn off the main MCB breaker. |
| **3** | **Customer** | Go to **Find Services** (`/services`) | Filter by Category (e.g. *Plumbing*) and enter PIN Code `560034` (Koramangala). Notice instant filtering, sort by price (₹) or rating, and starting visit charges. |
| **4** | **Customer** | Click **Book Service** on *Ramesh Kumar Plumbing* | Fill in customer details: Indian 10-digit phone (`9845012345`), 6-digit PIN (`560034`), address, and preferred date/time. Click **Confirm Demo Booking**. |
| **5** | **Customer** | Note generated Booking ID | A unique ID like `FN-84920` is generated with initial status `Requested`. Click **View in My Bookings**. |
| **6** | **Worker** | Click **Worker** tab on top banner | Notice the mobile-first worker layout greeting: *"Namaste! Here are your service requests."* The job just booked appears under **New Requests** with large, touch-friendly buttons. |
| **7** | **Worker** | Click **Accept Job** | The booking moves from *New Requests* to *Accepted Jobs*. The top counter updates reactively. |
| **8** | **Worker** | Click **Call Customer** & **Mark as Completed** | Demonstrates the direct `tel:` link. When marking completed, a confirmation modal lets the worker add completion notes (e.g., *"Replaced washer and fixed pipe leak"*). Status updates to `Completed`. |
| **9** | **Customer** | Click **Customer** tab -> **My Bookings** | The customer's booking now shows a green `Completed` badge with technician work notes, without refreshing the browser! |
| **10** | **Admin** | Click **Admin** tab | View the Administrator Dashboard: Total Bookings, New Requests, Active Jobs, Completed Count, and dynamically calculated revenue in ₹. Edit provider details or toggle active status. |
| **11** | **Reset** | Click **Reset Demo** in top banner | Confirm reset to restore default demonstration state for the next audience or presentation run. |

---

## 🏗️ Project Architecture & Folder Structure

```
fixnear/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── DemoRoleBanner.tsx   # Persistent role switcher & reset modal
│   │   │   ├── Navbar.tsx           # Customer top navigation & active booking badge
│   │   │   ├── Footer.tsx           # Disclaimers, pricing notes, and links
│   │   │   ├── StatusBadge.tsx      # Consistent status badges (Requested, Accepted, etc.)
│   │   │   ├── RatingStars.tsx      # Star ratings marked as "(Demo)"
│   │   │   ├── CategoryIcon.tsx     # Standardized trade icon mapper
│   │   │   ├── Modal.tsx            # Accessible modal dialog
│   │   │   └── Toast.tsx            # Global notification toasts
│   │   ├── home/
│   │   │   ├── HeroSearch.tsx       # Hero headline & PIN search form
│   │   │   ├── SmartMatchWidget.tsx # Rule-based keyword trade matcher
│   │   │   ├── CategoryGrid.tsx     # 6 core trade cards with INR starting rates
│   │   │   ├── FeaturedProviders.tsx# Top technician cards with 1-click booking
│   │   │   └── HowItWorks.tsx       # 3-step customer guide
│   │   ├── services/
│   │   │   ├── ProviderCard.tsx     # Technician card with details & booking action
│   │   │   └── ServiceFilters.tsx   # Search, category, PIN code, and sort controls
│   │   ├── bookings/
│   │   │   ├── BookingFormModal.tsx # Booking form with Indian mobile & PIN validation
│   │   │   └── BookingDetailModal.tsx# Booking detail sheet with cancel action
│   │   ├── worker/
│   │   │   ├── WorkerDashboard.tsx  # Mobile-first "Namaste!" 4-tab interface
│   │   │   ├── WorkerJobCard.tsx    # Accept, Call Customer (tel:), and Complete actions
│   │   │   └── WorkerProfile.tsx    # Basic profile & availability status toggle
│   │   └── admin/
│   │       ├── AdminStats.tsx       # Real-time calculated dashboard metric cards
│   │       ├── AdminBookingsTable.tsx# Booking management & status update table
│   │       ├── AdminProvidersTable.tsx# Provider directory & active/deactivate toggle
│   │       └── ProviderFormModal.tsx# Add / edit technician modal
│   ├── context/
│   │   └── FixNearContext.tsx       # Shared reactive state syncing to localStorage
│   ├── data/
│   │   ├── categories.ts            # 6 service categories (Plumbing, Electrical, AC, etc.)
│   │   ├── initialProviders.ts      # 10 realistic fictional Indian providers
│   │   └── initialBookings.ts       # Sample bookings with diverse status values
│   ├── pages/
│   │   ├── HomePage.tsx             # Main landing page
│   │   ├── ServicesPage.tsx         # Directory with search & filters
│   │   ├── ProviderDetailPage.tsx   # Detailed technician profile (`/services/:id`)
│   │   ├── MyBookingsPage.tsx       # Customer booking tracker
│   │   ├── WorkerPage.tsx           # Dedicated Worker Mode
│   │   ├── AdminPage.tsx            # Admin dashboard and management console
│   │   └── NotFoundPage.tsx         # 404 fallback page
│   ├── types/
│   │   └── index.ts                 # Full TypeScript interfaces & types
│   ├── utils/
│   │   ├── formatters.ts            # Indian currency (₹), Indian dates, +91 phone
│   │   ├── validation.ts            # Indian 10-digit mobile, 6-digit PIN, future date
│   │   ├── smartMatch.ts            # Smart Repair Match engine with safety warnings
│   │   └── storage.ts               # Resilient localStorage read/write helpers
│   ├── App.tsx                      # Route declarations & conditional layout
│   ├── main.tsx                     # React root mount
│   └── index.css                    # Tailwind CSS v4 design system styles
├── scripts/
│   └── test-runner.ts               # 66-check automated verification suite
├── package.json
└── vite.config.ts
```

---

## 🇮🇳 India-First Design Highlights

1. **Currency in ₹ Everywhere**:
   All amounts formatted with Indian number groupings (e.g. `₹199`, `₹1,500`, `₹12,000`).
2. **Indian Postal PIN Codes**:
   Strict 6-digit validation (`^[1-9][0-9]{5}$`) based on Indian postal standards.
3. **Indian Mobile Validation**:
   Strict 10-digit format (`^[6-9]\d{9}$`) with standard `+91` display prefix.
4. **Indian Date Formatting**:
   Clear, unambiguous date layout (e.g., `27 Oct 2026`).
5. **Realistic Local Indian Localities**:
   Pre-loaded with familiar Bengaluru neighborhoods (Koramangala, HSR Layout, Indiranagar, BTM Layout, Whitefield, Jayanagar) and realistic service technicians.

---

## 👷 Simple Worker Mode Features

- **Touch-Friendly Mobile First Layout**: Sized for one-handed operation on low-cost smartphones.
- **Friendly Cultural Greeting**: *"Namaste! Here are your service requests."*
- **Four Clear Sections**:
  1. *New Jobs* — Incoming requests waiting for acceptance.
  2. *Accepted Jobs* — Jobs scheduled for technician visit.
  3. *Completed Jobs* — Archive of completed repairs.
  4. *My Profile* — Availability status toggle (*Available Today*, *Available Tomorrow*, *Busy*) and locality management.
- **Direct Phone Access**: `tel:` link opens the phone dialer directly without requiring third-party VOIP or messaging accounts.

---

## ⚡ Smart Repair Match Rules

- **Plumbing**: Detects keywords like *tap, leak, pipe, flush, sink, drain, water, basin, geyser*.
- **Electrical**: Detects *spark, switch, socket, wire, fuse, power, mcb, tripping, fan, light, shock*.
  - **Critical Safety Banner**: Automatically flashes an alert advising users to keep away from water/sparks and switch off the main circuit breaker.
- **AC Servicing**: Detects *ac, cooling, air conditioner, compressor, gas leak, filter, split ac*.
- **Appliance Repair**: Detects *washing machine, fridge, refrigerator, microwave, oven, tv, grinder*.
- **Carpentry**: Detects *hinge, cupboard, door, lock, wood, table, chair, wardrobe, drawer*.
- **Home Cleaning**: Detects *clean, cleaning, sofa, deep clean, dust, bathroom clean, kitchen clean*.

---

## 🔒 Limitations & Prototype Scope

- **Local Demonstration Storage**: Demo data is stored in the browser's `localStorage` and shared reactively across tabs. Multi-device live synchronization requires an external backend database.
- **Simulated Technician**: Worker acceptance and status changes are simulated locally via the demonstration role switcher.
- **Illustrative Starting Rates**: All ₹ rates are sample demonstration prices. The application clearly reminds users that final charges depend on actual diagnosis and spare parts required.
