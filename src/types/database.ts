export interface CityRecord {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  state: string;
  country: string;
  created_at: string;
}

export interface CategoryRecord {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  icon: string | null;
  priority: number;
  created_at: string;
}

export interface PlaceRecord {
  id: string;
  city_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  history: string | null;
  story: string | null;
  interesting_facts: string[] | null;
  why_visit: string[] | null;
  coordinates: { lat: number; lng: number } | null;
  timings: any | null;
  entry_fee: any | null;
  visit_duration: any | null;
  travel_info: any | null;
  hero_image: string | null;
  gallery: { url: string; caption?: string; featured?: boolean }[] | null;
  media: { video?: string; audio?: string; pdf?: string } | null;
  tips: string[] | null;
  weather_ideal: string[] | null;
  best_time: string[] | null;
  crowd_escape: boolean;
  metadata: any | null;
  verification_status: string;
  verified_by: string | null;
  verified_on: string | null;
  last_reviewed: string | null;
  trust_score: number;
  keywords: string[] | null;
  featured: boolean;
  status: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface LiveUpdateRecord {
  id: string;
  city_id: string;
  place_id: string | null;
  module: string;
  title: string;
  value: string | null;
  badge: string | null;
  priority: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FestivalRecord {
  id: string;
  city_id: string;
  title: string;
  description: string | null;
  image: string | null;
  date_start: string;
  date_end: string | null;
  priority: number;
  is_active: boolean;
  created_at: string;
}

export interface AlertRecord {
  id: string;
  city_id: string;
  place_id: string | null;
  title: string;
  message: string | null;
  severity: string;
  link: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface FeedbackRecord {
  id: string;
  place_id: string;
  is_helpful: boolean;
  comment: string | null;
  created_at: string;
}
