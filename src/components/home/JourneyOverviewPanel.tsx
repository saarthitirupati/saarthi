'use client';

import React from 'react';
import Link from 'next/link';
import { Map, Sparkles, Navigation, Landmark, Star } from 'lucide-react';
import styles from './JourneyOverviewPanel.module.css';

export function JourneyOverviewPanel() {
  return (
    <div className={styles.panelContainer}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>
          <Map size={18} style={{ color: '#0F5132' }} />
          <span>Journey Overview Map</span>
        </h2>
        <span className={styles.liveTag}>LIVE RADAR</span>
      </div>

      <div className={styles.mapPreview}>
        {/* Terrain Contours & Connected S-Curve Route SVG */}
        <svg className={styles.svgOverlay} viewBox="0 0 500 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Tirumala Hill Contour Lines */}
          <path d="M-20 200 C100 180, 220 210, 320 150 C380 115, 460 70, 520 60" stroke="rgba(212,175,55,0.09)" strokeWidth="30" strokeLinecap="round" />
          <path d="M-20 240 C140 210, 260 230, 360 170 C420 130, 480 90, 520 80" stroke="rgba(16,185,129,0.07)" strokeWidth="40" strokeLinecap="round" />

          {/* Connected Curved Ghat Road Path */}
          <path 
            d="M 60 190 C 130 190, 180 130, 240 120 C 310 110, 370 50, 430 45" 
            stroke="#10B981" 
            strokeWidth="3.5" 
            strokeDasharray="6 5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))' }}
          />

          {/* Subtle Waypoint Connecting Lines */}
          <line x1="60" y1="190" x2="240" y2="120" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="240" y1="120" x2="430" y2="45" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        {/* STATION 1: Alipiri Checkpost (Recommended Start) */}
        <div className={`${styles.stationCard} ${styles.posAlipiri} ${styles.recommendedStation}`}>
          <div className={styles.stationHeader}>
            <div className={styles.statusDot} style={{ background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span className={styles.stationName}>Alipiri Checkpost</span>
          </div>
          <div className={styles.stationDetails}>
            <span style={{ color: '#34D399' }}>Status: Clear · 10m</span>
          </div>
          <div className={styles.recBadge}>
            <Star size={11} color="#FBBF24" fill="#FBBF24" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
            <span>Recommended Start</span>
          </div>
        </div>

        {/* STATION 2: SSD Token Counters */}
        <div className={`${styles.stationCard} ${styles.posSSD}`}>
          <div className={styles.stationHeader}>
            <div className={styles.statusDot} style={{ background: '#F59E0B' }} />
            <span className={styles.stationName}>SSD Counters</span>
          </div>
          <div className={styles.stationDetails}>
            <span style={{ color: '#FCD34D' }}>Wait: 2 hrs · Issuing</span>
          </div>
        </div>

        {/* STATION 3: Tirumala Sanctum */}
        <div className={`${styles.stationCard} ${styles.posSanctum}`}>
          <div className={styles.stationHeader}>
            <div className={styles.statusDot} style={{ background: '#EF4444' }} />
            <span className={styles.stationName}>
              <Landmark size={13} color="#F8FAFC" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Tirumala Temple
            </span>
          </div>
          <div className={styles.stationDetails}>
            <span style={{ color: '#FCA5A5' }}>Wait: 12+ hrs · Heavy</span>
          </div>
        </div>
      </div>

      <Link 
        href="/explore" 
        className={styles.ctaButton}
      >
        <Navigation size={15} />
        <span>View Live Journey Map →</span>
      </Link>
    </div>
  );
}
