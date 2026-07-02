export interface DarshanDetail {
  id: string;
  title: string;
  cost: string;
  waitTime: string; // fallback/mock, real wait time comes from api
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
  }[];
  
  // Legacy string array fallbacks
  guidelines: string[];
  tips: string[];
}
