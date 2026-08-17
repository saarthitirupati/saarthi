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
          ) : layout.layoutType === 'geo-nature-park' ? (
            /* 2. GEOLOGICAL & BOTANICAL PARK (Silathoranam Natural Rock Arch & Park) */
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
              <rect x="80" y="50" width="380" height="225" rx="12" fill="#F4EFE6" stroke="#92400E" strokeWidth="1.5" />

              {/* Mukha Mandapam Pillared Hall */}
              <rect x="205" y="112" width="130" height="48" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
              <circle cx="218" cy="124" r="3" fill="#78350F" />
              <circle cx="322" cy="124" r="3" fill="#78350F" />
              <circle cx="218" cy="148" r="3" fill="#78350F" />
              <circle cx="322" cy="148" r="3" fill="#78350F" />

              {/* Dhwajasthambham Flag Mast & Deepasthambham in Open Courtyard */}
              <g transform="translate(270, 205)">
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
              <rect x="105" y="238" width="80" height="34" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.2" />

              {/* Entrance Gopuram Arch */}
              <g transform="translate(225, 265)">
                <rect x="0" y="0" width="90" height="28" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="2" />
                <polygon points="45,-10 15,0 75,0" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
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
              <rect x="340" y="60" width="130" height="70" rx="8" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
              <rect x="340" y="150" width="130" height="80" rx="8" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" />

              {/* Street Entrance Archway */}
              <rect x="220" y="265" width="100" height="28" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
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
            /* 6. ANCIENT SHRINE (Gudimallam, Appalayagunta) */
            <g>
              <rect x="50" y="30" width="440" height="270" rx="16" fill="#FDFBF7" stroke="#D97706" strokeWidth="2" strokeDasharray="8 3" />
              <rect x="150" y="60" width="240" height="200" rx="12" fill="#F4EFE6" stroke="#92400E" strokeWidth="1.5" />

              <circle cx="170" cy="80" r="4" fill="#92400E" />
              <circle cx="370" cy="80" r="4" fill="#92400E" />
              <circle cx="170" cy="240" r="4" fill="#92400E" />
              <circle cx="370" cy="240" r="4" fill="#92400E" />

              {/* Sanctum Base */}
              <g transform="translate(225, 70)">
                <circle cx="45" cy="40" r="45" fill="url(#sanctumGlow)" />
                <rect x="10" y="10" width="70" height="65" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <circle cx="45" cy="42" r="16" fill="#78350F" />
                <circle cx="45" cy="42" r="7" fill="#F59E0B" />
              </g>

              <rect x="105" y="145" width="40" height="30" rx="4" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
              <rect x="220" y="215" width="100" height="30" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
            </g>
          ) : layout.layoutType === 'trek-trail' ? (
            /* 7. SACRED FOOTPATH & TREK (Alipiri Mettu / Garuda Statue) */
            <g>
              <path d="M 20 180 Q 150 70 270 90 Q 390 60 520 160 L 520 320 L 20 320 Z" fill="#F4F8F4" stroke="#CBD5E1" strokeWidth="1.5" />
              <path d="M 270 280 L 270 70" stroke="#CBD5E1" strokeWidth="20" strokeLinecap="round" />
              <path d="M 270 280 L 270 70" stroke="#E2E8F0" strokeWidth="14" strokeDasharray="3 3" />
              <rect x="235" y="145" width="70" height="30" rx="6" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="1.5" />
              <rect x="240" y="55" width="60" height="30" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            </g>
          ) : layout.layoutType === 'hill-waterfall' ? (
            /* 8. HILL & WATERFALL (Kapila Theertham, Talakona, Kailasakona) */
            <g>
              <path d="M 30 140 Q 150 40 270 50 Q 390 40 510 140 L 510 310 L 30 310 Z" fill="#F5F3EF" stroke="#CBD5E1" strokeWidth="2" />
              <g transform="translate(245, 30)">
                <path d="M 25 0 Q 20 40 25 80" stroke="#0284C7" strokeWidth="16" strokeLinecap="round" opacity="0.6" />
                <path d="M 25 0 Q 30 40 25 80" stroke="#BAE6FD" strokeWidth="8" strokeLinecap="round" />
              </g>
              <g transform="translate(210, 50)">
                <rect x="0" y="0" width="120" height="40" rx="8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
                <rect x="4" y="4" width="112" height="32" rx="6" fill="url(#waterTankGrad)" />
              </g>
              <g transform="translate(225, 135)">
                <circle cx="45" cy="45" r="42" fill="url(#sanctumGlow)" />
                <rect x="10" y="10" width="70" height="65" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <polygon points="45,15 20,60 70,60" fill="url(#goldVimana)" stroke="#92400E" strokeWidth="1.2" />
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
            const px = pin.svgX || 270;
            const py = pin.svgY || 160;

            const label = lang === 'te' 
              ? (pin.nameTe.length > 14 ? pin.nameTe.split(' ')[0] : pin.nameTe)
              : (pin.category === 'sanctum' ? (
                  layout.layoutType === 'botanical-garden' ? 'Flower Nursery' :
                  layout.layoutType === 'sacred-pushkarini' ? 'Holy Tank' :
                  layout.layoutType === 'geo-nature-park' ? 'Rock Arch' :
                  layout.layoutType === 'shopping-market' ? 'Main Bazaar' :
                  layout.layoutType === 'dining-restaurant' ? 'Dining Hall' :
                  layout.layoutType === 'museum-gallery' ? 'Exhibits' :
                  layout.layoutType === 'trek-trail' ? 'Summit' :
                  layout.layoutType === 'hill-waterfall' ? 'Main Falls' :
                  layout.layoutType === 'heritage-fort' ? 'Palace' : 'Sanctum'
                ) :
                 pin.category === 'entry' ? 'Entrance' :
                 pin.category === 'queue' ? (layout.layoutType === 'annaprasadam-complex' ? 'Holding Hall' : 'Queue') :
                 pin.category === 'laddu' ? (layout.layoutType === 'city-shrine' ? 'Kumkum / Prasadam' : 'Prasadam') :
                 pin.category === 'footwear' ? (layout.layoutType === 'sacred-pushkarini' ? 'Footwear & Rooms' : 'Footwear') :
                 pin.category === 'food' ? (layout.layoutType === 'annaprasadam-complex' ? 'Dining Halls 1–4' : (layout.layoutType === 'shopping-market' ? 'Street Food' : 'Food / Dining')) :
                 pin.category === 'parking' ? 'Parking' :
                 pin.category === 'medical' ? 'Medical' :
                 pin.category === 'safari' ? 'Safari' :
                 layout.layoutType === 'botanical-garden' ? (pin.id.includes('topiary') ? 'Topiary Walk' : pin.id.includes('garland') ? 'Garland Pavilion' : 'Gardens') :
                 layout.layoutType === 'annaprasadam-complex' ? (pin.id.includes('kitchen') ? 'Mega Kitchen' : pin.id.includes('donor') ? 'Donor Desk' : 'Complex') :
                 layout.layoutType === 'sacred-pushkarini' ? (pin.id.includes('varaha') ? 'Varahaswamy' : pin.id.includes('way') ? 'Temple Walkway' : 'Ghats') :
                 layout.layoutType === 'geo-nature-park' ? (pin.id.includes('viewing') ? 'Viewing Deck' : 'Garden Path') :
                 layout.layoutType === 'shopping-market' ? 'Textiles' :
                 layout.layoutType === 'museum-gallery' ? 'Pavilion' :
                 layout.layoutType === 'ancient-shrine' ? (
                   pin.id.includes('dhwaja') ? 'Dhwajasthambham' :
                   pin.id.includes('sangam') || pin.id.includes('ghat') ? 'River Ghats' :
                   pin.id.includes('view') || pin.id.includes('hills') ? 'View Balcony' :
                   pin.id.includes('padmavathi') || pin.id.includes('anandavalli') || pin.id.includes('shrine') || pin.id.includes('anjaneya') || pin.id.includes('ranganatha') ? 'Sub-Shrine' :
                   pin.id.includes('inscription') ? 'Inscriptions' : 'Courtyard'
                 ) :
                 layout.layoutType === 'city-shrine' ? 'Dhwajasthambham' :
                 layout.layoutType === 'trek-trail' ? 'Waypoint' :
                 layout.layoutType === 'hill-waterfall' ? 'Viewpoint' :
                 layout.layoutType === 'wildlife-safari' ? 'Aviary' : 'Pushkarini');

            const icon = 
              layout.layoutType === 'botanical-garden' && pin.category === 'sanctum' ? '🌸' :
              layout.layoutType === 'botanical-garden' && pin.id.includes('topiary') ? '🌳' :
              layout.layoutType === 'botanical-garden' && pin.id.includes('garland') ? '🌺' :
              layout.layoutType === 'annaprasadam-complex' && pin.category === 'food' ? '🍲' :
              layout.layoutType === 'annaprasadam-complex' && pin.id.includes('kitchen') ? '🍳' :
              layout.layoutType === 'annaprasadam-complex' && pin.id.includes('donor') ? '🌸' :
              layout.layoutType === 'sacred-pushkarini' && pin.category === 'sanctum' ? '🌊' :
              layout.layoutType === 'sacred-pushkarini' && pin.id.includes('varaha') ? '🛕' :
              layout.layoutType === 'sacred-pushkarini' && pin.id.includes('way') ? '🏛️' :
              layout.layoutType === 'geo-nature-park' && pin.category === 'sanctum' ? '🪨' :
              layout.layoutType === 'geo-nature-park' && pin.id.includes('garden') ? '🌿' :
              layout.layoutType === 'geo-nature-park' && pin.id.includes('viewing') ? '🔭' :
              layout.layoutType === 'shopping-market' && pin.category === 'sanctum' ? '🛍️' :
              layout.layoutType === 'shopping-market' && pin.category === 'info' ? '🧵' :
              layout.layoutType === 'dining-restaurant' && pin.category === 'sanctum' ? '🍽️' :
              layout.layoutType === 'museum-gallery' && pin.category === 'sanctum' ? '🏛️' :
              pin.id.includes('dhwaja') ? '🚩' :
              pin.id.includes('sangam') || pin.id.includes('ghat') ? '🌊' :
              pin.id.includes('view') || pin.id.includes('hills') ? '🔭' :
              pin.id.includes('shrine') || pin.id.includes('padmavathi') || pin.id.includes('anandavalli') || pin.id.includes('anjaneya') || pin.id.includes('ranganatha') ? '🛕' :
              layout.layoutType === 'city-shrine' && pin.category === 'info' ? '🚩' :
              layout.layoutType === 'city-shrine' && pin.category === 'laddu' ? '🌸' :
              cat.icon;

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
                <g transform="translate(0, -16)">
                  <rect 
                    x="-42" 
                    y="-11" 
                    width="84" 
                    height="22" 
                    rx="11" 
                    fill={cat.bg} 
                    stroke={cat.border} 
                    strokeWidth={isSelected ? "2.2" : "1.4"} 
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.12))"
                  />
                  <text 
                    x="0" 
                    y="4" 
                    fontSize="9.5" 
                    fontWeight="800" 
                    textAnchor="middle" 
                    fill={cat.text}
                  >
                    {icon} {label}
                  </text>
                  <polygon 
                    points="0,16 -3,11 3,11" 
                    fill={cat.border} 
                  />
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
          const icon = 
            layout.layoutType === 'geo-nature-park' && pin.category === 'sanctum' ? '🪨' :
            layout.layoutType === 'geo-nature-park' && pin.id.includes('garden') ? '🌿' :
            layout.layoutType === 'geo-nature-park' && pin.id.includes('viewing') ? '🔭' :
            layout.layoutType === 'shopping-market' && pin.category === 'sanctum' ? '🛍️' :
            layout.layoutType === 'shopping-market' && pin.category === 'info' ? '🧵' :
            layout.layoutType === 'dining-restaurant' && pin.category === 'sanctum' ? '🍽️' :
            layout.layoutType === 'museum-gallery' && pin.category === 'sanctum' ? '🏛️' :
            layout.layoutType === 'city-shrine' && pin.category === 'info' ? '🚩' :
            layout.layoutType === 'city-shrine' && pin.category === 'laddu' ? '🌸' :
            cat.icon;

          return (
            <button
              key={pin.id}
              onClick={() => setActivePin(pin)}
              className={`${styles.legendPill} ${isSelected ? styles.legendPillActive : ''}`}
            >
              <span>{icon}</span>
              <span>{lang === 'te' ? pin.nameTe : pin.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Pin Detail Card */}
      {activePin && (
        <div className={styles.pinDetailCard}>
          <div className={styles.pinDetailHeader}>
            <span className={styles.pinTitle}>
              <span>{CATEGORY_STYLES[activePin.category]?.icon || '📍'}</span>
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
