# Product Requirements Document: JeevaPath (TravelApp)

## 1. Project Overview
**JeevaPath** is a high-end, AI-powered travel planning application focused on the spiritual and cultural hub of **Tirupati**. It aims to simplify the travel experience by providing personalized, context-aware itineraries that balance spiritual visits with nature, food, and heritage.

### 1.1. Vision
To be the ultimate companion for travelers in Tirupati, offering a seamless blend of spiritual guidance and modern travel convenience through intelligent automation and premium UI/UX.

### 1.2. Target Audience
- **Pilgrims**: Looking for efficient ways to visit temples and manage their spiritual journey.
- **Tourists**: Interested in exploring the nature and history of the Tirupati region.
- **Families/Groups**: Seeking organized trips that cater to diverse interests (spiritual + recreational).

---

## 2. Core Features

### 2.1. Discovery & Exploration
- **Home Dashboard**: Personalized greetings, category-based browsing (Spiritual, Food, Nature, Heritage), and quick-start planning.
- **Explore Page**: Search engine for places with multi-faceted filtering.
- **Place Details**: Rich media (images/videos), descriptions, location data, and reviews for each destination.

### 2.2. Smart Itinerary Planner
- **Multi-Step Onboarding**: Collects user preferences including:
  - **Time**: Available duration (hours/days).
  - **Budget**: Tiered spending levels (Budget, Medium, Premium).
  - **Mood**: Relaxation, Adventure, Devotional, etc.
  - **Interests**: Specific tags (Waterfalls, Architecture, Local Food).
  - **Group Type**: Solo, Family, Friends, Couple.
- **AI Generation Engine**: Real-time itinerary creation based on the above inputs.
- **Itinerary Management**: Interactive timeline of activities, map integration, and "Surprise Me" functionality.

### 2.3. Admin Panel
- **Content Management**: CRUD operations for places (add/edit/delete destinations).
- **Traffic Monitoring**: Real-time analytics on app usage and popular destinations.
- **Authentication**: Secure login for administrators.

### 2.4. User Experience
- **Splash Screen**: Cinematic startup animation using Lottie and Framer Motion.
- **Bottom Navigation**: Persistent access to Home, Explore, Saved, and Profile.
- **Responsive Design**: Mobile-first approach with glassmorphic UI elements and smooth transitions.

---

## 3. Technical Stack

### 3.1. Frontend
- **Framework**: Next.js 15+ (App Router).
- **Language**: TypeScript.
- **Styling**: Tailwind CSS 4 with Vanilla CSS modules for complex components.
- **Animations**: Framer Motion, Lottie-React.
- **Icons**: Lucide React.
- **State Management**: React Context API (TripContext, PlannerContext).

### 3.2. Backend & Data
- **API**: Next.js Serverless Functions (Route Handlers).
- **Database**: Static/Dynamic JSON-based storage (currently `src/data/places.ts`), ready for transition to a robust DB like PostgreSQL/MongoDB.
- **Authentication**: Custom JWT or session-based login for Admin.

---

## 4. User Flows

### 4.1. The "Quick Plan" Flow
1. User lands on **Home**.
2. Clicks "Start Planning".
3. Completes 5-step preference wizard.
4. "Generating" screen displays progress animation.
5. Final **Itinerary** is presented with a timeline.

### 4.2. The "Discovery" Flow
1. User clicks "Explore" in bottom nav.
2. Searches for "Waterfalls".
3. Clicks on "Talakona Falls".
4. Views photos, reviews, and adds to "Saved".

---

## 5. Roadmap & Future Enhancements
- **Phase 1 (Current)**: Foundation, Core Planner, Admin Panel, and UI/UX polish.
- **Phase 2**: Real-time navigation integration, Live Darshan timings, and Booking integration (Hotels/Taxis).
- **Phase 3**: AI Chatbot for on-the-go queries and Community reviews/social features.

---

## 6. Success Metrics
- **Engagement**: Number of itineraries generated per user.
- **Retention**: Daily active users (DAU) for travelers staying multiple days.
- **Accuracy**: User feedback on the quality of generated itineraries.
