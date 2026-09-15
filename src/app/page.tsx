'use client';

import Link from 'next/link';
import { MapPin, Lock, Utensils, Scissors, Bed, ChevronRight, Sparkles, BookOpen, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useHomeData } from '@/hooks/useHomeData';
import { useTrip } from '@/components/TripContext';
import { LoadingState } from '@/components/common/LoadingState';
import { calculateDrivingDistance, TIRUPATI_CENTER, isWithinTirupatiRegion } from '@/lib/location';
import { useLanguage } from '@/lib/useLanguage';
import {
  HomeHero,
  RecommendationCard,
  DailyContent,
  QuickChecklist,
  YatraChecklist
} from '@/components/home';
import styles from './Home.module.css';

const TEXTS = {
  en: {
    loading: 'Loading your Saarthi...',
    primaryServices: 'What You Need Right Now',
    servicesSub: 'Essential facilities before your darshan',
    nearbyPlaces: 'Explore Around You',
    seeAll: 'See all →',
    navigate: 'Navigate →',
    openDrawer: 'More for your pilgrimage',
    closeDrawer: 'Close',
    lockers: 'Lockers & Luggage',
    lockersSub: 'Deposit phones & bags before queue at PAC-1 to 5 & VQC',
    lockersStatus: '6 Locations Open',
    meals: 'Free Annaprasadam',
    mealsSub: 'Free hot meals at Tarigonda Vengamamba Complex',
    mealsStatus: 'Serving Continuously',
    tonsure: 'Kalyana Katta (Tonsure)',
    tonsureSub: 'Sacred tonsure & baths near Pushkarini (Open 24/7)',
    tonsureStatus: 'Open 24/7',
    stay: 'Stay & PAC Halls',
    staySub: 'Free rest halls at PAC-1 to 5 & CRO room counters',
    stayStatus: 'Halls Available',
    whatDoYouNeed: 'What do you need?',
    darshanLabel: 'Darshan',
    foodLabel: 'Food',
    stayLabel: 'Stay',
    exploreLabel: 'Explore',
    moreChecklists: 'More tools & checklists'
  },
  te: {
    loading: 'మీ సారథి లోడ్ అవుతోంది...',
    primaryServices: 'మీకు ఇప్పుడు అవసరమైనవి',
    servicesSub: 'దర్శనానికి ముందు ముఖ్యమైన సదుపాయాలు',
    nearbyPlaces: 'మీ చుట్టూ ఉన్న ప్రదేశాలు',
    seeAll: 'అన్నీ చూడండి →',
    navigate: 'మార్గం →',
    openDrawer: 'మరిన్ని వివరాలు & సమాచారం',
    closeDrawer: 'మూసివేయి',
    lockers: 'లాకర్లు & లగేజీ',
    lockersSub: 'PAC-1 నుండి 5, VQC వద్ద మొబైల్స్ & లగేజీ ఉచిత భద్రత',
    lockersStatus: '6 కేంద్రాలు ఓపెన్',
    meals: 'ఉచిత అన్నప్రసాదం',
    mealsSub: 'తరిగొండ వెంగమాంబ సముదాయంలో నిరంతర ఉచిత భోజనం',
    mealsStatus: 'అందుబాటులో ఉంది',
    tonsure: 'కళ్యాణకట్ట (తలనీలాలు)',
    tonsureSub: 'పుష్కరిణి సమీపంలో పవిత్ర తలనీలాలు & స్నానాలు (24/7)',
    tonsureStatus: '24/7 అందుబాటులో ఉంది',
    stay: 'వసతి & PAC హాళ్ళు',
    staySub: 'PAC 1-5 ఉచిత విశ్రాంతి హాళ్ళు & CRO రూమ్ కౌంటర్లు',
    stayStatus: 'హాళ్ళు అందుబాటులో ఉన్నాయి',
    whatDoYouNeed: 'మీకేమి కావాలి?',
    darshanLabel: 'దర్శనం',
    foodLabel: 'భోజనం',
    stayLabel: 'వసతి',
    exploreLabel: 'దర్శనీయ స్థలాలు',
    moreChecklists: 'మరిన్ని సాధనాలు & చెక్‌లిస్టులు'
  }
};

