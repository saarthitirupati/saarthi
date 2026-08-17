'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Navigation, Landmark, Star, MapPin, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import styles from './JourneyOverviewPanel.module.css';
import { useLanguage } from '@/lib/useLanguage';

export function JourneyOverviewPanel() {
  const lang = useLanguage();

  return (
    <div className={styles.panelContainer}>
      {/* ── HEADER ROW: SAARTHI JOURNEY GUIDE ── */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <div className={styles.iconCircle}>
            <Sparkles size={16} color="#CA8A04" />
          </div>
          <div>
            <h2 className={styles.title}>
              {lang === 'te' ? 'సారథి యాత్రా గైడ్' : 'Saarthi Journey Guide'}
            </h2>
            <p className={styles.subtitle}>
              {lang === 'te' ? 'నేటి ప్రత్యక్ష దర్శన మార్గం & సమయ అంచనాలు' : "Today's live pilgrimage route & time progression"}
            </p>
          </div>
        </div>
        <span className={styles.liveTag}>LIVE PILGRIMAGE ROUTE</span>
      </div>

      {/* ── ACTION RECOMMENDATION BANNER ── */}
      <div className={styles.routeBanner}>
        <div className={styles.bannerIcon}>
          <Sparkles size={14} color="#0F5132" />
        </div>
        <div className={styles.bannerText}>
          <strong>{lang === 'te' ? 'సారథి మార్గదర్శనం: ' : 'Saarthi Recommended Flow: '}</strong>
          <span>
            {lang === 'te' 
              ? 'ఉదయం 5:45కి బయలుదేరండి → 6:30కి ముందే SSD టోకెన్ పొందండి → ప్రశాంత దర్శనం పూర్తిచేసుకోండి.'
              : 'Start morning at 5:45 AM → Reach SSD counter before 6:30 AM → Enter peaceful darshan window.'}
          </span>
        </div>
      </div>

      {/* ── SACRED SEVEN HILLS JOURNEY CANVAS ── */}
      <div className={styles.mapPreview}>
        {/* SVG: Sacred Seshachalam Seven Hills Silhouette & Ascending Path */}
        <svg className={styles.svgOverlay} viewBox="0 0 700 280" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Stars in Night Sky */}
          <circle cx="120" cy="30" r="1.5" fill="rgba(255,255,255,0.4)" />
          <circle cx="280" cy="20" r="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="450" cy="35" r="1.5" fill="rgba(255,255,255,0.4)" />
          <circle cx="580" cy="15" r="2" fill="rgba(253,224,71,0.5)" />

          {/* Deep Seven Hills Mountain Silhouettes */}
          <path d="M-50 280 L-50 170 Q80 130, 200 160 T420 100 T650 60 T750 40 L750 280 Z" fill="rgba(15, 81, 50, 0.15)" />
          <path d="M-50 280 L-50 210 Q140 160, 280 190 T540 110 T750 70 L750 280 Z" fill="rgba(15, 23, 42, 0.65)" />
          <path d="M-50 280 L-50 240 Q180 200, 360 210 T620 140 T750 100 L750 280 Z" fill="rgba(10, 17, 40, 0.85)" />

          {/* Golden Aura / Glow around Tirumala Sanctum Peak */}
          <circle cx="620" cy="48" r="45" fill="url(#goldenGlow)" />

          {/* Ascending Pilgrimage Route (Ghat Road Glow) */}
          <path 
            d="M 60 230 C 140 230, 160 170, 240 165 C 340 160, 420 110, 520 90 C 580 80, 610 50, 640 45" 
            stroke="#10B981" 
            strokeWidth="3.5" 
            strokeDasharray="6 5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.7))' }}
          />

          <defs>
            <radialGradient id="goldenGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* 📍 STEP 0: YOU ARE HERE */}
        <div className={`${styles.stationCard} ${styles.posOrigin}`}>
          <div className={styles.stationHeader}>
            <div className={styles.pulsingUserDot} />
            <span className={styles.stationName}>
              {lang === 'te' ? '📍 మీరు ఇక్కడ ఉన్నారు' : '📍 You are here'}
            </span>
          </div>
          <div className={styles.stationDetails}>
            <span style={{ color: '#93C5FD' }}>
              {lang === 'te' ? 'తిరుపతి (కొండ దిగువన)' : 'Tirupati Foothills'}
            </span>
          </div>
        </div>

        {/* 🟢 STEP 1: ALIPIRI CHECKPOST (RECOMMENDED START) */}
        <div className={`${styles.stationCard} ${styles.posAlipiri} ${styles.recommendedStation}`}>
          <div className={styles.stationHeader}>
            <div className={styles.statusDot} style={{ background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span className={styles.stationName}>Alipiri Base</span>
          </div>
          <div className={styles.stationDetails}>
            <span style={{ color: '#34D399' }}>🟢 Clear · 10 min drive</span>
          </div>
          <div className={styles.recBadge}>
            <Star size={10} color="#FBBF24" fill="#FBBF24" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
            <span>Recommended Start</span>
          </div>
        </div>

        {/* 🟡 STEP 2: SSD TOKEN COUNTERS */}
        <div className={`${styles.stationCard} ${styles.posSSD}`}>
          <div className={styles.stationHeader}>
            <div className={styles.statusDot} style={{ background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
            <span className={styles.stationName}>SSD Counters</span>
          </div>
          <div className={styles.stationDetails}>
            <span style={{ color: '#FCD34D' }}>🟡 2 hr queue · Issuing</span>
          </div>
        </div>

        {/* 🔴 STEP 3: TIRUMALA SANCTUM (HILL TOP) */}
        <div className={`${styles.stationCard} ${styles.posSanctum}`}>
          <div className={styles.stationHeader}>
            <div className={styles.statusDot} style={{ background: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
            <span className={styles.stationName}>
              <Landmark size={13} color="#FDE047" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Tirumala Sanctum
            </span>
          </div>
          <div className={styles.stationDetails}>
            <span style={{ color: '#FCA5A5' }}>🔴 12+ hr wait · Heavy Rush</span>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE JOURNEY CTA BUTTON ── */}
      <Link 
        href="/route" 
        className={styles.ctaButton}
      >
        <Navigation size={15} />
        <span>{lang === 'te' ? 'ప్రత్యక్ష యాత్రా మ్యాప్ & నేవిగేషన్ చూడండి →' : 'View Full Live Route & Turn-by-Turn GPS →'}</span>
      </Link>
    </div>
  );
}
