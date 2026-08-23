export interface DarshanDetail {
  id: string;
  title: string;
  teluguTitle?: string;
  badge?: string;
  badgeTelugu?: string;
  themeColor?: string;
  accentGradient?: string;
  cost: string;
  waitTime: string; // fallback/mock, real wait time comes from api
  peakHours?: string;
  bestTimeToVisit?: string;
  entryGate?: string;
  bookingMode?: string;
  tokenLocations?: {
    name: string;
    landmark: string;
    counterHours: string;
    quotaInfo: string;
  }[];
  description: string;
  
  accessibility: string[];
  facilities: { 
    type: 'water' | 'food' | 'restroom' | 'medical' | 'wheelchair' | 'infant'; 
    available: boolean; 
    notes: string; 
  }[];
  dressCodeRules: { 
    allowed: string[]; 
    prohibited: string[]; 
    exceptions: string; 
  };
  journeySteps: { 
    step: number; 
    title: string; 
    desc: string; 
    estimatedTime?: string;
    iconType?: string;
  }[];
  
  whyWaitTimeExplanation?: string;
  rulesAndRequirements?: string[];
  
  // Legacy string array fallbacks
  guidelines: string[];
  tips: string[];
}
