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
import { getTempleLayout, hasCuratedTempleLayout, MapPin } from '@/data/templeLayouts';

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
  const [activePin, setActivePin] = useState<MapPin | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update active pin when layout changes
  useEffect(() => {
    if (layout?.pins && layout.pins.length > 0) {
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

  if (!layout) {
    return null;
  }

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

  // Prettymaps GPS Coordinates formatting
  const displayLat = coordinates?.lat || place?.coordinates?.lat || layout.centerCoordinates?.lat || 13.6288;
  const displayLng = coordinates?.lng || place?.coordinates?.lng || layout.centerCoordinates?.lng || 79.4192;
  const coordString = `${displayLat.toFixed(4)}° N, ${displayLng.toFixed(4)}° E`;

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
            {/* ── 1. Warm Silk Ivory & Parchment Canvas Gradients ── */}
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDFBF7" />
              <stop offset="50%" stopColor="#F8F3EA" />
              <stop offset="100%" stopColor="#F2EBDC" />
            </linearGradient>

            <linearGradient id="prakaramWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF7F0" />
              <stop offset="100%" stopColor="#EDE5D3" />
            </linearGradient>

            {/* ── 2. Topographic Elevation Contour Lines Pattern ── */}
            <pattern id="topographyContours" width="160" height="120" patternUnits="userSpaceOnUse">
              <path d="M 0 30 Q 40 10 80 35 Q 120 60 160 30" fill="none" stroke="rgba(180, 83, 9, 0.06)" strokeWidth="1.2" />
              <path d="M 0 65 Q 50 85 90 60 Q 130 35 160 70" fill="none" stroke="rgba(180, 83, 9, 0.05)" strokeWidth="1.2" />
              <path d="M 0 105 Q 40 90 85 110 Q 130 130 160 100" fill="none" stroke="rgba(180, 83, 9, 0.06)" strokeWidth="1.2" />
              <path d="M 0 0 Q 60 25 100 5 Q 140 -15 160 10" fill="none" stroke="rgba(180, 83, 9, 0.04)" strokeWidth="1" />
            </pattern>

            <pattern id="stonePavement" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(180, 83, 9, 0.03)" strokeWidth="0.8" />
            </pattern>

            {/* ── 3. Divine Radiant Halos & Architectural Material Gradients ── */}
            <linearGradient id="sanctumGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="goldVimana" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="35%" stopColor="#FBBF24" />
              <stop offset="75%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            <linearGradient id="gopuramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            <linearGradient id="palaceSandstone" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="60%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="rockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D6D3D1" />
              <stop offset="50%" stopColor="#A8A29E" />
              <stop offset="100%" stopColor="#78716C" />
            </linearGradient>

            <linearGradient id="waterTankGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="45%" stopColor="#38BDF8" />
              <stop offset="85%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>

            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* ── 4. Drop Shadows & Ambient Lighting Filters ── */}
            <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" floodColor="#0F172A" floodOpacity="0.14" />
            </filter>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* ── 5. Organic Botanical Tree Symbols (Pretty Map Foliage) ── */}
            <g id="treeCluster">
              <ellipse cx="0" cy="4" rx="14" ry="7" fill="rgba(15, 23, 42, 0.08)" />
              <circle cx="-5" cy="-2" r="9" fill="#15803D" opacity="0.9" />
              <circle cx="5" cy="-2" r="9" fill="#16A34A" opacity="0.9" />
              <circle cx="0" cy="-8" r="10" fill="#22C55E" />
              <circle cx="-2" cy="-9" r="6" fill="#86EFAC" opacity="0.8" />
            </g>

            <g id="palmCluster">
              <ellipse cx="0" cy="3" rx="10" ry="5" fill="rgba(15, 23, 42, 0.07)" />
              <path d="M 0 3 Q -2 -6 -10 -8 Q -4 -3 0 0" fill="#15803D" />
              <path d="M 0 3 Q 2 -6 10 -8 Q 4 -3 0 0" fill="#16A34A" />
              <path d="M 0 3 Q -6 -3 -12 2 Q -5 1 0 3" fill="#15803D" />
              <path d="M 0 3 Q 6 -3 12 2 Q 5 1 0 3" fill="#16A34A" />
              <path d="M 0 3 Q 0 -8 0 -12 Q 1 -6 0 3" fill="#22C55E" />
            </g>
          </defs>

          {/* Background Canvas: Warm Parchment + Topographic Elevation Curves */}
          <rect width="540" height="340" fill="url(#groundGrad)" />
          <rect width="540" height="340" fill="url(#topographyContours)" />
          <rect width="540" height="340" fill="url(#stonePavement)" />

          {/* Prettymaps Signature Concentric Perimeter Rings */}
          <circle cx="270" cy="170" r="162" fill="none" stroke="rgba(180, 83, 9, 0.12)" strokeWidth="1.5" />
          <circle cx="270" cy="170" r="166" fill="none" stroke="rgba(180, 83, 9, 0.06)" strokeWidth="0.8" strokeDasharray="3 3" />

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
          ) : layout.layoutType === 'forest-eco-reserve' ? (
            /* 3B. DENSE ECO-TOURISM FOREST RESERVE (Mamanduru Forest & Nature Trails) */
            <g>
              {/* Forest Base Ground */}
              <rect x="35" y="25" width="470" height="285" rx="16" fill="#F2FAF4" stroke="#16A34A" strokeWidth="2" />

              {/* Seshachalam Hill Valley Curves & Tree Groves */}
              <circle cx="80" cy="75" r="26" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.2" />
              <circle cx="105" cy="95" r="20" fill="#BBF7D0" stroke="#16A34A" strokeWidth="1.2" />
              <circle cx="455" cy="75" r="26" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1.2" />
              <circle cx="430" cy="95" r="20" fill="#BBF7D0" stroke="#16A34A" strokeWidth="1.2" />

              {/* Natural Forest Trees & Red Sanders Clusters */}
              <use href="#treeCluster" x="75" y="70" />
              <use href="#treeCluster" x="445" y="70" />
              <use href="#palmCluster" x="65" y="235" />
              <use href="#treeCluster" x="465" y="235" />

              {/* Crystal Perennial Forest Stream / Brook flowing through valley */}
              <path 
                d="M 40 145 Q 160 120 270 140 Q 380 160 500 135" 
                fill="none" 
                stroke="#BAE6FD" 
                strokeWidth="20" 
                strokeLinecap="round" 
                opacity="0.65" 
              />
              <path 
                d="M 40 145 Q 160 120 270 140 Q 380 160 500 135" 
                fill="none" 
                stroke="#38BDF8" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />
              <path 
                d="M 50 145 Q 160 122 270 140 Q 380 158 490 135" 
                fill="none" 
                stroke="#FFFFFF" 
                strokeWidth="2" 
                strokeDasharray="8 6" 
                opacity="0.9" 
              />

              {/* Wooden Jungle Trek Walkway */}
              <path 
                d="M 270 270 Q 160 230 160 190 Q 160 120 270 100 Q 380 100 380 140" 
                fill="none" 
                stroke="#CBD5E1" 
                strokeWidth="16" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M 270 270 Q 160 230 160 190 Q 160 120 270 100 Q 380 100 380 140" 
                fill="none" 
                stroke="#E2E8F0" 
                strokeWidth="10" 
                strokeDasharray="4 3" 
                strokeLinecap="round" 
              />

              {/* 1865 British Colonial Wooden Heritage Bungalow / Cottages (West) */}
              <g transform="translate(115, 160)">
                <rect x="0" y="10" width="80" height="50" rx="6" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.5" />
                {/* Triangular Wooden Gabled Roof */}
                <polygon points="40,-4 -4,12 84,12" fill="#78350F" stroke="#451A03" strokeWidth="1.2" />
                {/* Wooden Verandah Pillars */}
                <line x1="12" y1="12" x2="12" y2="60" stroke="#B45309" strokeWidth="2" />
                <line x1="68" y1="12" x2="68" y2="60" stroke="#B45309" strokeWidth="2" />
                <line x1="40" y1="12" x2="40" y2="60" stroke="#B45309" strokeWidth="2" />
                <rect x="32" y="32" width="16" height="28" rx="2" fill="#92400E" />
              </g>

              {/* Canopy Walk & Elevated Watch Tower Observation Deck (North-East) */}
              <g transform="translate(340, 110)">
                <rect x="0" y="0" width="85" height="50" rx="8" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
                {/* Watch Tower Stilt Legs */}
                <circle cx="42" cy="25" r="14" fill="#BBF7D0" stroke="#15803D" strokeWidth="1.2" />
                <circle cx="42" cy="25" r="6" fill="#15803D" />
                {/* Canopy Bridge Railing */}
                <line x1="10" y1="25" x2="75" y2="25" stroke="#CA8A04" strokeWidth="2" strokeDasharray="3 2" />
              </g>

              {/* Peacock Trailhead Canopy Arch (North Center) */}
              <g transform="translate(225, 75)">
                <rect x="0" y="0" width="90" height="30" rx="6" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
                <circle cx="45" cy="15" r="8" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
              </g>

              {/* AP Forest Department Eco Gateway Arch (South Center) */}
              <rect x="215" y="262" width="110" height="28" rx="6" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
            </g>
          ) : layout.layoutType === 'hilltop-peak' ? (
            /* 3B. MOUNTAIN SUMMIT & DIVINE FOOTPRINTS SHRINE (Srivari Paadaalu, Narayanagiri Peak) */
            <g>
              {/* Mountain Summit Base Contour */}
              <rect x="40" y="30" width="460" height="270" rx="16" fill="#FFFDF8" stroke="#D97706" strokeWidth="2" strokeDasharray="8 3" />
              
              {/* Summit Plateau Topography Contours */}
              <ellipse cx="270" cy="120" rx="190" ry="85" fill="#FEF9C3" stroke="#F59E0B" strokeWidth="1.2" opacity="0.6" />
              <ellipse cx="270" cy="105" rx="130" ry="60" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              
              {/* Mountain Peak Ridge Lines */}
              <path d="M 60 160 Q 150 110 270 85 Q 390 110 480 160" fill="none" stroke="#E2D9C8" strokeWidth="2" strokeDasharray="6 3" />
              
              {/* Stone Steps Ascent Walkway */}
              <path d="M 270 270 L 270 170 Q 270 135 270 100" fill="none" stroke="#CBD5E1" strokeWidth="22" strokeLinecap="round" />
              <path d="M 270 270 L 270 170 Q 270 135 270 100" fill="none" stroke="#94A3B8" strokeWidth="14" strokeDasharray="4 4" />

              {/* Sri Padala Mandapam (Sacred Divine Footprints Sanctum) */}
              <g transform="translate(225, 45)">
                <circle cx="45" cy="45" r="46" fill="url(#sanctumGlow)" />
                <rect x="8" y="10" width="74" height="66" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <polygon points="45,12 18,55 72,55" fill="url(#goldVimana)" stroke="#92400E" strokeWidth="1.5" />
                
                {/* Sacred Divine Footprints (Two Paadaalu with Shankha-Chakra) */}
                <ellipse cx="38" cy="45" rx="4.5" ry="8" fill="#78350F" />
                <ellipse cx="52" cy="45" rx="4.5" ry="8" fill="#78350F" />
                <circle cx="38" cy="35" r="1.5" fill="#F59E0B" />
                <circle cx="52" cy="35" r="1.5" fill="#F59E0B" />
              </g>

              {/* 360° Seshachalam Mountain Viewpoint Deck (North-West) */}
              <g transform="translate(100, 95)">
                <rect x="0" y="0" width="85" height="50" rx="8" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
                {/* Observation Deck Railing & Telescope */}
                <circle cx="42" cy="25" r="12" fill="#BBF7D0" stroke="#15803D" strokeWidth="1" />
                <line x1="32" y1="25" x2="52" y2="25" stroke="#15803D" strokeWidth="2" />
              </g>

              {/* Harathi & Theertham Counter Pavilion (North-East) */}
              <rect x="355" y="130" width="75" height="42" rx="8" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />

              {/* Footwear Stand (South-West) */}
              <rect x="95" y="235" width="85" height="34" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />

              {/* Hilltop Peak Entrance Arch (South) */}
              <g transform="translate(225, 260)">
                <rect x="0" y="0" width="90" height="26" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="2" />
                <polygon points="45,-8 15,0 75,0" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
              </g>
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

              {/* Footwear Stand (South-West Entrance Side) */}
              <rect x="95" y="235" width="80" height="30" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />

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

              {/* Footwear Stand (South-West Entrance Side) */}
              <rect x="95" y="235" width="80" height="30" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />

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
              {/* Outer Prakaram Wall with Textured Inset */}
              <rect x="35" y="25" width="470" height="285" rx="16" fill="url(#prakaramWallGrad)" stroke="#B45309" strokeWidth="2.5" />
              
              {/* Corner Prakaram Bastion Pillars */}
              <circle cx="45" cy="35" r="10" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="495" cy="35" r="10" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="45" cy="295" r="10" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
              <circle cx="495" cy="295" r="10" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />

              {/* Inner Sacred Courtyard Floor */}
              <rect x="75" y="55" width="390" height="195" rx="12" fill="#FDFBF7" stroke="#CBD5E1" strokeWidth="1.5" />

              {/* Botanical Temple Groves in Courtyard Corners */}
              <use href="#treeCluster" x="70" y="60" />
              <use href="#palmCluster" x="470" y="60" />
              <use href="#palmCluster" x="75" y="240" />
              <use href="#treeCluster" x="465" y="240" />

              {/* Stepped Pushkarini Water Tank (North-East) */}
              <g transform="translate(360, 65)">
                <rect x="0" y="0" width="95" height="75" rx="8" fill="#E2E8F0" stroke="#0284C7" strokeWidth="1.8" />
                <rect x="5" y="5" width="85" height="65" rx="6" fill="#CBD5E1" stroke="#0284C7" strokeWidth="1" />
                <rect x="10" y="10" width="75" height="55" rx="4" fill="url(#waterTankGrad)" />
                {/* Water Ripples */}
                <path d="M 18 30 Q 32 25 46 30 Q 60 35 74 30" stroke="#BAE6FD" strokeWidth="1.5" fill="none" opacity="0.8" />
                <path d="M 22 48 Q 36 43 50 48 Q 64 53 78 48" stroke="#BAE6FD" strokeWidth="1.5" fill="none" opacity="0.8" />
                {/* Central Neerazhi Mandapam */}
                <rect x="38" y="28" width="18" height="18" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
                <circle cx="47" cy="37" r="3" fill="#F59E0B" />
              </g>

              {/* Ornate Golden Vimana Sanctum Tower (North Center) */}
              <g transform="translate(205, 45)">
                {/* Radiant Divine Halo */}
                <circle cx="65" cy="50" r="58" fill="url(#sanctumGlow)" />
                
                {/* Sanctum Mandapam Base */}
                <rect x="10" y="15" width="110" height="70" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                
                {/* Stepped Golden Vimana Pyramid Tiers */}
                <polygon points="65,10 25,65 105,65" fill="url(#goldVimana)" stroke="#92400E" strokeWidth="1.5" />
                <polygon points="65,18 35,55 95,55" fill="url(#goldVimana)" stroke="#B45309" strokeWidth="1" />
                <polygon points="65,26 45,45 85,45" fill="url(#goldVimana)" stroke="#D97706" strokeWidth="1" />
                
                {/* Divine Gold Kalasam Spires */}
                <circle cx="65" cy="8" r="4" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
                <circle cx="58" cy="11" r="2.5" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
                <circle cx="72" cy="11" r="2.5" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
              </g>

              {/* Towering 5-Tiered Raja Gopuram Gateway (South Center) */}
              <g transform="translate(210, 248)">
                <rect x="0" y="8" width="120" height="28" rx="6" fill="url(#gopuramGrad)" stroke="#78350F" strokeWidth="2" />
                {/* Stepped Gopuram Tiers */}
                <polygon points="60,-12 18,8 102,8" fill="url(#gopuramGrad)" stroke="#78350F" strokeWidth="1.5" />
                <polygon points="60,-4 28,8 92,8" fill="#FDE68A" stroke="#B45309" strokeWidth="1" opacity="0.6" />
                {/* 5 Golden Kalasam Finials */}
                <circle cx="60" cy="-14" r="3" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
                <circle cx="52" cy="-12" r="2.2" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
                <circle cx="68" cy="-12" r="2.2" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
                <circle cx="44" cy="-10" r="1.8" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
                <circle cx="76" cy="-10" r="1.8" fill="#FEF08A" stroke="#78350F" strokeWidth="0.8" />
                {/* Entrance Gateway Portal Arch */}
                <path d="M 46 36 L 46 22 Q 60 14 74 22 L 74 36 Z" fill="#FDFBF7" stroke="#451A03" strokeWidth="1.2" />
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════
              LUMINOUS GUIDED PILGRIMAGE ROUTE RIBBON
              ═══════════════════════════════════════════════════ */}
          {routePathString && (
            <g>
              {/* Soft Translucent Ambient Trail Glow */}
              <path 
                d={routePathString} 
                fill="none" 
                stroke="rgba(16, 185, 129, 0.22)" 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Primary Guided Vector Ribbon */}
              <path 
                d={routePathString} 
                fill="none" 
                stroke="url(#routeGradient)" 
                strokeWidth="4" 
                strokeDasharray="8 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* ═══════════════════════════════════════════════════
              NORTH COMPASS ROSE (Artistic Cartographic Style)
              ═══════════════════════════════════════════════════ */}
          <g transform="translate(502, 42)">
            <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" filter="url(#pinShadow)" />
            <circle cx="0" cy="0" r="12" fill="#F8FAFC" stroke="rgba(180, 83, 9, 0.15)" strokeWidth="1" strokeDasharray="3 2" />
            <polygon points="0,-11 4.5,3 0,0 -4.5,3" fill="#DC2626" />
            <polygon points="0,0 4.5,3 0,11 -4.5,3" fill="#64748B" />
            <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
            <text x="0" y="-13" fontSize="8" fontWeight="900" textAnchor="middle" fill="#DC2626">N</text>
          </g>

          {/* ═══════════════════════════════════════════════════
              GLASSMORPHIC FLOATING PIN BADGES (Pretty Maps Style)
              ═══════════════════════════════════════════════════ */}
          {layout.pins.map((pin) => {
            const cat = CATEGORY_STYLES[pin.category] || CATEGORY_STYLES.info;
            const isSelected = activePin?.id === pin.id;
            const rawPx = pin.svgX || 270;
            const rawPy = pin.svgY || 160;
            
            // Direct precise pin rendering matching layout svgX and svgY
            const px = Math.max(50, Math.min(490, rawPx));
            const py = Math.max(35, Math.min(300, rawPy));

            const getBadgeLabel = (p: MapPin): string => {
              if (lang === 'te') {
                if (p.category === 'sanctum') return 'గర్భాలయం';
                if (p.category === 'entry') return 'ప్రవేశం';
                if (p.category === 'footwear') return 'పాదరక్షలు';
                if (p.category === 'parking') return 'పార్కింగ్';
                if (p.category === 'laddu') return 'ప్రసాదం';
                if (p.category === 'queue') return 'క్యూ లైన్';
                if (p.id.includes('cottage') || p.id.includes('resthouse') || (p.nameEn || '').toLowerCase().includes('cottage') || (p.nameEn || '').toLowerCase().includes('rest house')) return 'రెస్ట్ హౌస్';
                if (p.id.includes('trail') || p.id.includes('trek') || (p.nameEn || '').toLowerCase().includes('trek') || (p.nameEn || '').toLowerCase().includes('trail')) return 'ట్రెక్కింగ్ మార్గం';
                if (p.id.includes('watchtower') || p.id.includes('canopy') || (p.nameEn || '').toLowerCase().includes('canopy') || (p.nameEn || '').toLowerCase().includes('watch tower')) return 'వాచ్ టవర్';
                if (p.id.includes('dhwaja')) return 'ధ్వజస్తంభం';
                if (p.id.includes('pushkarini') || p.id.includes('tank')) return 'పుష్కరిణి';
                if (p.id.includes('theertham') || p.id.includes('kund')) return 'తీర్థం';
                if (p.id.includes('anjaneya') || p.id.includes('hanuman')) return 'ఆంజనేయ సన్నిధి';
                if (p.id.includes('padmavathi') || p.id.includes('ammavaru')) return 'అమ్మవారి సన్నిధి';
                if (p.id.includes('ranganatha')) return 'రంగనాథ సన్నిధి';
                if (p.id.includes('sundararaja')) return 'సుందరరాజ సన్నిధి';
                if (p.id.includes('andal') || p.id.includes('godadevi')) return 'ఆండాళ్ సన్నిధి';
                if (p.id.includes('shiva') || p.id.includes('linga')) return 'శివ సన్నిధి';
                if (p.id.includes('vinayaka') || p.id.includes('ganesha')) return 'వినాయక సన్నిధి';
                if (!p.nameTe) return 'విభాగం';
                const cleanTe = p.nameTe.split('(')[0].split(' - ')[0].trim();
                const wordsTe = cleanTe.split(' ');
                return wordsTe.length > 2 ? wordsTe.slice(0, 2).join(' ') : cleanTe;
              }
              if (p.category === 'sanctum') return 'Sanctum';
              if (p.category === 'entry') return 'Entrance';
              if (p.category === 'footwear') return 'Footwear';
              if (p.category === 'parking') return 'Parking';
              if (p.category === 'laddu') return 'Prasadam';
              if (p.category === 'queue') return 'Queue Line';
              if (p.category === 'medical') return 'Medical / Clinic';
              if (p.id.includes('cottage') || p.id.includes('resthouse') || (p.nameEn || '').toLowerCase().includes('cottage') || (p.nameEn || '').toLowerCase().includes('rest house')) return 'British Cottages';
              if (p.id.includes('trail') || p.id.includes('trek') || (p.nameEn || '').toLowerCase().includes('trek') || (p.nameEn || '').toLowerCase().includes('trail')) return 'Jungle Trek';
              if (p.id.includes('watchtower') || p.id.includes('canopy') || (p.nameEn || '').toLowerCase().includes('canopy') || (p.nameEn || '').toLowerCase().includes('watch tower')) return 'Canopy Walk';
              if (p.category === 'safari') return 'Safari Station';
              if (p.id.includes('neem') || p.id.includes('tree') || p.id.includes('vriksha')) return 'Sacred Tree';
              if (p.id.includes('dhwaja')) return 'Dhwajasthambham';
              if (p.id.includes('pushkarini') || p.id.includes('tank')) return 'Pushkarini';
              if (p.id.includes('falls') || p.id.includes('waterfall')) return 'Waterfalls';
              if (p.id.includes('pool') || p.id.includes('kund') || p.id.includes('theertham')) return 'Theertham';
              if (p.id.includes('view') || p.id.includes('deck') || p.id.includes('panoramic')) return 'Viewpoint';
              if (p.id.includes('anjaneya') || p.id.includes('hanuman')) return 'Anjaneya Shrine';
              if (p.id.includes('padmavathi') || p.id.includes('thayar') || p.id.includes('ammavaru')) return 'Padmavathi Shrine';
              if (p.id.includes('ranganatha')) return 'Ranganatha Shrine';
              if (p.id.includes('sundararaja')) return 'Sundararaja Shrine';
              if (p.id.includes('andal') || p.id.includes('godadevi')) return 'Andal Shrine';
              if (p.id.includes('garuda')) return 'Garuda Shrine';
              if (p.id.includes('narasimha')) return 'Narasimha Shrine';
              if (p.id.includes('subramanya') || p.id.includes('murugan')) return 'Subramanya Shrine';
              if (p.id.includes('shiva') || p.id.includes('linga')) return 'Shiva Sannidhi';
              if (p.id.includes('vinayaka') || p.id.includes('ganesha')) return 'Vinayaka Shrine';
              if (p.id.includes('hall') || p.id.includes('mandapam')) return 'Mandapam';
              if (p.category === 'food') {
                const nameLower = (p.nameEn || '').toLowerCase();
                if (nameLower.includes('anna') || nameLower.includes('meal') || nameLower.includes('dining')) return 'Annaprasadam';
                if (nameLower.includes('prasadam') || nameLower.includes('theertham')) return 'Prasadam';
                return 'Refreshments';
              }
              if (!p.nameEn) return 'Point';
              const cleanEn = p.nameEn.split('(')[0].split('&')[0].split(' - ')[0].trim();
              const wordsEn = cleanEn.split(' ');
              return wordsEn.length > 2 ? wordsEn.slice(0, 2).join(' ') : cleanEn;
            };

            const label = getBadgeLabel(pin);
            const badgeWidth = Math.max(78, Math.min(130, label.length * 6.5 + 32));
            const badgeX = -badgeWidth / 2;

            return (
              <g 
                key={pin.id} 
                transform={`translate(${px}, ${py})`}
                onClick={() => setActivePin(pin)}
                style={{ cursor: 'pointer' }}
              >
                {/* Active Golden Pulsing Ring */}
                {isSelected && (
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="24" 
                    fill="none" 
                    stroke="#D97706" 
                    strokeWidth="2.5" 
                    opacity="0.7"
                  >
                    <animate attributeName="r" values="16;30;16" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Floating Glassmorphic Pill Badge */}
                <g transform="translate(0, -20)">
                  {/* Clean White Pill Container */}
                  <rect 
                    x={badgeX} 
                    y="-13" 
                    width={badgeWidth} 
                    height="26" 
                    rx="13" 
                    fill="#FFFFFF" 
                    stroke={isSelected ? "#D97706" : "rgba(15, 23, 42, 0.12)"} 
                    strokeWidth={isSelected ? "2" : "1"} 
                    filter="url(#pinShadow)"
                  />
                  {/* Pointer Caret */}
                  <polygon 
                    points="0,17 -4,13 4,13" 
                    fill={isSelected ? "#D97706" : "#FFFFFF"} 
                  />

                  {/* Category Micro-Icon Circular Badge */}
                  <circle 
                    cx={badgeX + 13} 
                    cy="0" 
                    r="9.5" 
                    fill={cat.bg} 
                    stroke={cat.border} 
                    strokeWidth="1" 
                  />
                  <g transform={`translate(${badgeX + 7}, -6)`}>
                    {renderMapSvgIcon(pin.category, pin.id, cat.border)}
                  </g>

                  {/* Crisp Typography Label */}
                  <text 
                    x={badgeX + 27 + (badgeWidth - 31) / 2} 
                    y="3.5" 
                    fontSize="9.8" 
                    fontWeight="800" 
                    textAnchor="middle" 
                    fill="#0F172A"
                    letterSpacing="0.1px"
                  >
                    {label}
                  </text>
                </g>

                {/* Center Pin Target Dot */}
                <circle cx="0" cy="0" r="5" fill="#FFFFFF" filter="url(#pinShadow)" />
                <circle cx="0" cy="0" r="3.5" fill={isSelected ? "#D97706" : cat.border} />
                <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
              </g>
            );
          })}

          {/* ═══════════════════════════════════════════════════
              PRETTYMAPS MINIMALIST CARTOGRAPHIC GPS FOOTER
              ═══════════════════════════════════════════════════ */}
          <g transform="translate(270, 324)">
            <rect 
              x="-115" 
              y="-11" 
              width="230" 
              height="20" 
              rx="10" 
              fill="rgba(255, 255, 255, 0.94)" 
              stroke="rgba(180, 83, 9, 0.25)" 
              strokeWidth="1" 
              filter="url(#pinShadow)" 
            />
            <circle cx="-98" cy="-1" r="3" fill="#D97706" />
            <text 
              x="6" 
              y="2.5" 
              fontSize="8.5" 
              fontWeight="800" 
              textAnchor="middle" 
              fill="#78350F" 
              letterSpacing="0.4px"
            >
              {coordString} • GPS Waypoint
            </text>
          </g>
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
