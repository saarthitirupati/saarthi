export type PlaceType = 'spiritual' | 'nature' | 'water' | 'food' | 'historical' | 'hidden' | 'leisure' | 'culture';
export type BudgetLevel = 'budget' | 'medium' | 'premium';

export interface Place {
  id: string;
  name: string;
  category: string;
  placeType: PlaceType;
  location: string;
  distanceKms: number;
  durationMins: number;
  budgetLevel: BudgetLevel;
  entryFeeNum: number;
  interests: string[];
  openFrom: number;
  openTo: number;
  isMustVisit: boolean;
  description: string;
  descriptionTe?: string;
  history: string;
  historyTe?: string;
  timings: string;
  entryFee: string;
  address: string;
  rating: number;
  reviewCount: number;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  tags: string[];
  bestTime: string;
  darshanInfo?: {
    timings: string;
  };
  spiritualInfo?: {
    god: string;
    deityType?: string;
    knownFor: string;
    mantra: string;
    wishes?: string;
    devoteeTips: string[];
  };
  practicalInfo: {
    dressCode: string;
    food: string;
    parking: string;
    restrictions?: string[];
  };
  builtBy?: string;
  keyPoojas?: string[];
  videoUrl?: string;
  travelEstimates: Record<string, string>;

  // Phase 1 Schema Fields
  shortIntro?: string;
  whyVisit?: string;
  openingTime?: string;
  closingTime?: string;
  duration?: string;
  travelByRTC?: string;
  travelByCar?: string;
  travelByBike?: string;
  approxRTCFare?: string;
  approxCarCost?: string;
  approxBikeCost?: string;
  youtubeLink?: string;
  images?: string[];
  visitorTips?: {
    dressCode?: string;
    crowdNote?: string;
    footwearRule?: string;
    photoRule?: string;
    entryRule?: string;
  };
}
