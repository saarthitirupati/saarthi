'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useMemo } from 'react';
import { useHomeData } from '@/hooks/useHomeData';
import { useTrip } from '@/components/TripContext';
import { LoadingState } from '@/components/common/LoadingState';
import { calculateDrivingDistance, TIRUPATI_CENTER } from '@/lib/location';
import {
  HomeHero,
  ActiveAlerts,
  RecommendationCard,
  QuickChecklist,
  DailyContent,
  LiveStatusWidget
} from '@/components/home';

export default function HomePage() {
  const home = useHomeData();
  const { userLocation } = useTrip();

  const origin = userLocation ?? TIRUPATI_CENTER;

  const nearbyPlaces = useMemo(() => {
    if (!home.places?.allPlaces?.length) return [];
    return [...home.places.allPlaces]
      .filter(p => p.coordinates && p.placeType !== 'food')
      .map(p => ({
        ...p,
        _dist: calculateDrivingDistance(
          origin.lat, origin.lng,
          p.coordinates.lat, p.coordinates.lng,
          p.category === 'Tirumala Spot'
        )
      }))
      .sort((a, b) => a._dist - b._dist)
      .slice(0, 6);
  }, [home.places?.allPlaces, origin.lat, origin.lng]);

  if (home.loading) {
    return <LoadingState message="Loading your Saarthi..." />;
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#FAF8F4', position: 'relative', paddingBottom: '84px', fontFamily: 'var(--font-heading), var(--font-body), sans-serif' }}>
      <ActiveAlerts {...home.alerts} />
      <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} />
      <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />
      <LiveStatusWidget {...home.status} />
      <DailyContent {...home.daily} liveStatus={home.status.liveStatus} />
      <RecommendationCard liveStatus={home.status.liveStatus} todayFestival={home.daily.todayFestival} />

      {/* Nearby Places — sorted by real driving distance from user's GPS */}
      {nearbyPlaces.length > 0 && (
        <div style={{ padding: '4px 0 8px 0' }}>
          <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.8px', textTransform: 'uppercase', margin: 0 }}>Nearby Places</p>
            <Link href="/explore" style={{ fontSize: '11.5px', fontWeight: 700, color: '#10B981', textDecoration: 'none' }}>See all →</Link>
          </div>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 16px 4px', scrollbarWidth: 'none' }}>
            {nearbyPlaces.map(p => (
              <Link key={p.id} href={`/place/${p.id}`} style={{ textDecoration: 'none', flexShrink: 0, width: '120px' }}>
                <div style={{
                  width: '120px', height: '80px', borderRadius: '12px',
                  backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  backgroundColor: '#E2E8F0', marginBottom: '7px'
                }} />
                <p style={{
                  fontSize: '12px', fontWeight: 700, color: '#0F172A', margin: '0 0 3px', lineHeight: 1.3,
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const
                }}>
                  {p.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748B' }}>
                  <MapPin size={10} />
                  <span style={{ fontSize: '10.5px', fontWeight: 600 }}>{p._dist} km</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
