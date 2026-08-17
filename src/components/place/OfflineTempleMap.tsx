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
              ARCHITECTURAL BACKDROP (Clean pure graphics, NO static text)
              ═══════════════════════════════════════════════════ */}
          {layout.layoutType === 'ancient-shrine' ? (
            /* 1. ANCIENT SHRINE (Gudimallam, Appalayagunta) */
            <g>
              <rect x="50" y="30" width="440" height="270" rx="16" fill="#FDFBF7" stroke="#D97706" strokeWidth="2" strokeDasharray="8 3" />
              <rect x="150" y="60" width="240" height="200" rx="12" fill="#F4EFE6" stroke="#92400E" strokeWidth="1.5" />

              {/* Stone Pillars */}
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

              {/* ASI Pillar Pedestal */}
              <rect x="105" y="145" width="40" height="30" rx="4" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />

              {/* Mukha Mandapam Gateway */}
              <rect x="220" y="215" width="100" height="30" rx="6" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />

              {/* Village Tree Grove */}
              <g fill="#16A34A" opacity="0.65">
                <circle cx="80" cy="60" r="12" />
                <circle cx="100" cy="55" r="9" />
                <circle cx="450" cy="65" r="14" />
                <circle cx="470" cy="60" r="10" />
              </g>
            </g>
          ) : layout.layoutType === 'trek-trail' ? (
            /* 2. SACRED FOOTPATH & TREK (Alipiri Mettu / Garuda Statue, Srivari Mettu) */
            <g>
              {/* Mountain Foothill Silhouette */}
              <path d="M 20 180 Q 150 70 270 90 Q 390 60 520 160 L 520 320 L 20 320 Z" fill="#F4F8F4" stroke="#CBD5E1" strokeWidth="1.5" />

              {/* Stepped Stone Walking Staircase Trail */}
              <path d="M 270 280 L 270 70" stroke="#CBD5E1" strokeWidth="20" strokeLinecap="round" />
              <path d="M 270 280 L 270 70" stroke="#E2E8F0" strokeWidth="14" strokeDasharray="3 3" />

              {/* Resting Mandapams / Waypoint Pavilions */}
              <rect x="235" y="145" width="70" height="30" rx="6" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="1.5" />
              <rect x="240" y="55" width="60" height="30" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />

              {/* Hilltop Forest Pine Trees */}
              <g fill="#15803D" opacity="0.6">
                <polygon points="120,120 100,160 140,160" />
                <polygon points="170,100 150,140 190,140" />
                <polygon points="370,100 350,140 390,140" />
                <polygon points="430,120 410,160 450,160" />
              </g>
            </g>
          ) : layout.layoutType === 'hill-waterfall' ? (
            /* 3. HILL & WATERFALL (Kapila Theertham, Talakona, Kailasakona) */
            <g>
              {/* Rocky Mountain Backdrop */}
              <path d="M 30 140 Q 150 40 270 50 Q 390 40 510 140 L 510 310 L 30 310 Z" fill="#F5F3EF" stroke="#CBD5E1" strokeWidth="2" />

              {/* Mountain Waterfall Cascade */}
              <g transform="translate(245, 30)">
                <path d="M 25 0 Q 20 40 25 80" stroke="#0284C7" strokeWidth="16" strokeLinecap="round" opacity="0.6" />
                <path d="M 25 0 Q 30 40 25 80" stroke="#BAE6FD" strokeWidth="8" strokeLinecap="round" />
              </g>

              {/* Sacred Temple Kund Pool */}
              <g transform="translate(210, 50)">
                <rect x="0" y="0" width="120" height="40" rx="8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
                <rect x="4" y="4" width="112" height="32" rx="6" fill="url(#waterTankGrad)" />
              </g>

              {/* Shiva Sanctum Mandapam */}
              <g transform="translate(225, 135)">
                <circle cx="45" cy="45" r="42" fill="url(#sanctumGlow)" />
                <rect x="10" y="10" width="70" height="65" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
                <polygon points="45,15 20,60 70,60" fill="url(#goldVimana)" stroke="#92400E" strokeWidth="1.2" />
              </g>
            </g>
          ) : layout.layoutType === 'wildlife-safari' ? (
            /* 4. WILDLIFE & PARKS (SV Zoo Park, Deer Park) */
            <g>
              <rect x="30" y="25" width="480" height="285" rx="18" fill="#F4F9F4" stroke="#86EFAC" strokeWidth="2" />
              
              {/* Predator Zone */}
              <rect x="330" y="55" width="150" height="90" rx="12" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5 3" />

              {/* Herbivore Valley */}
              <rect x="60" y="120" width="160" height="100" rx="12" fill="#F0FDF4" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="5 3" />

              {/* Aviary */}
              <ellipse cx="270" cy="140" rx="50" ry="35" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Trees */}
              <g fill="#16A34A" opacity="0.6">
                <circle cx="80" cy="65" r="10" />
                <circle cx="260" cy="65" r="8" />
                <circle cx="450" cy="275" r="10" />
              </g>
            </g>
          ) : (
            /* 5. GRAND TEMPLE (Tirumala, Padmavathi, Govindaraja, Srikalahasti) */
            <g>
              {/* Outer Prakaram Wall */}
              <rect x="40" y="30" width="460" height="270" rx="16" fill="#F8F5EE" stroke="#B45309" strokeWidth="2.5" strokeDasharray="10 3" />
              <circle cx="45" cy="35" r="8" fill="#E2D9C8" stroke="#B45309" strokeWidth="1" />
              <circle cx="495" cy="35" r="8" fill="#E2D9C8" stroke="#B45309" strokeWidth="1" />

              {/* Inner Pradakshina Corridor */}
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
              : (pin.category === 'sanctum' ? (layout.layoutType === 'trek-trail' ? 'Summit' : layout.layoutType === 'hill-waterfall' ? 'Main Falls' : layout.layoutType === 'heritage-fort' ? 'Palace' : 'Sanctum') :
                 pin.category === 'entry' ? 'Entrance' :
                 pin.category === 'queue' ? 'Queue' :
                 pin.category === 'laddu' ? 'Prasadam' :
                 pin.category === 'footwear' ? 'Footwear' :
                 pin.category === 'food' ? 'Food / Water' :
                 pin.category === 'parking' ? 'Parking' :
                 pin.category === 'medical' ? 'Medical' :
                 pin.category === 'safari' ? 'Safari' :
                 layout.layoutType === 'ancient-shrine' ? 'Inscriptions' :
                 layout.layoutType === 'trek-trail' ? 'Waypoint' :
                 layout.layoutType === 'hill-waterfall' ? 'Viewpoint' :
                 layout.layoutType === 'wildlife-safari' ? 'Aviary' : 'Pushkarini');

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
                    x="-40" 
                    y="-11" 
                    width="80" 
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
                    {cat.icon} {label}
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
          return (
            <button
              key={pin.id}
              onClick={() => setActivePin(pin)}
              className={`${styles.legendPill} ${isSelected ? styles.legendPillActive : ''}`}
            >
              <span>{cat.icon}</span>
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