export default function HomePage() {
  const home = useHomeData();
  const { userLocation } = useTrip();
  const lang = useLanguage();
  const t = TEXTS[lang];
  const [showLoreDrawer, setShowLoreDrawer] = useState(false);

  const isLocalUser = userLocation && isWithinTirupatiRegion(userLocation.lat, userLocation.lng);
  const origin = isLocalUser ? userLocation! : TIRUPATI_CENTER;

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

  const PRIMARY_SERVICES = [
    {
      id: 'lockers',
      title: t.lockers,
      subtitle: t.lockersSub,
      status: t.lockersStatus,
      statusColor: '#16A34A',
      icon: Lock,
      image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968161/IMG_6992_cq6gls.jpg',
      link: '/essentials/secure-belongings'
    },
    {
      id: 'meals',
      title: t.meals,
      subtitle: t.mealsSub,
      status: t.mealsStatus,
      statusColor: '#16A34A',
      icon: Utensils,
      image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968272/Annaprasadam-4-copy_lyo86v.jpg',
      link: '/essentials/free-meals'
    },
    {
      id: 'tonsure',
      title: t.tonsure,
      subtitle: t.tonsureSub,
      status: t.tonsureStatus,
      statusColor: '#16A34A',
      icon: Scissors,
      image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968353/painted-sign-board-of-kalyanakatta-balaji-temple-tirupati-andhra-pradesh-F5M0J1_p7hkr5.jpg',
      link: '/essentials/hair-offering'
    },
    {
      id: 'stay',
      title: t.stay,
      subtitle: t.staySub,
      status: t.stayStatus,
      statusColor: '#D97706',
      icon: Bed,
      image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968555/maxresdefault_fwmwke.jpg',
      link: '/essentials/accommodation'
    }
  ];

  return (
    <div className={styles.homeWrapper} style={{ backgroundColor: 'var(--bg-canvas, #FAF8F5)', minHeight: '100vh', width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      
      {/* 📱 MOBILE VIEW (<768px): 3-Layer Information Architecture */}
      <div className={styles.mobileOnly}>
        <div className={styles.mobileStack}>
          
          {/* LAYER 1: HERO DECISION ENGINE & LIVE CROWD STATUS */}
          <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} hideHeader={false} />

          {/* LAYER 2: WHAT DO YOU NEED? (HIGH-CONTRAST 4-ACTION GRID) */}
          <div style={{ padding: '0 14px', marginTop: '8px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.01em' }}>
              {(t as any).whatDoYouNeed || 'What do you need?'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Link
                href="/darshan/sarva-darshan"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  border: '1.5px solid rgba(15, 81, 50, 0.12)',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '22px', flexShrink: 0 }}>🛕</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {(t as any).darshanLabel || 'Darshan'}
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#0F5132' }}>
                    {lang === 'te' ? 'క్యూ వివరాలు' : 'Queue Info'}
                  </div>
                </div>
              </Link>

              <Link
                href="/essentials/free-meals"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  border: '1.5px solid rgba(217, 119, 6, 0.12)',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '22px', flexShrink: 0 }}>🍛</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {(t as any).foodLabel || 'Food'}
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#D97706' }}>
                    {lang === 'te' ? 'అన్నప్రసాదం' : 'Free Meals'}
                  </div>
                </div>
              </Link>

              <Link
                href="/essentials/accommodation"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  border: '1.5px solid rgba(37, 99, 235, 0.12)',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '22px', flexShrink: 0 }}>🏨</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {(t as any).stayLabel || 'Stay'}
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#2563EB' }}>
                    {lang === 'te' ? 'వసతి హాళ్ళు' : 'PAC Rest Halls'}
                  </div>
                </div>
              </Link>

              <Link
                href="/explore"
                style={{
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  border: '1.5px solid rgba(147, 51, 234, 0.12)',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ fontSize: '22px', flexShrink: 0 }}>📍</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    {(t as any).exploreLabel || 'Explore'}
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#9333EA' }}>
                    {lang === 'te' ? 'దర్శనీయ స్థలాలు' : 'Nearby Spots'}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* LAYER 3: NEARBY FOR YOU (PHOTO-FIRST CARD WITH DIRECTIONS CTA) */}
          {nearbyPlaces.length > 0 && (
            <div style={{ padding: '0 14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  {t.nearbyPlaces}
                </h2>
                <Link href="/explore" style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F5132', textDecoration: 'none' }}>
                  {t.seeAll}
                </Link>
              </div>

              {/* Primary Featured Nearby Spot */}
              {(() => {
                const topSpot = nearbyPlaces[0];
                const awayMins = topSpot._dist ? Math.max(4, Math.round(Number(topSpot._dist) * 3)) : 12;
                return (
                  <Link
                    href={`/place/${topSpot.id}`}
                    style={{
                      textDecoration: 'none',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1.5px solid rgba(15, 23, 42, 0.08)',
                      boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.06)',
                      display: 'block'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '140px',
                      backgroundImage: `url(${topSpot.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(6px)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <MapPin size={11} />
                        <span>{awayMins} min away ({topSpot._dist} km)</span>
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                          {topSpot.name}
                        </h3>
                        <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 600 }}>
                          {topSpot.category}
                        </p>
                      </div>
                      <div style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        backgroundColor: '#F0FDF4',
                        color: '#0F5132',
                        fontSize: '12px',
                        fontWeight: 800,
                        border: '1px solid #A7F3D0'
                      }}>
                        {t.navigate}
                      </div>
                    </div>
                  </Link>
                );
              })()}
            </div>
          )}

          {/* LAYER 4: COLLAPSIBLE CHECKLISTS & TOOLS */}
          <div style={{ padding: '0 14px 14px' }}>
            <button
              onClick={() => setShowLoreDrawer(!showLoreDrawer)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(15, 81, 50, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#0F5132" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                  {(t as any).moreChecklists || 'More tools & checklists'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 800, color: '#0F5132' }}>
                <span>{showLoreDrawer ? (lang === 'te' ? 'దాచు' : 'Hide') : (lang === 'te' ? 'చూడు' : 'View')}</span>
                {showLoreDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            {showLoreDrawer && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />
                <YatraChecklist />
                <DailyContent {...home.daily} liveStatus={home.status.liveStatus} variant="mobile" />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 💻 DESKTOP & TABLET VIEW (>=768px): Multi-Column Command Center */}
      <div className={styles.desktopOnly}>
        <div style={{ marginBottom: '20px', padding: '8px 0' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {(() => {
              const hr = new Date().getHours();
              if (hr >= 5 && hr < 12) return lang === 'te' ? 'శుభోదయం' : 'Good Morning';
              if (hr >= 12 && hr < 17) return lang === 'te' ? 'శుభ మధ్యాహ్నం' : 'Good Afternoon';
              if (hr >= 17 && hr < 21) return lang === 'te' ? 'శుభ సాయంత్రం' : 'Good Evening';
              return lang === 'te' ? 'శుభ రాత్రి' : 'Good Night';
            })()}, <span style={{ color: '#0F5132' }}>{home.hero.userName}</span>
          </h1>
          <p style={{ fontSize: '14.5px', color: '#0F5132', margin: 0, fontWeight: 700 }}>
            {lang === 'te' ? 'తిరుమల, తిరుపతి ప్రత్యక్ష యాత్రా సహచరి.' : 'Live pilgrimage companion for Tirumala and Tirupati.'}
          </p>
        </div>

        {/* ROW 1: 2-COLUMN DASHBOARD GRID */}
        <div className={styles.dashboardGrid}>
          {/* COLUMN 1: LIVE DECISION ENGINE & DEVOTIONAL WISDOM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} hideHeader={true} />
            <YatraChecklist />
            <DailyContent {...home.daily} liveStatus={home.status.liveStatus} variant="desktop" />
          </div>

          {/* COLUMN 2: PRIMARY SERVICES + EXPLORE AROUND YOU + SSD TOKEN RADAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Primary Pilgrim Services */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {t.primaryServices}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>
                    {t.servicesSub}
                  </p>
                </div>
                <Link href="/essentials" style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F5132', textDecoration: 'none' }}>
                  {t.seeAll}
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {PRIMARY_SERVICES.map(srv => {
                  const IconComp = srv.icon;
                  return (
                    <Link
                      key={srv.id}
                      href={srv.link}
                      style={{
                        textDecoration: 'none',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        border: '1px solid rgba(15, 23, 42, 0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      <div style={{
                        height: '76px',
                        width: '100%',
                        backgroundImage: `url(${srv.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)'
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '7px',
                          backgroundColor: 'rgba(15, 23, 42, 0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <IconComp size={14} color="#FFFFFF" />
                        </div>
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: srv.statusColor, display: 'block', marginBottom: '2px' }}>
                          ● {srv.status}
                        </span>
                        <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px' }}>
                          {srv.title}
                        </h3>
                        <p style={{ fontSize: '11px', color: '#64748B', margin: 0, lineHeight: 1.3 }}>
                          {srv.subtitle}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Explore Around You (Desktop 3-Column Grid) */}
            {nearbyPlaces.length > 0 && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {t.nearbyPlaces}
                  </h2>
                  <Link href="/explore" style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F5132', textDecoration: 'none' }}>
                    {t.seeAll}
                  </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {nearbyPlaces.slice(0, 6).map(p => (
                    <Link
                      key={p.id}
                      href={`/place/${p.id}`}
                      style={{
                        textDecoration: 'none',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{
                        height: '70px',
                        width: '100%',
                        backgroundImage: `url(${p.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '4px',
                          backgroundColor: 'rgba(15, 23, 42, 0.75)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          color: '#FFFFFF',
                          fontSize: '9.5px',
                          fontWeight: 700
                        }}>
                          <MapPin size={8} />
                          <span>{p._dist} km</span>
                        </div>
                      </div>
                      <div style={{ padding: '6px 8px' }}>
                        <p style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#0F172A',
                          margin: 0,
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {p.name}
                        </p>
                        <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                          {p._dist ? `${Math.max(4, Math.round(Number(p._dist) * 3))} min away` : 'Nearby'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Real-time SSD Free Token Quota, Slots & Counters Checklist */}
            <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}
