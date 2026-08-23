'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Check, 
  Footprints, 
  PhoneCall, 
  Sparkles, 
  Shield, 
  Compass
} from 'lucide-react';
import styles from './OfflineTempleMap.module.css';
import { getTempleLayout, MapPin } from '@/data/templeLayouts';

interface OfflineTempleMapProps {
  placeId: string;
  place?: any;
  lang?: string;
  isTemple?: boolean;
  coordinates?: { lat: number; lng: number };
}

const CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string; fill: string; icon: string }> = {
  sanctum: { bg: '#FEF3C7', border: '#D97706', text: '#92400E', fill: '#F59E0B', icon: '🛕' },
  queue: { bg: '#DBEAFE', border: '#2563EB', text: '#1E40AF', fill: '#3B82F6', icon: '🚶' },
  laddu: { bg: '#FEF9C3', border: '#CA8A04', text: '#854D0E', fill: '#EAB308', icon: '🟡' },
  footwear: { bg: '#F1F5F9', border: '#64748B', text: '#334155', fill: '#64748B', icon: '👟' },
  food: { bg: '#DCFCE7', border: '#16A34A', text: '#166534', fill: '#22C55E', icon: '🍲' },
  medical: { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B', fill: '#EF4444', icon: '🏥' },
  safari: { bg: '#FFEDD5', border: '#EA580C', text: '#9A3412', fill: '#F97316', icon: '🦁' },
  entry: { bg: '#E0E7FF', border: '#4F46E5', text: '#3730A3', fill: '#6366F1', icon: '🚪' },
  parking: { bg: '#F3E8FF', border: '#9333EA', text: '#6B21A8', fill: '#A855F7', icon: '🅿️' },
  info: { bg: '#ECFDF5', border: '#0F5132', text: '#0F5132', fill: '#10B981', icon: 'ℹ️' }
};

function renderMapSvgIcon(category: string, pinId: string = '', color: string = '#D97706') {
  if (pinId.includes('dhwaja') || pinId.includes('flag')) {
    return (
      <g stroke={color} strokeWidth="1.2" fill="none">
        <line x1="2.5" y1="1" x2="2.5" y2="11" />
        <polygon points="2.5,2 9.5,4.5 2.5,7" fill={color} />
      </g>
    );
  }
  if (pinId.includes('shrine') || pinId.includes('shiva') || pinId.includes('parvathi') || category === 'sanctum') {
    return (
      <g fill={color} stroke={color} strokeWidth="0.5">
        <polygon points="6,1 1.5,10.5 10.5,10.5" />
        <rect x="4.5" y="8.5" width="3" height="2.5" fill="#FFFFFF" />
      </g>
    );
  }
  if (category === 'parking') {
    return (
      <g fill={color}>
        <rect x="1" y="1" width="10" height="10" rx="2.5" fill={color} />
        <text x="6" y="8.5" fill="#FFFFFF" fontSize="7.5" fontWeight="900" textAnchor="middle">P</text>
      </g>
    );
  }
  if (category === 'entry') {
    return (
      <g stroke={color} strokeWidth="1.2" fill="none">
        <path d="M 2 11 L 2 4 Q 6 1 10 4 L 10 11" />
        <line x1="6" y1="1" x2="6" y2="11" />
      </g>
    );
  }
  if (category === 'footwear') {
    return (
      <g fill={color}>
        <ellipse cx="6" cy="7" rx="4.5" ry="2.5" />
        <rect x="3.5" y="4.5" width="5" height="3" rx="1.5" fill={color} />
      </g>
    );
  }
  if (category === 'laddu' || category === 'food') {
    return (
      <g fill={color} stroke={color} strokeWidth="0.6">
        <path d="M 2 6 Q 6 11 10 6 Z" fill={color} />
        <circle cx="6" cy="4" r="1.5" fill={color} />
      </g>
    );
  }
  if (category === 'queue') {
    return (
      <g stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round">
        <circle cx="6" cy="3" r="1.5" fill={color} />
        <line x1="6" y1="4.5" x2="6" y2="8" />
        <line x1="6" y1="8" x2="4" y2="11" />
        <line x1="6" y1="8" x2="8" y2="11" />
      </g>
    );
  }
  if (category === 'medical') {
    return (
      <g fill={color}>
        <rect x="4.5" y="1.5" width="3" height="9" rx="1" />
        <rect x="1.5" y="4.5" width="9" height="3" rx="1" />
      </g>
    );
  }
  return (
    <g stroke={color} strokeWidth="1.2" fill="none">
      <circle cx="6" cy="6" r="4.5" />
      <circle cx="6" cy="6" r="1.5" fill={color} />
    </g>
  );
}

export default function OfflineTempleMap({ 
  placeId, 
  place,
  lang = 'en', 
  isTemple = true,
  coordinates 
}: OfflineTempleMapProps) {
  const layout = React.useMemo(() => getTempleLayout(place || placeId, coordinates), [place, placeId, coordinates]);
  const [activePin, setActivePin] = useState<MapPin>(layout.pins[0] || null);
  const [isCached, setIsCached] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update active pin when layout changes
  useEffect(() => {
    if (layout.pins && layout.pins.length > 0) {
      setActivePin(layout.pins[0]);
    }
  }, [layout]);

  // Check LocalStorage cache status
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`saarthi_offline_map_${placeId}`);
      setIsCached(!!cached);
    } catch {
      // safe fallback
    }
  }, [placeId]);

  // Save for Offline Action
  const handleSaveOffline = () => {
    setIsSaving(true);
    try {
      localStorage.setItem(`saarthi_offline_map_${placeId}`, JSON.stringify({
        placeId,
        savedAt: new Date().toISOString(),
        layout
      }));
      setTimeout(() => {
        setIsSaving(false);
        setIsCached(true);
      }, 350);
    } catch {
      setIsSaving(false);
      setIsCached(true);
    }
  };

  // Convert array of [x, y] waypoints into SVG polyline path string
  const routePathString = React.useMemo(() => {
    if (!layout.routePath || layout.routePath.length === 0) return '';
    return layout.routePath.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ');
  }, [layout.routePath]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.badge}>
            <Compass size={13} />
            {isCached 
              ? (lang === 'te' ? 'ఆఫ్‌లైన్ సిద్ధంగా ఉంది (సిగ్నల్ లేకున్నా పనిచేస్తుంది)' : 'Offline Ready (Saved in Device)')
              : (lang === 'te' ? 'ఆఫ్‌లైన్ ప్రాంగణ వెక్టర్ మ్యాప్' : 'Offline Precinct Vector Map')}
          </span>
          <h2 className={styles.title}>
            {lang === 'te' ? layout.titleTe : layout.titleEn}
          </h2>
        </div>

        <button 
          onClick={handleSaveOffline}
          className={`${styles.saveBtn} ${isCached ? styles.saveBtnSaved : styles.saveBtnUnsaved}`}
          title="Save vector layout for offline use"
        >
          {isCached ? (
            <>
              <Check size={14} />
              <span>{lang === 'te' ? 'సేవ్ చేయబడింది' : 'Saved Offline'}</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>{isSaving ? (lang === 'te' ? 'సేవ్ చేస్తోంది...' : 'Saving...') : (lang === 'te' ? 'ఆఫ్‌లైన్ కోసం సేవ్' : 'Save for Offline')}</span>
            </>
          )}
        </button>
      </div>

      {/* Illustrated Architectural Vector Canvas */}
      <div className={styles.vectorMapWrapper}>
        <svg 
          className={styles.svgCanvas} 
          viewBox="0 0 540 340" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBF9F5" />
              <stop offset="100%" stopColor="#F2EEE5" />
            </linearGradient>

            <linearGradient id="sanctumGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#CA8A04" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="goldVimana" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="rockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8A29E" />
              <stop offset="50%" stopColor="#78716C" />
              <stop offset="100%" stopColor="#57534E" />
            </linearGradient>

            <linearGradient id="waterTankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.75" />
            </linearGradient>

            <pattern id="stonePavement" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(180, 83, 9, 0.05)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background Canvas */}
          <rect width="540" height="340" fill="url(#groundGrad)" />
          <rect width="540" height="340" fill="url(#stonePavement)" />

          {/* ═══════════════════════════════════════════════════
              ARCHITECTURAL BACKDROPS MATCHING SPECIFIC CATEGORIES
              ═══════════════════════════════════════════════════ */}
          {layout.layoutType === 'botanical-garden' ? (
            /* 1. SACRED BOTANICAL GARDENS (Srivari Udyanavanam / TTD Flower Gardens) */
            <g>
              {/* Lush Garden Foundation */}
              <rect x="35" y="25" width="470" height="285" rx="16" fill="#F2FAF2" stroke="#22C55E" strokeWidth="2" />

              {/* Central Srivari Seva Flower Nursery Beds */}
              <circle cx="270" cy="110" r="50" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" />
              <circle cx="270" cy="110" r="32" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
              <circle cx="270" cy="110" r="14" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.2" />

              {/* Colorful Flower Bed Petals / Rings */}
              <circle cx="245" cy="110" r="5" fill="#EF4444" />
              <circle cx="295" cy="110" r="5" fill="#EF4444" />
              <circle cx="270" cy="85" r="5" fill="#F59E0B" />
              <circle cx="270" cy="135" r="5" fill="#F59E0B" />

              <circle cx="252" cy="92" r="4" fill="#EC4899" />
              <circle cx="288" cy="92" r="4" fill="#EC4899" />
              <circle cx="252" cy="128" r="4" fill="#8B5CF6" />
              <circle cx="288" cy="128" r="4" fill="#8B5CF6" />

              {/* Sacred Tulsi Polyhouses & Greenhouses (North-West) */}
              <g transform="translate(85, 65)">
                <rect x="0" y="0" width="85" height="60" rx="8" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 2" />
                <line x1="0" y1="30" x2="85" y2="30" stroke="#38BDF8" strokeWidth="1" />
                <line x1="42" y1="0" x2="42" y2="60" stroke="#38BDF8" strokeWidth="1" />
              </g>

              {/* Topiary Promenade & Shankha-Chakra Topiary (South-West) */}
              <g transform="translate(100, 175)">
                <rect x="0" y="0" width="120" height="50" rx="8" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
                <circle cx="35" cy="25" r="12" fill="#22C55E" stroke="#15803D" strokeWidth="1.2" />
                <circle cx="85" cy="25" r="12" fill="#22C55E" stroke="#15803D" strokeWidth="1.2" />
              </g>

              {/* Thomala Garland Making Pavilion (North-East) */}
              <rect x="340" y="115" width="90" height="52" rx="8" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />

              {/* Winding Paved Garden Walkway */}
              <path d="M 270 270 Q 160 210 270 110 Q 380 110 380 160" fill="none" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 270 270 Q 160 210 270 110 Q 380 110 380 160" fill="none" stroke="#E2E8F0" strokeWidth="10" strokeDasharray="3 3" strokeLinecap="round" />

              {/* Divya Udyanavanam Welcome Floral Gate (South) */}
              <rect x="215" y="262" width="110" height="28" rx="6" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
            </g>
          ) : layout.layoutType === 'annaprasadam-complex' ? (
            /* 1. MATRUSRI TARIGONDA VENGAMAMBA ANNAPRASADAM COMPLEX */
            <g>
              {/* Complex Ground Foundation */}
              <rect x="35" y="25" width="470" height="285" rx="16" fill="#FFFDF8" stroke="#16A34A" strokeWidth="2" />

              {/* 4 Grand Dining Halls Block */}
              <rect x="120" y="60" width="300" height="110" rx="10" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.8" />

              {/* Dining Hall Rows & Service Counters */}
              <line x1="140" y1="85" x2="400" y2="85" stroke="#86EFAC" strokeWidth="6" strokeLinecap="round" />
              <line x1="140" y1="115" x2="400" y2="115" stroke="#86EFAC" strokeWidth="6" strokeLinecap="round" />
              <line x1="140" y1="145" x2="400" y2="145" stroke="#86EFAC" strokeWidth="6" strokeLinecap="round" />

              {/* Automated Steam Mega Kitchen Annex (North-East) */}
              <g transform="translate(345, 55)">
                <rect x="0" y="0" width="90" height="50" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                <circle cx="25" cy="25" r="10" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
                <circle cx="65" cy="25" r="10" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
              </g>

              {/* Devotee Holding Lounge & Wash Station (South-West) */}
              <rect x="90" y="185" width="140" height="55" rx="8" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
              {/* Wash Station Faucets */}
              <circle cx="115" cy="230" r="3" fill="#3B82F6" />
              <circle cx="135" cy="230" r="3" fill="#3B82F6" />
              <circle cx="155" cy="230" r="3" fill="#3B82F6" />
              <circle cx="175" cy="230" r="3" fill="#3B82F6" />

              {/* Tarigonda Vengamamba Statue & Donor Office (South-East) */}
              <rect x="335" y="185" width="110" height="50" rx="8" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />

              {/* Grand Entrance Foyer (South) */}
              <rect x="215" y="262" width="110" height="28" rx="6" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
            </g>
          ) : layout.layoutType === 'sacred-pushkarini' ? (
            /* 2. SACRED PUSHKARINI & HOLY THEERTHAM LAKE (Swami Pushkarini, Papavinasam, Akasa Ganga) */
            <g>
              {/* Outer Promenade Pavement */}
              <rect x="40" y="30" width="460" height="270" rx="16" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2" strokeDasharray="8 3" />

              {/* Stepped Ghats Tier 1 */}
              <rect x="90" y="55" width="360" height="195" rx="12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Stepped Ghats Tier 2 */}
              <rect x="120" y="70" width="300" height="165" rx="8" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.2" />
              {/* Stepped Ghats Tier 3 */}
              <rect x="145" y="85" width="250" height="135" rx="6" fill="#94A3B8" stroke="#475569" strokeWidth="1" />

              {/* Holy Water Tank Center */}
              <rect x="165" y="98" width="210" height="110" rx="6" fill="url(#waterTankGrad)" stroke="#0284C7" strokeWidth="2" />
              
              {/* Sacred Water Ripples */}
              <path d="M 190 130 Q 215 125 240 130 Q 265 135 290 130 Q 315 125 340 130" stroke="#BAE6FD" strokeWidth="1.5" fill="none" opacity="0.7" />
              <path d="M 200 170 Q 225 165 250 170 Q 275 175 300 170 Q 325 165 350 170" stroke="#BAE6FD" strokeWidth="1.5" fill="none" opacity="0.7" />

              {/* Central Neerazhi Floating Mandapam Pavilion */}
              <g transform="translate(255, 138)">
                <rect x="0" y="0" width="30" height="28" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                <polygon points="15,-6 4,0 26,0" fill="#CA8A04" stroke="#78350F" strokeWidth="1" />
                <circle cx="15" cy="14" r="3" fill="#B45309" />
              </g>

              {/* Sri Varahaswamy Shrine on North-West Bank */}
              <g transform="translate(115, 55)">
                <circle cx="25" cy="25" r="24" fill="url(#sanctumGlow)" />
                <rect x="5" y="5" width="40" height="40" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                <polygon points="25,8 10,35 40,35" fill="url(#goldVimana)" stroke="#92400E" strokeWidth="1" />
              </g>

              {/* Footwear & Changing Rooms (South-West) */}
              <rect x="120" y="225" width="80" height="30" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />

              {/* Connecting Pathway to Srivari Temple (East) */}
              <rect x="360" y="140" width="65" height="40" rx="6" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.2" />

              {/* Main Entrance Gateway (South) */}
              <rect x="225" y="262" width="90" height="26" rx="6" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
            </g>
          ) : layout.layoutType === 'dam-reservoir' ? (
            /* 2. DAMS, RESERVOIRS & LAKES (Mallimadugu Dam, Kalyani Dam) */
            <g>
              {/* Seshachalam Mountain Foothill Backdrop */}
              <path d="M 20 130 Q 140 40 270 70 Q 400 40 520 130 L 520 320 L 20 320 Z" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.5" />
              <path d="M 40 90 Q 150 20 270 40 Q 390 20 500 90" fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />

              {/* Massive Blue Reservoir Backwaters */}
              <path d="M 40 140 Q 150 80 270 95 Q 390 80 500 140 Q 480 230 380 220 Q 270 210 160 220 Q 60 230 40 140 Z" fill="url(#waterTankGrad)" stroke="#0284C7" strokeWidth="2.5" />

              {/* Water Surface Ripples */}
              <path d="M 120 140 Q 160 132 200 140 Q 240 148 280 140 Q 320 132 360 140 Q 400 148 440 140" stroke="#BAE6FD" strokeWidth="1.8" fill="none" opacity="0.8" />
              <path d="M 150 170 Q 190 162 230 170 Q 270 178 310 170 Q 350 162 390 170" stroke="#BAE6FD" strokeWidth="1.8" fill="none" opacity="0.8" />

              {/* Dam Embankment / Crest Masonry Bund */}
              <path d="M 90 235 L 450 235 L 440 255 L 100 255 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
              <line x1="100" y1="245" x2="440" y2="245" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="6 4" />

              {/* Spillway Sluice / Siphon Gates (West) */}
              <g transform="translate(130, 225)">
                <rect x="0" y="0" width="70" height="36" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
                <line x1="14" y1="5" x2="14" y2="31" stroke="#0F172A" strokeWidth="2" />
                <line x1="28" y1="5" x2="28" y2="31" stroke="#0F172A" strokeWidth="2" />
                <line x1="42" y1="5" x2="42" y2="31" stroke="#0F172A" strokeWidth="2" />
                <line x1="56" y1="5" x2="56" y2="31" stroke="#0F172A" strokeWidth="2" />
                {/* Downstream discharge stream */}
                <path d="M 10 36 Q 35 65 20 85" stroke="#38BDF8" strokeWidth="6" fill="none" opacity="0.7" />
                <path d="M 40 36 Q 55 65 45 85" stroke="#38BDF8" strokeWidth="6" fill="none" opacity="0.7" />
              </g>

              {/* Scenic Viewpoint & Photography Deck (East) */}
              <g transform="translate(365, 85)">
                <rect x="0" y="0" width="80" height="42" rx="8" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
                <circle cx="40" cy="21" r="10" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
              </g>

              {/* Approach Road & Parking Area (South) */}
              <rect x="290" y="265" width="100" height="26" rx="6" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
            </g>
          ) : layout.layoutType === 'geo-nature-park' ? (
            /* 3. GEOLOGICAL & BOTANICAL PARK (Silathoranam Natural Rock Arch & Park) */
            <g>
              {/* Botanical Park Base */}
              <rect x="40" y="30" width="460" height="270" rx="16" fill="#F4FBF4" stroke="#86EFAC" strokeWidth="2" />
              
              {/* Landscaped Tree Clusters */}
              <circle cx="90" cy="80" r="22" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.2" />
              <circle cx="110" cy="100" r="18" fill="#BBF7D0" stroke="#16A34A" strokeWidth="1.2" />
              <circle cx="450" cy="80" r="22" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.2" />
              <circle cx="430" cy="100" r="18" fill="#BBF7D0" stroke="#16A34A" strokeWidth="1.2" />

              {/* Paved Garden Walkway Promenade */}
              <path d="M 270 270 Q 170 220 170 170 Q 170 110 270 90 Q 370 110 380 160" fill="none" stroke="#CBD5E1" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 270 270 Q 170 220 170 170 Q 170 110 270 90 Q 370 110 380 160" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeDasharray="3 3" strokeLinecap="round" />

              {/* Natural Rock Arch Formation (Silathoranam) */}
              <g transform="translate(195, 45)">
                {/* Left Pillar */}
                <path d="M 20 70 L 25 25 Q 35 15 50 15 L 50 70 Z" fill="url(#rockGrad)" stroke="#44403C" strokeWidth="1.5" />
                {/* Right Pillar */}
                <path d="M 100 70 L 100 15 Q 115 15 125 25 L 130 70 Z" fill="url(#rockGrad)" stroke="#44403C" strokeWidth="1.5" />
                {/* Natural Spanning Arch Bridge */}
                <path d="M 40 25 Q 75 0 110 25 Q 75 14 40 25 Z" fill="url(#rockGrad)" stroke="#292524" strokeWidth="1.8" />
                {/* Arch opening highlight */}
                <ellipse cx="75" cy="55" rx="28" ry="20" fill="#F4FBF4" />
              </g>

              {/* ASI Geological Viewing Deck */}
              <rect x="345" y="115" width="75" height="42" rx="8" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />

              {/* Park Entrance Arch */}
              <rect x="220" y="262" width="100" height="28" rx="6" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
            </g>
          ) : layout.layoutType === 'city-shrine' ? (
            /* 2. CITY & VILLAGE SHRINE (Sri Jagannatha, Veshalamma, Gangamma, Bedi Anjaneya) */
            <g>
              <rect x="40" y="30" width="460" height="270" rx="16" fill="#FDFBF7" stroke="#D97706" strokeWidth="2" strokeDasharray="8 3" />
              <circle cx="45" cy="35" r="7" fill="#E2D9C8" stroke="#D97706" strokeWidth="1" />
              <circle cx="495" cy="35" r="7" fill="#E2D9C8" stroke="#D97706" strokeWidth="1" />

              {/* Inner Sacred Courtyard Pavement */}
              <rect x="75" y="50" width="390" height="210" rx="12" fill="#F4EFE6" stroke="#92400E" strokeWidth="1.5" />

              {/* Mukha Mandapam Pillared Hall */}
              <rect x="205" y="112" width="130" height="48" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              <circle cx="218" cy="124" r="3" fill="#78350F" />
              <circle cx="322" cy="124" r="3" fill="#78350F" />
              <circle cx="218" cy="148" r="3" fill="#78350F" />
              <circle cx="322" cy="148" r="3" fill="#78350F" />

              {/* Dhwajasthambham Flag Mast & Deepasthambham in Open Courtyard */}
              <g transform="translate(270, 185)">
                <circle cx="0" cy="0" r="11" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="4.5" fill="#B45309" />
              </g>

              {/* Garbha Griha (Inner Sanctum) */}
              <g transform="translate(225, 45)">
                <circle cx="45" cy="45" r="45" fill="url(#sanctumGlow)" />
                <rect x="10" y="10" width="70" height="65" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <polygon points="45,15 20,60 70,60" fill="url(#goldVimana)" stroke="#92400E" strokeWidth="1.2" />
                <circle cx="45" cy="13" r="3" fill="#FDE047" stroke="#78350F" />
              </g>

              {/* Kumkum & Prasadam Counter Pavilion (Eastern Courtyard) */}
              <rect x="355" y="138" width="80" height="44" rx="6" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />

              {/* Footwear Stand (Western Entrance Side) */}
              <rect x="95" y="200" width="85" height="34" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />

              {/* Parking Plaza (South-East Outside Courtyard) */}
              <g transform="translate(365, 248)">
                <rect x="0" y="0" width="95" height="34" rx="8" fill="#F3E8FF" stroke="#9333EA" strokeWidth="1.5" />
              </g>

              {/* Entrance Gopuram Arch */}
              <g transform="translate(225, 252)">
                <rect x="0" y="0" width="90" height="26" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="2" />
                <polygon points="45,-8 15,0 75,0" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
              </g>
            </g>
          ) : layout.layoutType === 'shopping-market' ? (
            /* 3. SHOPPING MARKET / BAZAAR AVENUE (Gandhi Road, Markets) */
            <g>
              <rect x="35" y="25" width="470" height="285" rx="16" fill="#FFFDF8" stroke="#E2D9C8" strokeWidth="2" />
              
              {/* Central Pedestrian Shopping Street */}
              <rect x="230" y="40" width="80" height="260" rx="10" fill="#F5EFE6" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="270" y1="50" x2="270" y2="290" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="8 6" />

              {/* Storefront Blocks Left */}
              <rect x="70" y="60" width="130" height="70" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              <rect x="70" y="150" width="130" height="80" rx="8" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />

              {/* Storefront Blocks Right */}
              <rect x="340" y="60" width="130" height="70" rx="8" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
              <rect x="340" y="150" width="130" height="80" rx="8" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
            </g>
          ) : layout.layoutType === 'dining-restaurant' ? (
            /* 4. DINING & RESTAURANT */
            <g>
              <rect x="40" y="30" width="460" height="275" rx="16" fill="#FFFDF5" stroke="#FDE68A" strokeWidth="2" />
              
              {/* Main Dining Hall */}
              <rect x="120" y="70" width="300" height="150" rx="14" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="2" />
              
              {/* Tables & Seating Pods */}
              <circle cx="170" cy="110" r="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
              <circle cx="270" cy="110" r="18" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
              <circle cx="370" cy="110" r="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />

              <circle cx="170" cy="170" r="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
              <circle cx="270" cy="170" r="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
              <circle cx="370" cy="170" r="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />

              {/* Reception Lobby */}
              <rect x="210" y="260" width="120" height="30" rx="6" fill="#D97706" />
            </g>
          ) : layout.layoutType === 'museum-gallery' ? (
            /* 5. MUSEUM & SCIENCE GALLERY */
            <g>
              <rect x="35" y="25" width="470" height="285" rx="18" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />

              {/* Museum Central Rotunda / Exhibit Hall */}
              <circle cx="270" cy="130" r="70" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
              <circle cx="270" cy="130" r="40" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />

              {/* Side Wings / Pavilions */}
              <rect x="60" y="80" width="110" height="100" rx="10" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
              <rect x="370" y="80" width="110" height="100" rx="10" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />

              {/* Main Grand Entrance */}
              <rect x="220" y="265" width="100" height="28" rx="6" fill="#1E40AF" />
            </g>
          ) : layout.layoutType === 'ancient-shrine' ? (
            /* 6. ANCIENT SHRINE (Gudimallam, Appalayagunta, Jeeva Lingeshwara) */
            <g>
              {/* Outer Sacred Prakaram Boundary */}
              <rect x="40" y="25" width="460" height="285" rx="16" fill="#FDFBF7" stroke="#D97706" strokeWidth="2" strokeDasharray="8 3" />
              <rect x="90" y="45" width="360" height="240" rx="12" fill="#F4EFE6" stroke="#92400E" strokeWidth="1.5" />

              {/* Corner Pillar Markers */}
              <circle cx="110" cy="65" r="4" fill="#92400E" />
              <circle cx="430" cy="65" r="4" fill="#92400E" />
              <circle cx="110" cy="265" r="4" fill="#92400E" />
              <circle cx="430" cy="265" r="4" fill="#92400E" />

              {/* Sanctum Base (Sanctum Sanctorum) */}
              <g transform="translate(225, 40)">
                <circle cx="45" cy="45" r="45" fill="url(#sanctumGlow)" />
                <rect x="10" y="10" width="70" height="65" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <polygon points="45,15 20,60 70,60" fill="url(#goldVimana)" stroke="#92400E" strokeWidth="1.2" />
                <circle cx="45" cy="13" r="3" fill="#FDE047" stroke="#78350F" />
                <circle cx="45" cy="42" r="14" fill="#78350F" />
                <circle cx="45" cy="42" r="6" fill="#F59E0B" />
              </g>

              {/* Nandi & Dhwaja Mandapam (Center) */}
              <rect x="210" y="175" width="120" height="42" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />

              {/* Parvathi / Sub-Shrine Pavilion (North-West) */}
              <rect x="110" y="100" width="65" height="44" rx="6" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />

              {/* Prasadam & Vibhuti Counter (North-East) */}
              <rect x="365" y="130" width="70" height="40" rx="6" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />

              {/* Footwear Stand (South-West) */}
              <rect x="105" y="232" width="75" height="32" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />

              {/* Entrance Gopuram / Archway (South) */}
              <g transform="translate(225, 258)">
                <rect x="0" y="0" width="90" height="26" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="2" />
                <polygon points="45,-8 15,0 75,0" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
              </g>
            </g>
          ) : layout.layoutType === 'heritage-fort' ? (
            /* 7. HERITAGE FORT & PALACE (Chandragiri Fort & Raja Mahal) */
            <g>
              {/* Outer Fort Rampart Stone Walls & Bastions */}
              <rect x="35" y="25" width="470" height="285" rx="16" fill="#FBF8F2" stroke="#78350F" strokeWidth="2.5" />
              {/* Fort Corner Circular Bastions / Watch Towers */}
              <circle cx="45" cy="35" r="14" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="495" cy="35" r="14" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="45" cy="295" r="14" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="495" cy="295" r="14" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />

              {/* Inner Palace Royal Courtyard Lawn */}
              <rect x="75" y="55" width="390" height="185" rx="12" fill="#F4FBF4" stroke="#86EFAC" strokeWidth="1.5" />

              {/* Raja Mahal (3-Storey Indo-Saracenic Palace) North Center */}
              <g transform="translate(205, 45)">
                <rect x="0" y="0" width="130" height="75" rx="8" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" />
                {/* 3 Arched Palace Balconies */}
                <rect x="15" y="25" width="26" height="35" rx="13" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
                <rect x="52" y="18" width="26" height="42" rx="13" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
                <rect x="89" y="25" width="26" height="35" rx="13" fill="#FDE047" stroke="#78350F" strokeWidth="1.2" />
                {/* Central Royal Dome */}
                <path d="M 50 18 Q 65 -2 80 18 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
                <circle cx="65" cy="-3" r="2.5" fill="#FEF08A" />
              </g>

              {/* Rani Mahal & Queen's Gardens (North-East) */}
              <g transform="translate(365, 60)">
                <rect x="0" y="0" width="80" height="55" rx="8" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
                <circle cx="40" cy="28" r="12" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.2" />
                <circle cx="40" cy="28" r="4" fill="#15803D" />
              </g>

              {/* Sound & Light Show Open-Air Amphitheater (South-East) */}
              <g transform="translate(345, 150)">
                <path d="M 0 35 A 40 40 0 0 1 70 35" fill="none" stroke="#6366F1" strokeWidth="4" strokeDasharray="4 3" />
                <path d="M 10 35 A 30 30 0 0 1 60 35" fill="none" stroke="#818CF8" strokeWidth="3" />
                <rect x="25" y="38" width="20" height="10" rx="3" fill="#C7D2FE" stroke="#4338CA" strokeWidth="1" />
              </g>

              {/* Cloakroom & ASI Museum Ticket Facility (South-West) */}
              <rect x="95" y="195" width="80" height="36" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />

              {/* Fort Royal Gateway Arch (South Center) */}
              <g transform="translate(225, 238)">
                <rect x="0" y="0" width="90" height="26" rx="6" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
                <path d="M 30 26 L 30 10 Q 45 2 60 10 L 60 26 Z" fill="#FBF8F2" stroke="#451A03" strokeWidth="1.2" />
              </g>
            </g>
          ) : layout.layoutType === 'trek-trail' ? (
            /* 8. SACRED FOOTPATH & TREK (Srivari Mettu, Alipiri Mettu) */
            <g>
              <path d="M 20 180 Q 150 70 270 90 Q 390 60 520 160 L 520 320 L 20 320 Z" fill="#F4F8F4" stroke="#CBD5E1" strokeWidth="1.5" />
              {/* Stepped mountain path */}
              <path d="M 270 280 L 270 65" stroke="#CBD5E1" strokeWidth="22" strokeLinecap="round" />
              <path d="M 270 280 L 270 65" stroke="#E2E8F0" strokeWidth="16" strokeDasharray="3 3" />
              {/* Midpoint Rest Mandapam */}
              <rect x="230" y="122" width="80" height="28" rx="6" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="1.5" />
              {/* Hilltop Summit Terminal Pavilion */}
              <rect x="235" y="50" width="70" height="30" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              {/* Footwear / Luggage Shed (West) */}
              <rect x="105" y="228" width="80" height="32" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />
            </g>
          ) : layout.layoutType === 'hill-waterfall' ? (
            /* 8. HILL & WATERFALL (Talakona, Kailasakona, Narayanavanam Waterfalls, Kapila Theertham) */
            <g>
              {/* Seshachalam Forest Cliff Gorge & Rock Hills */}
              <path d="M 30 130 Q 140 30 270 45 Q 400 30 510 130 L 510 310 L 30 310 Z" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="1.8" />
              
              {/* Mountain Cliff Rock Ledges */}
              <path d="M 60 90 Q 180 20 270 35 Q 360 20 480 90" fill="none" stroke="#22C55E" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
              <path d="M 120 70 Q 200 45 270 45 Q 340 45 420 70" fill="none" stroke="#15803D" strokeWidth="2.5" />

              {/* Cascading Waterfalls (Top Cliff to Lower Pool) */}
              <g transform="translate(245, 30)">
                <path d="M 25 0 Q 15 45 25 90" stroke="#0284C7" strokeWidth="20" strokeLinecap="round" opacity="0.7" />
                <path d="M 25 0 Q 30 45 25 90" stroke="#38BDF8" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
                <path d="M 25 0 Q 22 45 25 90" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                {/* Water splash mist circles */}
                <circle cx="25" cy="90" r="14" fill="#BAE6FD" opacity="0.6" />
                <circle cx="15" cy="85" r="8" fill="#FFFFFF" opacity="0.7" />
                <circle cx="35" cy="85" r="8" fill="#FFFFFF" opacity="0.7" />
              </g>

              {/* Natural Theertham Pool (Kund) at Gorge Bottom */}
              <g transform="translate(195, 110)">
                <ellipse cx="75" cy="30" rx="75" ry="28" fill="url(#waterTankGrad)" stroke="#0284C7" strokeWidth="2" />
                {/* Water surface ripples */}
                <ellipse cx="75" cy="30" rx="55" ry="18" fill="none" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="6 4" />
                <ellipse cx="75" cy="30" rx="30" ry="10" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
              </g>

              {/* Scenic Viewpoint & Wooden Observation Deck (North-East) */}
              <g transform="translate(365, 80)">
                <rect x="0" y="0" width="80" height="42" rx="8" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
                <circle cx="40" cy="21" r="10" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
              </g>

              {/* Forest Rest Shelter & Changing Rooms (South-West) */}
              <rect x="95" y="195" width="80" height="36" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />

              {/* Forest Eco-Tourism Trailhead Gate (South Center) */}
              <g transform="translate(225, 238)">
                <rect x="0" y="0" width="90" height="26" rx="6" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
                <line x1="20" y1="0" x2="20" y2="26" stroke="#BBF7D0" strokeWidth="1.5" />
                <line x1="70" y1="0" x2="70" y2="26" stroke="#BBF7D0" strokeWidth="1.5" />
              </g>
            </g>
          ) : layout.layoutType === 'wildlife-safari' ? (
            /* 9. WILDLIFE & PARKS (SV Zoo Park, Deer Park) */
            <g>
              <rect x="30" y="25" width="480" height="285" rx="18" fill="#F4F9F4" stroke="#86EFAC" strokeWidth="2" />
              <rect x="330" y="55" width="150" height="90" rx="12" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5 3" />
              <rect x="60" y="120" width="160" height="100" rx="12" fill="#F0FDF4" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="5 3" />
              <ellipse cx="270" cy="140" rx="50" ry="35" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" />
            </g>
          ) : (
            /* 10. GRAND TEMPLE (Tirumala, Padmavathi, Govindaraja with Pushkarini) */
            <g>
              <rect x="40" y="30" width="460" height="270" rx="16" fill="#F8F5EE" stroke="#B45309" strokeWidth="2.5" strokeDasharray="10 3" />
              <circle cx="45" cy="35" r="8" fill="#E2D9C8" stroke="#B45309" strokeWidth="1" />
              <circle cx="495" cy="35" r="8" fill="#E2D9C8" stroke="#B45309" strokeWidth="1" />

              <rect x="90" y="65" width="360" height="200" rx="12" fill="#F1ECE1" stroke="#CBD5E1" strokeWidth="1.5" />

              {/* Pushkarini Water Tank */}
              <g transform="translate(375, 80)">
                <rect x="0" y="0" width="90" height="60" rx="8" fill="#E2E8F0" stroke="#0284C7" strokeWidth="1.5" />
                <rect x="4" y="4" width="82" height="52" rx="6" fill="url(#waterTankGrad)" />
              </g>

              {/* Golden Vimana Sanctum */}
              <g transform="translate(225, 75)">
                <circle cx="45" cy="45" r="48" fill="url(#sanctumGlow)" />
                <rect x="10" y="10" width="70" height="70" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <polygon points="45,15 20,65 70,65" fill="url(#goldVimana)" stroke="#92400E" strokeWidth="1.2" />
                <circle cx="45" cy="13" r="3.5" fill="#FDE047" stroke="#78350F" />
              </g>

              {/* Raja Gopuram Gateway */}
              <g transform="translate(225, 265)">
                <rect x="0" y="0" width="90" height="28" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="2" />
                <polygon points="45,-12 15,0 75,0" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════
              TAILORED DYNAMIC ROUTE POLYLINE (Per Place)
              ═══════════════════════════════════════════════════ */}
          {routePathString && (
            <path 
              d={routePathString} 
              fill="none" 
              stroke="#059669" 
              strokeWidth="3.5" 
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          )}

          {/* ═══════════════════════════════════════════════════
              NORTH COMPASS INDICATOR
              ═══════════════════════════════════════════════════ */}
          <g transform="translate(505, 45)">
            <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
            <polygon points="0,-9 4,3 0,1 -4,3" fill="#DC2626" />
            <polygon points="0,1 4,3 0,9 -4,3" fill="#64748B" />
            <text x="0" y="-11" fontSize="7.5" fontWeight="900" textAnchor="middle" fill="#DC2626">N</text>
          </g>

          {/* ═══════════════════════════════════════════════════
              ACCURATE DYNAMIC PINS (Rendered at exact svgX, svgY)
              ═══════════════════════════════════════════════════ */}
          {layout.pins.map((pin) => {
            const cat = CATEGORY_STYLES[pin.category] || CATEGORY_STYLES.info;
            const isSelected = activePin?.id === pin.id;
            const rawPx = pin.svgX || 270;
            const rawPy = pin.svgY || 160;
            
            // Direct precise pin rendering matching layout svgX and svgY
            const px = Math.max(50, Math.min(490, rawPx));
            const py = Math.max(35, Math.min(300, rawPy));

            const label = lang === 'te' 
              ? (pin.nameTe.length > 14 ? pin.nameTe.split(' ')[0] : pin.nameTe)
              : (pin.category === 'sanctum' ? (
                  layout.layoutType === 'dam-reservoir' ? 'Reservoir Lake' :
                  layout.layoutType === 'botanical-garden' ? 'Flower Nursery' :
                  layout.layoutType === 'sacred-pushkarini' ? 'Holy Tank' :
                  layout.layoutType === 'geo-nature-park' ? 'Rock Arch' :
                  layout.layoutType === 'shopping-market' ? 'Main Bazaar' :
                  layout.layoutType === 'dining-restaurant' ? 'Dining Hall' :
                  layout.layoutType === 'museum-gallery' ? 'Exhibits' :
                  layout.layoutType === 'trek-trail' ? 'Summit' :
                  layout.layoutType === 'hill-waterfall' ? 'Theertham Pool' :
                  layout.layoutType === 'heritage-fort' ? 'Raja Mahal' : 'Sanctum'
                ) :
                 pin.category === 'entry' ? (layout.layoutType === 'dam-reservoir' ? 'Dam Bund' : (layout.layoutType === 'heritage-fort' ? 'Fort Gate' : (layout.layoutType === 'hill-waterfall' || layout.layoutType === 'geo-nature-park' ? 'Trailhead' : 'Entrance'))) :
                 pin.category === 'queue' ? (layout.layoutType === 'annaprasadam-complex' ? 'Holding Hall' : 'Queue') :
                 pin.category === 'laddu' ? (layout.layoutType === 'city-shrine' ? 'Prasadam' : 'Prasadam') :
                 pin.category === 'footwear' ? (layout.layoutType === 'sacred-pushkarini' ? 'Footwear' : (layout.layoutType === 'hill-waterfall' ? 'Rest Shelter' : 'Footwear')) :
                 pin.category === 'food' ? (layout.layoutType === 'annaprasadam-complex' ? 'Dining Halls' : (layout.layoutType === 'shopping-market' ? 'Street Food' : 'Food / Dining')) :
                 pin.category === 'parking' ? 'Parking' :
                 pin.category === 'medical' ? 'Medical' :
                 pin.category === 'safari' ? 'Safari' :
                 pin.id.includes('falls') || pin.id.includes('waterfall') ? 'Main Falls' :
                 pin.id.includes('pool') || pin.id.includes('kund') ? 'Theertham Pool' :
                 pin.id.includes('shelter') || pin.id.includes('changing') ? 'Rest Shelter' :
                 pin.id.includes('raja') || pin.id.includes('palace') ? 'Raja Mahal' :
                 pin.id.includes('rani') ? 'Rani Mahal' :
                 pin.id.includes('sound') || pin.id.includes('laser') ? 'Sound Show' :
                 pin.id.includes('cloakroom') || pin.id.includes('locker') ? 'Cloakroom' :
                 pin.id.includes('museum') ? 'Museum' :
                 pin.id.includes('spillway') || pin.id.includes('siphon') || pin.id.includes('barrage') ? 'Spillway' :
                 pin.id.includes('view') || pin.id.includes('hills') || pin.id.includes('panoramic') ? 'Viewpoint' :
                 pin.id.includes('dhwaja') ? 'Dhwajasthambham' :
                 pin.id.includes('pushkarini') || pin.id.includes('sarovar') || pin.id.includes('tank') || pin.id.includes('kalyani') ? 'Pushkarini' :
                 pin.id.includes('shrine') || pin.id.includes('shiva') || pin.id.includes('sub') || pin.id.includes('varaha') || pin.id.includes('padmavathi') || pin.id.includes('anandavalli') || pin.id.includes('anjaneya') || pin.id.includes('ranganatha') || pin.id.includes('krishna') || pin.id.includes('sundararaja') || pin.id.includes('kamakshi') || pin.id.includes('manikantheswara') ? 'Sub-Shrine' :
                 pin.id.includes('sangam') || pin.id.includes('ghat') ? 'River Ghats' :
                 pin.id.includes('view') || pin.id.includes('hills') || pin.id.includes('panoramic') ? 'Viewpoint' :
                 pin.id.includes('topiary') ? 'Topiary Walk' :
                 pin.id.includes('garland') ? 'Garland Pavilion' :
                 pin.id.includes('kitchen') ? 'Mega Kitchen' :
                 pin.id.includes('donor') ? 'Donor Desk' :
                 pin.id.includes('way') ? 'Temple Walkway' :
                 pin.id.includes('token') ? 'Token Counter' :
                 pin.id.includes('rest') || pin.id.includes('mandapam') || pin.id.includes('midpoint') ? 'Rest Mandapam' :
                 pin.id.includes('yantra') || pin.id.includes('peetham') ? 'Yantra Peetham' :
                 pin.id.includes('inscription') ? 'Inscriptions' :
                 layout.layoutType === 'ancient-shrine' ? 'Courtyard' :
                 layout.layoutType === 'botanical-garden' ? 'Gardens' :
                 layout.layoutType === 'trek-trail' ? 'Waypoint' :
                 layout.layoutType === 'hill-waterfall' ? 'Viewpoint' :
                 layout.layoutType === 'shopping-market' ? 'Textiles' :
                 layout.layoutType === 'museum-gallery' ? 'Pavilion' :
                 layout.layoutType === 'wildlife-safari' ? 'Aviary' :
                 layout.layoutType === 'heritage-fort' ? 'Palace' :
                 layout.layoutType === 'city-shrine' ? 'Dhwajasthambham' : 'Courtyard');

            const badgeWidth = Math.max(74, Math.min(125, label.length * 6.2 + 28));
            const badgeX = -badgeWidth / 2;

            return (
              <g 
                key={pin.id} 
                transform={`translate(${px}, ${py})`}
                onClick={() => setActivePin(pin)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulsing Radar Ring for active pin */}
                {isSelected && (
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="24" 
                    fill="none" 
                    stroke={cat.border} 
                    strokeWidth="2.5" 
                    opacity="0.6"
                  >
                    <animate attributeName="r" values="16;28;16" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Pin Badge Bubble */}
                <g transform="translate(0, -18)">
                  <rect 
                    x={badgeX} 
                    y="-12" 
                    width={badgeWidth} 
                    height="24" 
                    rx="12" 
                    fill={cat.bg} 
                    stroke={cat.border} 
                    strokeWidth={isSelected ? "2.4" : "1.4"} 
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.12))"
                  />
                  <polygon 
                    points="0,17 -3.5,12 3.5,12" 
                    fill={cat.border} 
                  />

                  {/* Clean Vector Category Icon */}
                  <g transform={`translate(${badgeX + 8}, -6)`}>
                    {renderMapSvgIcon(pin.category, pin.id, cat.border)}
                  </g>

                  {/* Label Text */}
                  <text 
                    x={badgeX + 22 + (badgeWidth - 26) / 2} 
                    y="3.5" 
                    fontSize="9.5" 
                    fontWeight="800" 
                    textAnchor="middle" 
                    fill={cat.text}
                  >
                    {label}
                  </text>
                </g>

                {/* Target Marker Pin Point */}
                <circle cx="0" cy="0" r="4.5" fill={cat.border} />
                <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Quick Legend Filter Pills */}
      <div className={styles.legendRow}>
        {layout.pins.map((pin) => {
          const cat = CATEGORY_STYLES[pin.category] || CATEGORY_STYLES.info;
          const isSelected = activePin?.id === pin.id;

          return (
            <button
              key={pin.id}
              onClick={() => setActivePin(pin)}
              className={`${styles.legendPill} ${isSelected ? styles.legendPillActive : ''}`}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', width: '12px', height: '12px' }}>
                <svg width="12" height="12" viewBox="0 0 12 12">
                  {renderMapSvgIcon(pin.category, pin.id, isSelected ? '#FFFFFF' : cat.border)}
                </svg>
              </span>
              <span>{lang === 'te' ? pin.nameTe : pin.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Pin Detail Card */}
      {activePin && (
        <div className={styles.pinDetailCard}>
          <div className={styles.pinDetailHeader}>
            <span className={styles.pinTitle} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '24px', 
                height: '24px', 
                borderRadius: '6px', 
                backgroundColor: CATEGORY_STYLES[activePin.category]?.bg || '#FEF3C7', 
                border: `1px solid ${CATEGORY_STYLES[activePin.category]?.border || '#D97706'}` 
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12">
                  {renderMapSvgIcon(activePin.category, activePin.id, CATEGORY_STYLES[activePin.category]?.border || '#D97706')}
                </svg>
              </span>
              <span>{lang === 'te' ? activePin.nameTe : activePin.nameEn}</span>
            </span>
            <span 
              className={styles.pinCategory}
              style={{
                backgroundColor: CATEGORY_STYLES[activePin.category]?.bg || '#F1F5F9',
                color: CATEGORY_STYLES[activePin.category]?.text || '#0F172A'
              }}
            >
              {activePin.category}
            </span>
          </div>

          <p className={styles.pinDesc}>
            {lang === 'te' ? activePin.descTe : activePin.descEn}
          </p>

          {(activePin.tipEn || activePin.tipTe) && (
            <div className={styles.pinTip}>
              <Sparkles size={14} color="#CA8A04" style={{ flexShrink: 0 }} />
              <span>{lang === 'te' ? activePin.tipTe : activePin.tipEn}</span>
            </div>
          )}
        </div>
      )}

      {/* Step-by-Step Wayfinding Timeline */}
      <div className={styles.timelineSection}>
        <div className={styles.sectionHeading}>
          <Footprints size={16} color="#0F5132" />
          <span>{lang === 'te' ? 'ఆఫ్‌లైన్ నడక మార్గం (స్టెప్-బై-స్టెప్)' : 'Step-by-Step Wayfinding Route'}</span>
        </div>

        <div className={styles.timelineList}>
          {layout.routeSteps.map((step) => (
            <div key={step.stepNumber} className={styles.timelineItem}>
              <div className={styles.stepNumber}>{step.stepNumber}</div>
              <div className={styles.stepContent}>
                <div className={styles.stepHeader}>
                  <h4 className={styles.stepTitle}>
                    {lang === 'te' ? step.titleTe : step.titleEn}
                  </h4>
                  <span className={styles.stepMeta}>
                    {step.distance} • {step.timeMins} {lang === 'te' ? 'నిమి.' : 'mins'}
                  </span>
                </div>
                <p className={styles.stepDesc}>
                  {lang === 'te' ? step.descTe : step.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Offline Contacts */}
      {layout.emergencyContacts && layout.emergencyContacts.length > 0 && (
        <div className={styles.emergencySection}>
          <div className={styles.sectionHeading}>
            <Shield size={16} color="#DC2626" />
            <span>{lang === 'te' ? 'అత్యవసర ఆఫ్‌లైన్ నంబర్లు (డైరెక్ట్ కాల్)' : 'Emergency Offline Helplines (Direct Call)'}</span>
          </div>

          <div className={styles.emergencyGrid}>
            {layout.emergencyContacts.map((contact, i) => (
              <a 
                key={i} 
                href={`tel:${contact.number}`} 
                className={styles.emergencyCard}
              >
                <div className={styles.emergencyInfo}>
                  <span className={styles.emergencyTitle}>
                    {lang === 'te' ? contact.titleTe : contact.titleEn}
                  </span>
                  <span className={styles.emergencyNumber}>{contact.number}</span>
                </div>
                <div className={styles.callIcon}>
                  <PhoneCall size={12} />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
