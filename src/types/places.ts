export interface Place {
  id: string;
  name: string;
  location?: string;
  category?: string;
  placeType?: string;
  isMustVisit?: boolean;
  isHiddenGem?: boolean;
  rating?: number;
  openFrom?: number;
  openTo?: number;
  coordinates?: { lat: number; lng: number };
  image?: string;
  [key: string]: any;
}
