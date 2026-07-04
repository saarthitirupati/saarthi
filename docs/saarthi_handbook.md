# The Saarthi Company Handbook
## The Authoritative Blueprint for the Destination Operating System
### Version: 2.0 | Status: Active | Last Updated: July 2026

---

## Volume 1: Vision & Philosophy

### 1.1 The Destination Operating System
Every destination has roads, hotels, queues, rituals, transport, weather, food, and local rules. **Saarthi connects these fragmented systems into one intelligent decision layer.**

We are not building an "AI Trip Planner" or a generic "Travel App." A travel app is a seasonal utility that users open twice a year and delete. An operating system is the default layer through which a user interacts with a physical environment. 

Saarthi is the Destination Operating System for Tirupati, turning physical chaos into absolute on-ground certainty.

### 1.2 Company Principles
* **Principle 1: Reduce Anxiety:** Every screen and feature must reduce uncertainty. If an update does not calm the traveler, it does not belong in the product.
* **Principle 2: One Tap:** Never require five taps when one will do. The best UI is the one never seen.
* **Principle 3: Offline First:** If the internet disappears on the Tirumala hill routes, Saarthi must still work.
* **Principle 4: Context Over Search:** Never ask the user to search for something Saarthi should already know based on GPS, time, and profile.
* **Principle 5: Trust Above Growth:** Never show unverified or speculative information. An incorrect queue report destroys a year of trust.
* **Principle 6: Hyperlocal Wins:** Better to dominate one destination (Tirupati) with absolute data accuracy than be average in fifty.
* **Principle 7: Respect Pilgrimage:** Optimize for the pilgrim's physical and emotional experience before optimizing for short-term revenue.

### 1.3 What Saarthi Will Never Become
To prevent future feature creep and stay hyper-focused, we establish what Saarthi will never become:
* ❌ **A Social Media Feed:** No endless scrolling, likes, or user profiles.
* ❌ **A Generic OTA:** We do not sell airline tickets or general holiday packages.
* ❌ **A Hotel Listing Directory:** We do not list hundreds of hotels; we curate only the verified few.
* ❌ **A Generic Map Application:** We do not replace Google Maps; we overlay pilgrimage-specific context.
* ❌ **A Review Spam Platform:** No unverified ratings. Reviews are only accepted from users who physically visited the coordinate.
* ❌ **A Banner Advertisement Business:** No pop-ups or third-party ads.
* ❌ **A Cashback/Coupon App:** We do not discount our way to growth.
* ❌ **A Super-App Without Focus:** We remain a context engine for high-friction destinations.

---

## Volume 2: Product & Technology

### 2.1 The Oracle Screen & Context Engine
The core user interface is the **Oracle Screen**—a single-feed contextual layout that answers the question: **"What should I do next?"**

Every recommendation is generated in real-time by the **Context Engine** evaluating the following formula:
$$\text{Decision} = f(\text{Location} \times \text{Time} \times \text{Weather} \times \text{Crowd} \times \text{Festivals} \times \text{Family Profile} \times \text{Transport} \times \text{History})$$

### 2.2 Value-First Product Flow (Zero-Gate Onboarding)
We deliver instant value to drop acquisition friction to zero. 
* **The Scan Flow:** Scanning a QR code inside a local cab lands the pilgrim **directly** on the live Oracle Screen. They immediately see the real-time Tirumala wait times, weather, and traffic alerts.
* **Deferred Personalization:** A subtle dashed banner card is displayed at the top: *"✨ Personalize Your Itinerary (Optimize walk times & accessibility) ->"*.
* Clicking this card opens the **3-Step Onboarding Quiz** to customize walk-speeds, budget ranges, and companions.

### 2.3 User Persona Psychographics
* **The Family Organizer:** Driven by responsibility. Core pain: *“I don’t want my elderly parents or young kids to walk long distances or stand in queues.”* Needs accessibility routes, low-strain places, and clean restrooms.
* **The First-Time Visitor:** Driven by confusion. Core pain: *“I have never been to Tirupati. I don’t know the rituals, dress codes, or where to deposit my phone.”* Needs reassurance, education, and step-by-step navigation.
* **The Devout Pilgrim:** Driven by ritual purity and timing. Core pain: *“I must make my Darshan slot and perform all side-temple visits before my train departs.”* Needs strict time tracking.
* **The Student Group:** Driven by budget and adventure. Core pain: *“We want to see the viewpoints and waterfalls without wasting money.”* Needs cost-splitting and trail routing.

### 2.4 The Operating Journey Lifecycle
Saarthi manages the full lifecycle of the trip:

```
[Before Trip] ➔ [Planning] ➔ [Arrival] ➔ [Transit] ➔ [Accommodation]
       │                                                      │
       ▼                                                      ▼
[Return Journey] ⮏ [Share Memories] ⮏ [Food/Dining] ⮏ [Temple/Darshan]
```

---

## Volume 3: Technical Architecture & Engineering Principles

