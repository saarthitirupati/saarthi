'use client';

import React from 'react';
import { useHomeData } from '@/hooks/useHomeData';
import { LoadingState } from '@/components/common/LoadingState';
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

  if (home.loading) {
    return <LoadingState message="Loading your Saarthi..." />;
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#FAF8F4', position: 'relative', paddingBottom: '84px', fontFamily: 'var(--font-heading), var(--font-body), sans-serif' }}>
      <ActiveAlerts {...home.alerts} />
      <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} />
      <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />
      <LiveStatusWidget {...home.status} />
      <DailyContent {...home.daily} liveStatus={home.status.liveStatus} />
      <RecommendationCard liveStatus={home.status.liveStatus} todayFestival={home.daily.todayFestival} />
    </div>
  );
}
