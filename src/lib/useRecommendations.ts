import { useState, useEffect } from 'react';
import { useTrip } from '@/components/TripContext';

export type Recommendation = {
  rank_tier: string;
  score: number;
  confidence: number;
  place: {
    id: string;
    name: string;
    slug: string;
    hero_image: string;
    coordinates: { lat: number; lng: number };
  };
  distance_km: number;
  travel_time_mins: number;
  reasons: string[];
};

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { userLocation } = useTrip();

  useEffect(() => {
    async function fetchRecs() {
      try {
        setLoading(true);
        // Defaults to Tirupati Center
        const lat = userLocation?.lat || 13.6288;
        const lng = userLocation?.lng || 79.4192;
        
        // Pass current context
        const hr = new Date().getHours();
        const timeStr = `${hr}:00`;
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = days[new Date().getDay()];

        const res = await fetch(`/api/context/recommendations?lat=${lat}&lng=${lng}&time=${timeStr}&dayOfWeek=${dayOfWeek}`);
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecs();
  }, [userLocation]);

  return { recommendations, loading };
}
