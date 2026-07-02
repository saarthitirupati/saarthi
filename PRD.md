# Product Requirements Document: JeevaPath (Saarthi)
*Spiritual & Cultural Travel Companion for Tirupati*

---

## 1. The Goal/Problem

### 1.1. What are we trying to accomplish?
We are building **JeevaPath (Saarthi)**, a high-end, AI-powered travel planning companion focused on the spiritual and cultural hub of **Tirupati**. 
* **Seamless Travel Planning:** We aim to simplify the travel experience by offering personalized, context-aware itineraries that balance spiritual visits (temple darshans, rituals) with nature (waterfalls, hills), food, and heritage.
* **Premium UX/UI Identity:** We aim to create a visually stunning, mobile-first experience using a "Neo-Indian Minimalism" design system—blending ancient aesthetics with cutting-edge, glassmorphic interfaces that build immediate emotional connection and trust.
* **High-Fidelity Offline Access:** We want to ensure that travelers have access to their plans, historical guides, and maps even when traveling through poor cellular coverage zones common in the Tirumala hills.

### 1.2. What is the problem we are facing?
* **Fragmented Tools:** Travelers face extreme friction planning their trips, juggling multiple disconnected applications (e.g., official temple devasthanam portals for booking, Google Maps for travel times, TripAdvisor for reviews, Zomato for dining, local blogs for finding hidden spots).
* **Information Overload & Irrelevance:** Traditional travel apps show "everything to everyone." Pilgrims are distracted by irrelevant recommendations (cafes, shopping malls), while young explorers are bored by basic temple lists.
* **Lack of Group & Context Sensitivity:** Existing apps fail to account for group dynamics (e.g., a family traveling with both elderly pilgrims who cannot climb steps and active children) or context-sensitive parameters (real-time queue updates, weather patterns, and darshan timings).
* **Unreliable Hilltop Connectivity:** Tirumala and surrounding scenic forest routes suffer from weak cellular coverage, rendering standard cloud-reliant detail screens and planners completely broken during active transit.

---

## 2. Context & Constraints

### 2.1. Timeline & Deadlines
We are operating on an aggressive **4-week build plan** to deliver a beta-ready MVP:
* **Week 1 (Foundations):** Core setup, mobile navigation, days selection, and onboarding quiz flows.
* **Week 2 (Core Experience):** Itinerary generation engine, timeline view, map integration, and temple details.
* **Week 3 (Real-Time & Transit):** Firebase real-time status updates, transit booking links, and offline local caching.
* **Week 4 (Polish & Launch):** Settings, saved plans dashboard, performance tuning, and recruitment of 100+ beta testers.

### 2.2. Budget & Financial Model
* **Project Budget:** Estimated at **₹85-105 lakhs**, covering a core team of 4 (1 Product Manager, 1 Designer, 2 Frontend Engineers, 1 Backend Engineer) over 4 weeks, including Google Cloud and database infrastructure setup.
* **Business Potential:** Target break-even is **50K Daily Active Users (DAU)**. The estimated Year 1 revenue potential is **₹89.4 Cr** (assuming 100K active users, an average annual revenue per user (ARPU) of ₹1,950, and ₹1.5 Cr initial marketing spend).

### 2.3. Limitations & Technical Restrictions
* **Zero Irrelevance Guarantee (Subtractive Filter):** The system must execute hard interest boundaries. If a user does not explicitly choose a category (e.g., "Spiritual"), the recommendation engine must completely exclude all temples and related sites from the UI.
* **Offline-First Caching:** The app must utilize local persistence (IndexedDB / SQLite caching) so itineraries and key details load instantly without internet.
* **Predictable Optimization:** To prevent dangerous hallucinations (such as incorrect temple closing hours or unsafe trekking routes), the itinerary generator must rely on a structured constraint-satisfaction scoring algorithm rather than raw LLM generation.

### 2.4. Who is Involved?
* **Founders / Leadership:** Provide strategic direction and approve roadmap phases.
* **Product Manager:** Manages feature scope, priorities, and cross-functional validation.
* **UI/UX Designer:** Establishes the component system, icons, and transitions.
* **Frontend Lead:** Builds TypeScript screens, Framer Motion transitions, and context hooks.
* **Backend Lead:** Sets up the Next.js API route handshakes, Supabase data schemas, and Firebase integrations.
* **Beta Testers:** 100-200 local travelers, guides, and early adopters.

---

## 3. Current Situation

