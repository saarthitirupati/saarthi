'use client';

import Link from 'next/link';
import { MapPin, Lock, Utensils, Scissors, Bed, ChevronRight, Sparkles, BookOpen, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useHomeData } from '@/hooks/useHomeData';
import { useTrip } from '@/components/TripContext';
import { LoadingState } from '@/components/common/LoadingState';
import { calculateDrivingDistance, TIRUPATI_CENTER, isWithinTirupatiRegion, formatDistance } from '@/lib/location';
import { getISTDate } from '@/utils/location';
import { useLanguage } from '@/lib/useLanguage';
import {
  HomeHero,
  RecommendationCard,
  DailyContent,
  QuickChecklist,
  YatraChecklist,
  DesktopSidebarWidget,
  HomeSkeleton
} from '@/components/home';
import styles from './Home.module.css';

const TEXTS = {
  en: {
    loading: 'Loading your Saarthi...',
    primaryServices: 'What You Need Right Now',
    servicesSub: 'Essential pilgrim facilities',
    nearbyPlaces: 'Explore Around You',
    seeAll: 'See all →',
    navigate: 'Navigate →',
    openDrawer: 'More for your pilgrimage',
    closeDrawer: 'Close',
    lockers: 'Lockers & Luggage',
    lockersSub: 'Deposit phones & bags before queue',
    lockersStatus: '6 Locations Open',
    meals: 'Free Annaprasadam',
    mealsSub: 'Free hot meals at Vengamamba',
    mealsStatus: 'Serving Continuously',
    tonsure: 'Kalyana Katta (Tonsure)',
    tonsureSub: 'Sacred hair offering before darshan',
    tonsureStatus: 'Open 24/7',
    stay: 'Stay & PAC Halls',
    staySub: 'Free resting & hot water halls',
    stayStatus: 'Halls Available'
  },
  te: {
    loading: 'మీ సారథి లోడ్ అవుతోంది...',
    primaryServices: 'మీకు ఇప్పుడు అవసరమైనవి',
    servicesSub: 'ముఖ్యమైన యాత్రా సదుపాయాలు',
    nearbyPlaces: 'మీ చుట్టూ ఉన్న ప్రదేశాలు',
    seeAll: 'అన్నీ చూడండి →',
    navigate: 'మార్గం →',
    openDrawer: 'మరిన్ని వివరాలు & సమాచారం',
    closeDrawer: 'మూసివేయి',
    lockers: 'లాకర్లు & లగేజీ',
    lockersSub: 'క్యూ లోకి వెళ్లేముందు ఫోన్లు, లగేజీ డిపాజిట్ చేయండి',
    lockersStatus: '6 కేంద్రాలు ఓపెన్',
    meals: 'ఉచిత అన్నప్రసాదం',
    mealsSub: 'వెంగమాంబ సముదాయంలో ఉచిత భోజనం',
    mealsStatus: 'అందుబాటులో ఉంది',
    tonsure: 'కళ్యాణకట్ట (తలనీలాలు)',
    tonsureSub: 'దర్శనానికి ముందు ఉచిత తలనీలాల సమర్పణ',
    tonsureStatus: '24/7 అందుబాటులో ఉంది',
    stay: 'వసతి & PAC హాళ్ళు',
    staySub: 'ఉచిత విశ్రాంతి హాళ్ళు & వేడి నీటి స్నానాలు',
    stayStatus: 'హాళ్ళు అందుబాటులో ఉన్నాయి'
  }
};