### 3.1 The Unified Stack (Ditching Firebase)
To keep the engineering overhead low and avoid dual-SDK/Auth code debt, Saarthi relies on a single backend infrastructure stack powered by **Supabase**. We do not mix Supabase and Firebase.

```
                  [ NEXT.JS PWA FRONTEND ]
                              │
                              ▼
                  [ SUPABASE API GATEWAY ]
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    [ POSTGRESQL ]    [ REALTIME CHANNELS ]  [ EDGE FUNCTIONS ]
  (Core Data & Auth)    (Live Queue Sync)    (Payment/API Sync)
```

#### The Architecture Layers:
1. **Frontend:** React / Next.js 16 Progressive Web App (PWA).
2. **Design System:** Custom CSS Modules (AAA Contrast, Dynamic Fonts).
3. **Application Layer:** React Context hooks, local state management.
4. **Business Logic:** Deterministic constraint-satisfaction routing (`plannerEngine.ts`).
5. **API Layer:** Next.js Server Actions & Route Handlers.
6. **Services:** Razorpay integration, Google Speech-to-Text translation hooks.
7. **Database:** Supabase (PostgreSQL with Row Level Security).
8. **Storage:** Supabase Storage (for offline city vector map assets).
9. **Realtime:** Supabase Realtime Channels (broadcasting live queue/transit updates).
10. **Analytics:** Supabase-integrated telemetry tracking.
11. **Infrastructure:** Edge Caching (CDN) and Vercel serverless deployments.

### 3.2 Engineering Principles
* **Principle 1: Offline First:** All core routes, local guides, and maps must be pre-cached. If the internet drops on the hills, the app must function instantly.
* **Principle 2: Fast on Low-End Android:** The bundle size must stay under 150KB gzipped. Test all render performance on low-end budget smartphones.
* **Principle 3: One Codebase:** No separate native apps. A unified Next.js codebase built as a mobile-first PWA.
* **Principle 4: API First:** All business logic and queue predictions must run through clean, documented internal APIs.
* **Principle 5: Everything Observable:** Every sync failure, API error, payment state, and queue update must be logged and traceable.
* **Principle 6: Simple Before Smart:** Never introduce AI or ML models where simple statistical averages or deterministic rules are sufficient.

### 3.3 Engineering Ownership & Responsibilities

#### The Product Engineer (Owns UX & Client-Side Utility)
* **UI/UX:** Component creation, typography, and page transitions.
* **Offline Experience:** Pre-caching, IndexedDB integration, conflict resolution, local search, and background sync.
* **Maps & Planner:** Mapbox/OSM coordinate plotting, linear routing overlays.
* **A11y & Performance:** Screen reader compatibility, text-to-speech rendering, bundle optimizations.

#### The Platform Engineer (Owns Backend, APIs & Operations)
* **Auth & Security:** Supabase authentication, RLS database rules.
* **Database & APIs:** Database migrations, PostgreSQL query optimization, API routes.
* **Payments & Billing:** Razorpay API integration, escrow accounts, split-payment logic.
* **Admin & Integrations:** Partner hotel portals, cab dispatch interfaces, and webhook handlers.
* **CI/CD & Monitoring:** Automation pipelines, Sentry crash reporting, and Winston telemetry logging.

---

## Volume 4: Business & Growth

### 4.1 Decisions as Revenue
We monetize the actions that result from our context recommendations. The monetization list is transactional:
* **Transit:** Cab booking commission (10–12%), auto union bookings, and APSRTC package integrations.
* **Lodging:** Room commissions (8-15%) from our Preferred Partner Network.
* **Physical Services:** VIP guide assistance bookings, wheelchair rentals, luggage storage, and secure locker bookings.
* **Experiences & Dining:** In-app restaurant food pre-orders, professional temple photography packages, and prasadam delivery for home bounds.
* **Digital Goods:** ₹99 premium offline audio guides and personalized travel planning tools.
* **Finance & Safety:** Travel insurance (covering travel delays or missed darshan slots) and NRI currency exchange facilitation.

### 4.2 Unit Economics (18-Month Target)
* **Blended ARPU (per trip):** ₹1,280
* **Average Frequency:** 1.2 trips per year
* **Annual Revenue per User (ARRPU):** ₹1,536
* **3-Year Customer Lifespan:** 3.6 trips $\rightarrow$ ₹4,608 cumulative revenue
* **Gross Margin (48%):** ₹2,211 LTV (margin-based)
* **Blended CAC:** ₹130 (acquired organically through hotel lobbies and taxi dashboards)
* **Defensible LTV/CAC Ratio:** **17:1**

### 4.3 Gamification: Pilgrim XP & Real-time Rewards (Phase 2/3)
To establish an unshakeable local presence and drive viral adoption, Saarthi operates a **Pilgrim XP (Experience Points)** loyalty ecosystem. 