### 3.1. What we have already tried/built
* **Core Brand Identity:** Completed the design framework for Neo-Indian Minimalism featuring saffron and deep purple brand accents, Telugu script options, and glassmorphic bottom navigation elements.
* **Prototype Next.js App:** Scaffolded the Next.js 15 workspace using Tailwind CSS 4 and TypeScript.
* **Coded Places Database:** Created [places.ts](file:///d:/travel/src/data/places.ts) containing 23+ detailed places across 8 categories (spiritual, nature, water, historical, hidden, leisure, culture, food). Each record is enriched with timings, dress codes, coordinates, and Telugu translation hooks.
* **Recommendation Engine:** Implemented the baseline greedy routing algorithm in [plannerEngine.ts](file:///d:/travel/src/utils/plannerEngine.ts). The engine expands interest synonyms, calculates travel times dynamically, and filters locations based on budget, travel mode, and category isolation.

### 3.2. What is working vs. what is not working
* **Working:** Standard navigation routing, preference quiz questionnaire steps, client-side score evaluations, interest synonym expansions, and base responsive CSS layouts.
* **Not Working / Pending:**
  * Real-time Firebase integration for queue and darshan waiting times.
  * Deep links for transit providers (Uber, Ola, local state RTC buses).
  * Synchronization managers to cache data and queue uploads when connections drop.
  * Admin panel write-authorization and analytics widgets.

### 3.3. Relevant Background Info
Tirupati attracts upwards of 30-40 million visitors every year. Existing government and corporate travel apps offer static, clunky user interfaces. Introducing an elegant, offline-capable "Zero Irrelevance" experience that saves visitors hours of queue waiting represents a massive market opportunity.

---

## 4. Success Criteria

### 4.1. How will we know it worked? (Metrics)
* **Application Speed:** Initial page load and time-to-interactive under **3.0 seconds** on a 4G connection.
* **Planner Performance:** Itinerary generation response completed in under **1.5 seconds**.
* **Recommendation Quality:** User satisfaction rating on generated routes exceeds **4.5 / 5.0 stars**.
* **Engagement:** Average of **>3.0 itineraries generated** per active planning user.
* **User Retention:** Day 7 active user retention **>50%**; Day 30 active user retention **>30%**.
* **Offline Synchronization:** Local edits sync to server within **15 seconds** of cellular reconnection.
* **Queue Projections:** Real-time wait duration predictions are accurate to within **±15 minutes** of actual wait times.

### 4.2. What is important about the outcome?
* **Aesthetic wow factor:** The app must look premium. Transitions must be smooth (e.g., the cinematic "Lotus Unfolding" startup splash animation).
* **Frictionless Utility:** Users must feel that the app takes away the stress of scheduling, allowing them to focus entirely on their spiritual and recreational journey.

---

## 5. Specific Details

### 5.1. Scope & Screen List
We will develop **15 mobile-optimized screens** organized by priority:

#### Tier 1: Critical (MVP Launch - Weeks 1-2)
1. **Splash Screen:** Cinematic welcome animation sequence.
2. **Days Selection Screen:** Quick interface to define trip length (hours, 1-3 days).
3. **Preferences Quiz:** 3-step question flow (Interests, Budget, Group type).
4. **Itinerary Hub:** Interactive scrollable timeline showing stops, routes, transit times, and map views.
5. **Temple/Place Details:** Tabbed card (Overview, Experience, and Spiritual deep dive).

#### Tier 2: Important (Weeks 3-4)
6. **Location Access Prompt:** Permission handling card.
7. **Accommodation Screen:** Recommendations and booking partners.
8. **Dining Guide:** Categorized local restaurants and eateries.
9. **Saved Itineraries Dashboard:** Manage and view offline-saved plans.
10. **Settings Screen:** Accessibility and Telugu language toggle.

#### Phase 2: Daily Engagement System
*Transforming Saarthi from a trip planner into a daily local companion.*

11. **Pillar 1 - Live Today:** Live Dashboard (crowd wait times, weather, RTC schedules) and Nearby Smart Alerts.
12. **Pillar 2 - Discover:** Featured Discovery (unlock mechanics), Weekend Explorer, Daily Discovery.
13. **Pillar 3 - Learn:** Daily Quiz, Story of the Day (30-second micro-reads), Festival Countdown.
14. **Pillar 4 - Journey:** Journey Timeline, Explorer Passport, Personal Statistics, Achievements.
15. **Today's Mood Journey:** Daily mood prompt generating AI-curated micro-plans.

### 5.2. Tech Stack & Integration Points
* **Frontend:** Next.js 15+ App Router, TypeScript, Tailwind CSS 4, Framer Motion, Lucide Icons.
* **Backend Database:** Next.js Route Handlers + Supabase (for user details, favorites, and analytics).
* **Real-time Synchronization:** Firebase Realtime Database (for active crowd and temple queue analytics).
* **Content Management:** Sanity CMS (for editing historical details, myths, and travel tips).

### 5.3. Key Decisions & Trade-offs
* **Algorithmic Routing vs. LLM Generation:**
  * *Decision:* Utilize a structured, deterministic algorithm over a large language model.
  * *Trade-off:* While LLMs are more conversational, they are prone to hallucinations regarding temple darshan timings, locations, and safety coordinates. The deterministic algorithm guarantees accuracy and runs in milliseconds, but requires maintaining a high-fidelity local database.
* **Offline-First Storage:**
  * *Decision:* Implement local caching for active itineraries and place guides.
  * *Trade-off:* Increases client-side state sync complexity, but guarantees reliability in remote hilly terrain.
