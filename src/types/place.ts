export type PlaceType = 'spiritual' | 'nature' | 'water' | 'food' | 'historical' | 'hidden' | 'leisure' | 'culture' | 'facility';
export type BudgetLevel = 'budget' | 'medium' | 'premium';

export type VisitorType = 'Families' | 'Kids' | 'Senior Citizens' | 'Couples' | 'Photographers' | 'Pilgrims' | 'Solo Travelers';

export type OperationalStatus = 'Draft' | 'Review' | 'Published' | 'Archived' | 'Hidden';
export type VisitDifficulty = 'Easy' | 'Moderate' | 'Hard';
export type TypicalCrowdLevel = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Extreme';
export type VisitDurationType = 'Quick Stop' | 'Half Day' | 'Full Day' | 'Must Visit' | 'Optional';
export type ImportanceTier = 'Iconic' | 'Recommended' | 'Optional' | 'Hidden Gem';
export type IdealSeasonType = 'Summer' | 'Monsoon' | 'Winter' | 'Festival Season' | 'All Seasons';

export type VerificationTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export interface PlaceVerification {
  status: 'Verified' | 'Unverified' | 'Pending';
  tier?: VerificationTier;
  verifiedBy?: string;
  verifiedDate?: string;
  source?: 'TTD' | 'Government' | 'Local Volunteers' | 'Temple Officials' | 'Ground Visit' | string;
  confidenceScore?: number;
  lastUpdated?: string;
}

export interface PlaceRecommendationContext {
  bestTimeOfDay?: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];
  idealWeather?: ('Sunny' | 'Cloudy' | 'Rain' | 'Winter' | 'Summer')[];
  idealSeason?: IdealSeasonType[];
  crowdEscape?: boolean;
  typicalCrowd?: TypicalCrowdLevel;
  indoorOutdoor?: 'Indoor' | 'Outdoor' | 'Both';
  familyFriendly?: boolean;
  seniorFriendly?: boolean;
  wheelchairAccessible?: boolean;
  kidsFriendly?: boolean;
  photographyFriendly?: boolean;
  basePriority?: number;
  recommendationPriority?: number;
  recommendationReasons?: string[];
}

export interface PlaceSearchIntelligence {
  aliases: string[];
  tags?: string[];
  intentQueries: string[];
  misspellings?: string[];
}

export interface PlaceRelationships {
  nearby?: string[];
  alternatives?: string[];
  nextVisit?: string[];
  sameCategory?: string[];
  recommendedTogether?: string[];
  childPlaces?: string[];
  parentPlace?: string;
}

export interface PlaceFacilityDetail {
  available: boolean;
  distance?: string;
  cost?: 'Free' | 'Paid' | string;
  timing?: string;
}

export interface PlaceTravelOptions {
  landmark?: string;
  distRailway?: number;
  distBusStand?: number;
  distAirport?: number;
  distTirumala?: number;
  distAlipiri?: number;
  distKapilaTheertham?: number;
  car?: {
    available: boolean;
    time?: string;
    fuelCost?: string;
    parking?: string;
    parkingCost?: string;
    roadCondition?: string;
    trafficLevel?: string;
  };
  bike?: {
    available: boolean;
    time?: string;
    fuelCost?: string;
    parking?: string;
  };
  rtc?: {
    available: boolean;
    busNumbers?: string[];
    frequency?: string;
    ticketCost?: string;
    busStop?: string;
    walkDist?: string;
  };
  walk?: {
    dist?: string;
    time?: string;
    difficulty?: string;
  };
}

export interface PlaceEmergencyInfo {
  hospital?: string;
  police?: string;
  contact?: string;
  office?: string;
  lostFound?: string;
}

export interface Place {
  id: string;
  name: string;
  nameTe?: string;
  teluguName?: string;
  teluguTitle?: string;
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
    primaryEntrance?: { lat: number; lng: number };
    parkingEntrance?: { lat: number; lng: number };
    walkingEntrance?: { lat: number; lng: number };
  };
  navigationPriority?: 'primaryEntrance' | 'parkingEntrance' | 'walkingEntrance';
  tags: string[];
  bestTime: string;
  idealFor?: VisitorType[];
  mapUrl?: string;

  // Master Template v1.1 Operational & Classification Fields
  status?: OperationalStatus;
  isTemporarilyClosed?: boolean;
  operationalStatus?: string;
  closureNotice?: { en: string; te: string };
  importanceLevel?: ImportanceTier;
  visitDifficulty?: VisitDifficulty;
  visitType?: VisitDurationType;
  oneReasonToVisit?: string;

  // Master Template v1.1 Section Structures
  verification?: PlaceVerification;
  recommendationContext?: PlaceRecommendationContext;
  searchIntelligence?: PlaceSearchIntelligence;
  relationships?: PlaceRelationships;
  detailedFacilities?: Record<string, PlaceFacilityDetail>;
  travelOptions?: PlaceTravelOptions;
  emergencyInfo?: PlaceEmergencyInfo;

  saarthiIntelligence?: {
    enabled: boolean;
    crowdLevel?: "Low" | "Moderate" | "High";
    waitingTime?: string;
    recommendedTransport?: string;
    parkingDifficulty?: "Easy" | "Moderate" | "Difficult";
    travelScore?: number; // Saarthi Score
    confidence?: number;
    source?: string;
    lastUpdated?: string;
  };
  contentCreator?: {
    summary30?: string;
    summary100?: string;
    hook?: string;
    scriptNotes?: string;
    thumbnailText?: string;
  };
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

  images?: string[];
  gallery?: string[];
  visitorTips?: {
    dressCode?: string;
    crowdNote?: string;
    footwearRule?: string;
    photoRule?: string;
    entryRule?: string;
  };
  guideAudio?: string;

  // Sprint 1 Schema Fields
  architecture?: string;
  importance?: string;
  deity?: string;
  deityType?: string;
  breakTimings?: { from: string; to: string }[];
  isHiddenGem?: boolean;
  rituals?: {
    daily?: string[];
    weekly?: string[];
    monthly?: string[];
    annual?: string[];
    sevas?: string[];
  };
  facilities?: {
    locker?: string;
    toilets?: string;
    drinkingWater?: string;
    wheelchair?: string;
    parking?: string;
    food?: string;
  };
  difficulty?: 'easy' | 'moderate' | 'hard';
  bestSeason?: string;
  relatedPlaces?: string[];
  nearbyTemples?: string[];
}
