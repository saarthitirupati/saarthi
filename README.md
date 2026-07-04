# Saarthi: Destination Operating System for Tirupati
## Phase 1: Foundation & Hyperlocal GTM Launch

Saarthi is a modern, responsive web application designed as the **Destination Operating System for Tirupati pilgrims**. Instead of generic travel planning, it focuses on absolute on-ground certainty: real-time wait times, elderly accessibility routing, and direct feedback loops.

---

## 🚀 Phase 1 Implementations

We have completed the core foundation and hyperlocal GTM pilot features for Phase 1:

### 1. Database Schema & Seeding (Supabase)
* Fully integrated PostgreSQL tables in Supabase with structural custom parameters (accessibility tags, difficulty rankings, peak hours, and coordinates).
* Configured real-time channels for live wait times and traffic alerts.

### 2. Value-First Product Flow (Zero-Gate Onboarding)
* Removed automatic redirects. Scanning the cab QR code lands passengers **directly** on the live Oracle Dashboard.
* Shows instant value (current weather, Tirumala crowd alerts, and live queue wait-times) within 2 seconds.
* Displays a deferred **Personalization Banner** allowing users to opt into customization (walk speeds, budget levels, and companions) when ready.

### 3. Hyperlocal GTM Attribution (Cab QR Pilot)
* Tracks URL parameters (e.g. `?ref=cab_402` or `?ref=hotel_lobby_1`) to log user acquisition sources.
* Stores referral tags persistently in browser `localStorage` to attribute subsequent sessions.
* Connects to a closed-loop **WhatsApp Feedback Card** that pre-populates template messages (e.g., *"Hi Saarthi, I scanned the QR code in cab cab_402. Here is my feedback..."*).

---

## 🛠️ Architecture & Tech Stack

* **Framework:** Next.js 16 (App Router with Turbopack)
* **Styling:** CSS Modules & Vanilla CSS
* **Database:** Supabase (PostgreSQL with Realtime WebSockets)
* **State Management:** React Context & useTripStore
* **Attribution & Logs:** Telemetry Route Handler (`/api/telemetry` & `/api/track`)

---

## 📥 Setup & Database Seeding

Follow these steps to configure your local development environment:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
```

### 3. Setup & Seed Database Tables
Run the database scripts in order to build the schemas and seed all flagship data:
```bash
# Step 1: Configure schemas and create telemetry logging tables
node scripts/setup-db-schema.mjs

# Step 2: Seed the festivals dataset
node scripts/seed-festivals.mjs

# Step 3: Seed the flagship places, stories, quizzes, and encyclopedia
node scripts/seed-flagship-data.mjs

# Step 4: Configure live wait-time and queue metrics
node scripts/setup-live-metrics.mjs
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application. If you want to simulate a cab scan, use:
`http://localhost:3000/?ref=cab_402`

---

## 📋 Common Scripts

* `npm run dev` - Start Next.js development server
* `npm run build` - Compile optimized production bundle
* `npm run type-check` - Verify TypeScript compiler safety
* `npm run verify` - Validate code health (ESLint, TypeScript, Production Build)

---

**Handbook Reference:** [Saarthi Company Handbook v2.0](file:///d:/travel/docs/saarthi_handbook.md) | **Telemetry API:** `/api/telemetry` | **Status:** Pilot Ready
