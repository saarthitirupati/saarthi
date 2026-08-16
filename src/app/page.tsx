'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useMemo } from 'react';
import { useHomeData } from '@/hooks/useHomeData';
import { useTrip } from '@/components/TripContext';
import { LoadingState } from '@/components/common/LoadingState';
import { calculateDrivingDistance, TIRUPATI_CENTER } from '@/lib/location';
import { useLanguage } from '@/lib/useLanguage';
import {
  HomeHero,
  ActiveAlerts,
  RecommendationCard,
  QuickChecklist,
  DailyContent,
  JourneyOverviewPanel
} from '@/components/home';
import styles from './Home.module.css';

const TEXTS = {
  en: {
    loading: 'Loading your Saarthi...',
    nearbyPlaces: 'Nearby Places',
    seeAll: 'See all →'
  },
  te: {
    loading: 'మీ సారథి లోడ్ అవుతోంది...',
    nearbyPlaces: 'సమీపంలోని ప్రదేశాలు',
    seeAll: 'అన్నీ చూడండి →'
  }
};

export default function HomePage() {
  const home = useHomeData();
  const { userLocation } = useTrip();
  const lang = useLanguage();
  const t = TEXTS[lang];

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
    return <LoadingState message={t.loading} />;
  }

  return (
    <div className={styles.homeWrapper}>
      {/* 📱 MOBILE VIEW (<768px): Action-First 1-Column Stack */}
      <div className={styles.mobileOnly}>
        <div className={styles.mobileStack}>
          <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} hideHeader={false} />
          
          {/* Today's Companion Card (Placed directly under hero greeting on mobile) */}
          <DailyContent {...home.daily} liveStatus={home.status.liveStatus} variant="mobile" />

          {/* Quick Checklist */}
          <div style={{ padding: '0 16px' }}>
            <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />
          </div>

          {nearbyPlaces.length > 0 && (
            <div style={{ padding: '8px 0' }}>
              <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.8px', textTransform: 'uppercase', margin: 0 }}>{t.nearbyPlaces}</p>
                <Link href="/explore" style={{ fontSize: '11.5px', fontWeight: 700, color: '#10B981', textDecoration: 'none' }}>{t.seeAll}</Link>
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
      </div>

      {/* 💻 DESKTOP & TABLET VIEW (>=768px): Multi-Column Dashboard Command Center */}
      <div className={styles.desktopOnly}>

        {/* Sleek Desktop Header Greeting */}
        <div style={{ marginBottom: '16px', padding: '4px 0' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {(() => {
              const hr = new Date().getHours();
              if (hr >= 5 && hr < 12) return 'Good Morning';
              if (hr >= 12 && hr < 17) return 'Good Afternoon';
              if (hr >= 17 && hr < 21) return 'Good Evening';
              return 'Good Night';
            })()}, <span style={{ color: '#0F5132' }}>{home.hero.userName}</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#0F5132', margin: 0, fontWeight: 700 }}>
            Based on your current situation, here's the best thing to do next — and why.
          </p>
        </div>

        {/* ROW 1: 2-COLUMN DASHBOARD GRID */}
        <div className={styles.dashboardGrid}>
          {/* COLUMN 1: DOMINANT LIVE DECISION CARD + RECOMMENDED SPOT CARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} hideHeader={true} />
            <RecommendationCard liveStatus={home.status.liveStatus} todayFestival={home.daily.todayFestival} variant="desktop" />
          </div>

          {/* COLUMN 2: TODAY'S COMPANION & QUICK CHECKLIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <DailyContent {...home.daily} liveStatus={home.status.liveStatus} variant="desktop" />
            <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />
          </div>
        </div>

        {/* ROW 2: MAP OVERVIEW PANEL */}
        <div className={styles.secondRowGrid}>
          <JourneyOverviewPanel />
        </div>

        {/* NEARBY PLACES SLIDER */}
        {nearbyPlaces.length > 0 && (
          <div style={{ marginTop: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>{t.nearbyPlaces}</p>
              <Link href="/explore" style={{ fontSize: '13px', fontWeight: 700, color: '#10B981', textDecoration: 'none' }}>{t.seeAll}</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
              {nearbyPlaces.map(p => (
                <Link key={p.id} href={`/place/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '100%', height: '110px', borderRadius: '16px',
                    backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    backgroundColor: '#E2E8F0', marginBottom: '8px'
                  }} />
                  <p style={{
                    fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px', lineHeight: 1.3,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const
                  }}>
                    {p.name}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B' }}>
                    <MapPin size={12} />
                    <span style={{ fontSize: '11.5px', fontWeight: 600 }}>{p._dist} km</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