export default function HomePage() {
  const home = useHomeData();
  const { userLocation } = useTrip();
  const lang = useLanguage();
  const t = TEXTS[lang];
  const [showLoreDrawer, setShowLoreDrawer] = useState(false);

  const origin = userLocation || TIRUPATI_CENTER;

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
    return <HomeSkeleton />;
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
          
          {/* LAYER 1: HERO DECISION ENGINE & GUIDANCE */}
          <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} hideHeader={false} />

          {/* LAYER 2: SSD TOKEN STATUS & COLLECTION CENTRES (IMMEDIATELY AFTER CROWD DETAILS) */}
          <div style={{ marginTop: '4px', marginBottom: '8px' }}>
            <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />
          </div>

          {/* LAYER 2.5: YATRA ESSENTIALS COMPLIANCE CHECKLIST */}
          <YatraChecklist />

          {/* LAYER 3: PRIMARY PILGRIM SERVICES (ACT) */}
          <div style={{ padding: '0 14px', marginTop: '2px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                  {t.primaryServices}
                </h2>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '1px 0 0 0', fontWeight: 500 }}>
                  {t.servicesSub}
                </p>
              </div>
              <Link href="/essentials" style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F5132', textDecoration: 'none' }}>
                {t.seeAll}
              </Link>
            </div>

            {/* 2x2 Action Grid with Soft Elevation & Responsive Auto-Fit */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px' }}>
              {PRIMARY_SERVICES.map(srv => {
                const IconComp = srv.icon;
                return (
                  <Link
                    key={srv.id}
                    href={srv.link}
                    style={{
                      textDecoration: 'none',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(15, 23, 42, 0.06)',
                      boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 0,
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{
                      height: '74px',
                      width: '100%',
                      backgroundImage: `url(${srv.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#F1F5F9',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)'
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '7px',
                        backgroundColor: 'rgba(15, 81, 50, 0.88)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComp size={13} color="#FFFFFF" />
                      </div>
                    </div>

                    <div style={{ padding: '8px 10px 10px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: srv.statusColor,
                        marginBottom: '2px'
                      }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                        <span>{srv.status}</span>
                      </span>
                      <h3 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px', lineHeight: 1.25 }}>
                        {srv.title}
                      </h3>
                      <p style={{ fontSize: '10.5px', color: '#64748B', margin: '0 0 6px', lineHeight: 1.25, fontWeight: 500 }}>
                        {srv.subtitle}
                      </p>
                      <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0F5132', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <span>{t.navigate}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* LAYER 4: EXPLORE AROUND YOU (PHOTO-FIRST CARDS) */}
          {nearbyPlaces.length > 0 && (
            <div style={{ padding: '0 0 16px' }}>
              <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <p style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.2px', margin: 0 }}>
                  {t.nearbyPlaces}
                </p>
                <Link href="/explore" style={{ fontSize: '11px', fontWeight: 800, color: '#0F5132', textDecoration: 'none' }}>
                  {t.seeAll}
                </Link>
              </div>
              <div className="noScrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 14px 4px', scrollbarWidth: 'none', msOverflowStyle: 'none' as any, WebkitOverflowScrolling: 'touch' }}>
                {nearbyPlaces.map(p => (
                  <Link 
                    key={p.id} 
                    href={`/place/${p.id}`} 
                    style={{ 
                      textDecoration: 'none', 
                      flexShrink: 0, 
                      width: 'clamp(138px, 40vw, 150px)',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid rgba(15, 23, 42, 0.06)',
                      boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.02)'
                    }}
                  >
                    {/* PHOTO BANNER */}
                    <div style={{
                      width: '100%', 
                      height: '84px', 
                      backgroundImage: `url(${p.image})`, 
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center',
                      backgroundColor: '#E2E8F0',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '5px',
                        backgroundColor: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(4px)',
                        padding: '2px 6px',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        color: '#FFFFFF',
                        fontSize: '9.5px',
                        fontWeight: 700
                      }}>
                        <MapPin size={9} />
                        <span>{p._dist} km</span>
                      </div>
                    </div>

                    <div style={{ padding: '7px 8px 9px' }}>
                      <p style={{
                        fontSize: '12px', 
                        fontWeight: 800, 
                        color: '#0F172A', 
                        margin: '0 0 2px', 
                        lineHeight: 1.25,
                        height: '2.5em',
                        overflow: 'hidden', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical' as const
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

          {/* LAYER 5: DEVOTIONAL TRADITIONS & SACRED LORE (Single Consolidated Drawer) */}
          <div style={{ padding: '0 14px 14px' }}>
            <button
              onClick={() => setShowLoreDrawer(!showLoreDrawer)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(200, 155, 60, 0.3)',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 6px 20px -4px rgba(200, 155, 60, 0.08), 0 2px 6px rgba(15, 23, 42, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#FEF9C3', border: '1px solid #FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={13} color="#CA8A04" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', display: 'block', lineHeight: 1.2 }}>
                    {lang === 'te' ? 'స్వామివారి విశేషాలు & ఆధ్యాత్మిక విశేషాలు' : 'Sacred Lore, Chants & Traditions'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#854D0E', fontWeight: 600 }}>
                    {lang === 'te' ? 'నేటి సుప్రభాతం, శ్లోకాలు, ప్రసాద విశేషాలు' : 'Daily Shloka, Suprabhatam & Tirumala lore'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 800, color: '#0F5132' }}>
                <span>{showLoreDrawer ? (lang === 'te' ? 'దాచు' : 'Hide') : (lang === 'te' ? 'చూడు' : 'View')}</span>
                {showLoreDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            {showLoreDrawer && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <DailyContent {...home.daily} liveStatus={home.status.liveStatus} variant="mobile" />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 💻 DESKTOP & TABLET VIEW (>=768px): Multi-Column Command Center */}
      <div className={styles.desktopOnly}>
        <div style={{ marginBottom: '20px', padding: '8px 0' }}>
          <h1 suppressHydrationWarning style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {(() => {
              const hr = getISTDate().getHours();
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
          {/* COLUMN 1: LIVE DECISION ENGINE & DEVOTIONAL WISDOM & EXPLORE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <HomeHero {...home.hero} liveStatus={home.status.liveStatus} activeAlertsCount={home.alerts.activeAlertsCount} hideHeader={true} />
            <YatraChecklist />
            <DailyContent {...home.daily} liveStatus={home.status.liveStatus} variant="desktop" />

            {/* Explore Around You (Desktop Balanced Grid) */}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
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
                        flexDirection: 'column',
                        minWidth: 0
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
                          <span>{formatDistance(p._dist, lang)}</span>
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
          </div>

          {/* COLUMN 2: PRIMARY SERVICES + SSD TOKEN RADAR + DESKTOP SIDEBAR DECK */}
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
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
                        minWidth: 0,
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
                        <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 6px', lineHeight: 1.3 }}>
                          {srv.subtitle}
                        </p>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F5132', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <span>{t.navigate}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Real-time SSD Free Token Quota, Slots & Counters Checklist */}
            <QuickChecklist {...home.checklist} liveStatus={home.status.liveStatus} />

            {/* Desktop Column 2 Fill: Annaprasadam, Helpline Deck & Trek Radar */}
            <DesktopSidebarWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
