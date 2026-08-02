export interface LiveStatus {
  waitTime: string;
  crowdLevel: 'low' | 'moderate' | 'high' | 'very-high';
  sevaStatus: string;
  notice: string;
  lastUpdated: string;
  darshanSpeed: 'fast' | 'normal' | 'slow';
  accommodationStatus: 'available' | 'limited' | 'full';
  ladduAvailability: 'available' | 'limited' | 'full';
  weather: string;
  darshans: Array<{ name: string; waitTime: string; peakHours: string }>;
  ssdTokenStatus: 'issuing' | 'paused' | 'closed';
  ssdNextTokenTime: string;
  ssdTokenSlots: Array<{ slotTime: string; status: 'available' | 'filling' | 'closed'; tokensLeft: string }>;
  ssdNotice: string;
  ssdTimingsGuide: string;
  ssdCounters: Array<{ name: string; description: string }>;
}