#### How Users Earn XP:
* **Attribution Scan:** Scanning a cab or hotel QR code (+50 XP).
* **Onboarding Setup:** Completing their 3-step travel profile (+100 XP).
* **Community Intelligence:** Submitting verified live queue wait times at temple compartments (+150 XP).
* **Cultural Milestones:** Visiting recommended side temples or checking into historical landmarks (+75 XP).

#### Real-time Redemption Loop:
Users can redeem their accumulated XP instantly at local physical partner venues (e.g., exchanging 200 XP for a free hot tea/coffee or snack at an authorized local stall).

#### Dual Strategic Advantages:
1. **Free / Organic Marketing Loop:** Local tea stalls display physical Saarthi standees: *"Get Free Hot Tea/Filter Coffee via Saarthi App. Scan QR to Redeem."* This drives passengers to scan, install the PWA, complete onboarding, and query live wait times, acquiring users at near-zero marketing cost.
2. **Hyperlocal Business Partnerships:** Small local merchants receive increased foot traffic, brand visibility, and a monthly rebate payout from Saarthi for every voucher redeemed. This builds deep merchant loyalty, creating an on-ground distribution network that competitors cannot replicate online.

---

## Volume 5: Operations & Partnerships

### 5.1 Preferred Partner Network (Replacing Exclusivity)
We do not demand exclusivity from hotels and transport networks. Instead, we run a **Preferred Partner Network**:
* **The Standard:** Hotels must maintain a 4.5-star rating on guest-verified parameters (hot water availability at 4 AM, vegetarian dining, proximity to transit points).
* **The Value:** In exchange for listing priority on Saarthi’s home screen, hotels offer our users exclusive benefits (e.g., free early check-in or complimentary temple shuttle).
* **Cab Unions:** We partner with the main Tirupati cab association, standardizing fixed-rate pricing for all local loops and using seatback QR attribution codes for rider lead generation.

### 5.2 Community Intelligence Program (Replacing Scraping)
To solve the cold-start crowd prediction problem without legal or technical scraping issues, we operate the **Community Intelligence Program**:
* **Volunteers & Guides:** We onboard 20 local guides and shopkeepers around the temple gates. They use a simple 1-button admin tool to log live queue sizes.
* **Operators & Partners:** Preferred hotels and taxi drivers report transit times and terminal queues.
* **User crowdsourcing:** Passengers submit live wait times in exchange for Pilgrim XP.
* **Public Data Integrity:** Our engine cleans, aggregates, and validates these reports before pushing them to the user.

---

## Volume 6: Engineering Roadmap & Scaling

### 6.1 Architecture Roadmap

```
MONTH 1: Foundation (COMPLETE)
├─ Configure Supabase Auth & PostgreSQL schemas
├─ Set up CI/CD (GitHub Actions) & Sentry logging
├─ Build the core UI Design System components & Onboarding Quiz
├─ Technical KPIs: App load <3s, API latency <300ms, zero compilation build errors
└─ GTM Pilot: URL Referral Attribution & WhatsApp Feedback Integration

MONTH 2: Core Product
├─ Build the dynamic Oracle recommendation page & Deferred Onboarding
├─ Implement the offline vector map downloader
├─ Write the Offline Sync retry queue logic
└─ Technical KPIs: Offline sync success >95%

MONTH 3: Transactions & Loyalty Alpha
├─ Integrate Razorpay payment flow
├─ Build the Partner Hotel & Merchant rewards dashboard
├─ Deploy Pilgrim XP Alpha rewards logic & QR vouchers
└─ Technical KPIs: Booking success >98%, Uptime >99.5%

MONTH 4: Optimization & Localization
├─ Optimize low-end Android load times
├─ Enable Text-to-Speech & Accessibility tools (AAA contrast)
├─ Add Telugu, Tamil, and Hindi language selector
└─ Technical KPIs: App bundle size <150KB gzipped

MONTH 5: Automation
├─ Build live notifications & cron alerts
├─ Improve routing heuristics with historical queue averages
└─ Technical KPIs: Queue update broadcast latency <5s

MONTH 6: Expansion
├─ Refactor code for multi-city configurations
├─ Enable dynamic City Pack downloads (Varanasi/Shirdi)
└─ Technical KPIs: New city configuration time <1 day
```

### 6.2 Team Growth Scaling Stages
1. **Stage 1 (Pre-Launch):** 2 Product Engineers (including the cofounders).
2. **Stage 2 (Beta / Weeks 9-13):** Hire 1 Growth & Partnerships Lead (to manage hotel/cab onboarding and merchant XP rewards partnerships).
3. **Stage 3 (Launch / Month 6):** Hire 1 Backend/API Engineer.
4. **Stage 4 (Scale / Month 10):** Hire 1 DevOps Engineer.
5. **Stage 5 (Expansion / Month 14):** Hire 1 Data/Analytics Engineer.
6. **Stage 6 (Venture Scale / Month 18):** Hire 1 Data Scientist (only when predictive models create measurable business value).

---

**Handbook Version:** 2.0 | **Status:** Active | **Last Updated:** July 2026
