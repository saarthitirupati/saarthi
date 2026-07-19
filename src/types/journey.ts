export interface PlanStop {
  placeId: string;
  arrivalTime: string;
  departureTime: string;
  travelToNext: number; // mins
  travelMode: string;
  estimatedCost: number;
}

export interface Plan {
  type: 'best' | 'budget' | 'premium';
  title: string;
  emoji: string;
  tagline: string;
  stops: PlanStop[];
  totalMins: number;
  totalCost: number;
  highlights: string[];
}

export interface PlannerInput {
  timeMins: number;
  budget: number;
  budgetTier: 'budget' | 'medium' | 'premium';
  interests: string[];
  groupType: 'solo' | 'couple' | 'family' | 'elderly' | 'friends';
  travelMode: 'walk' | 'bike' | 'car' | 'cab' | 'public';
}

export interface TripState {
  days: number;
  savedMantras: string[];
  savedPlaces: string[];
  visitedPlaces: string[];
  viewedPlaces: string[];
  isInitialized: boolean;
  plannerInput: PlannerInput;
  generatedPlans: Plan[] | null;
  recommendations: any[] | null;
  userLocation: { lat: number; lng: number } | null;
  locationPermission: 'default' | 'granted' | 'denied';
  locationName?: string;
  savedPlans: (Plan & { id: string; savedAt: string })[];
}
