# Saarthi - Your Smart Travel Companion

Saarthi is a modern Next.js web application designed to help users plan trips, explore places, and manage their travel itineraries seamlessly.

## Application Flow

```mermaid
flowchart TD
    A[Home Page] --> B{Choose Action}
    B -->|Explore| C[Explore Places]
    B -->|Plan| D[Travel Planner]
    
    C --> E[Place Details]
    C --> F[Reviews]
    
    D --> G[Select Interests/Budget/Time]
    G --> H[Generate Itinerary]
    H --> I[View Saved Plans]
    
    J[Admin Dashboard] --> K[Manage Places]
    J --> L[Update Live Status/Traffic]
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
