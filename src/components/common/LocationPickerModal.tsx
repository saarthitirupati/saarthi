'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Search, X, Check, Compass, Building, Map, Sparkles } from 'lucide-react';
import { useTrip } from '@/components/TripContext';
import { detectCoordinates, isCoordinateOnTirumalaHill, TIRUPATI_CENTER, TIRUMALA_CENTER } from '@/lib/location';
import { useLanguage } from '@/lib/useLanguage';

export interface LocationOption {
  id: string;
  nameEn: string;
  nameTe: string;
  shortName: string;
  category: 'local-hub' | 'kshethram' | 'transit-hub' | 'planning-city';
  subtextEn: string;
  subtextTe: string;
  coords: { lat: number; lng: number };
}

export const PRESET_LOCATIONS: LocationOption[] = [
  // ── LOCAL PILGRIM HUBS ──
  {
    id: 'tirupati',
    nameEn: 'Tirupati (City & Foothills)',
    nameTe: 'తిరుపతి (నగరం & అలిపిరి దిగువ)',
    shortName: 'Tirupati',
    category: 'local-hub',
    subtextEn: 'Alipiri, Railway Station, Central RTC Bus Stand',
    subtextTe: 'అలిపిరి, రైల్వే స్టేషన్, సెంట్రల్ బస్టాండ్',
    coords: TIRUPATI_CENTER
  },
  {
    id: 'tirumala',
    nameEn: 'Tirumala (Hill Top & Sanctum)',
    nameTe: 'తిరుమల (కొండపై & శ్రీవారి సన్నిధి)',
    shortName: 'Tirumala',
    category: 'local-hub',
    subtextEn: 'Venkateswara Temple, CRO, Balaji Nagar, Mada Streets',
    subtextTe: 'శ్రీవారి ఆలయం, సీఆర్వో, బాలాజీ నగర్, మాడ వీధులు',
    coords: TIRUMALA_CENTER
  },
  {
    id: 'renigunta',
    nameEn: 'Renigunta (Airport & Rail Hub)',
    nameTe: 'రేణిగుంట (విమానాశ్రయం & రైల్వే జంక్షన్)',
    shortName: 'Renigunta',
    category: 'transit-hub',
    subtextEn: 'Tirupati Airport (TIR) & Major Rail Junction',
    subtextTe: 'తిరుపతి ఎయిర్‌పోర్ట్ మరియు రైల్వే జంక్షన్',
    coords: { lat: 13.6477, lng: 79.5167 }
  },
  {
    id: 'chandragiri',
    nameEn: 'Chandragiri (Fort & Suburbs)',
    nameTe: 'చంద్రగిరి (కోట & చుట్టుపక్కల)',
    shortName: 'Chandragiri',
    category: 'transit-hub',
    subtextEn: 'Historic Raja Mahal Fort & Valley',
    subtextTe: 'రాజమహల్ కోట మరియు పరిసరాలు',
    coords: { lat: 13.5843, lng: 79.3158 }
  },

  // ── NEARBY KSHETHRAMS ──
  {
    id: 'srikalahasti',
    nameEn: 'Srikalahasti (Vayu Lingam)',
    nameTe: 'శ్రీకాళహస్తి (వాయు లింగేశ్వరుడు)',
    shortName: 'Srikalahasti',
    category: 'kshethram',
    subtextEn: 'Rahu-Ketu Kshethram (~38 km from Tirupati)',
    subtextTe: 'రాహు-కేతు పరిహార క్షేత్రం (తిరుపతికి ~38 కి.మీ)',
    coords: { lat: 13.7500, lng: 79.7000 }
  },
  {
    id: 'kanipakam',
    nameEn: 'Kanipakam (Varasiddhi Vinayaka)',
    nameTe: 'కాణిపాకం (వరసిద్ధి వినాయక క్షేత్రం)',
    shortName: 'Kanipakam',
    category: 'kshethram',
    subtextEn: 'Swayambhu Vinayaka Temple (~70 km from Tirupati)',
    subtextTe: 'స్వయంభూ వినాయక ఆలయం (తిరుపతికి ~70 కి.మీ)',
    coords: { lat: 13.2845, lng: 79.0345 }
  },
  {
    id: 'srinivasa-mangapuram',
    nameEn: 'Srinivasa Mangapuram',
    nameTe: 'శ్రీనివాస మంగాపురం',
    shortName: 'Srinivasa Mangapuram',
    category: 'kshethram',
    subtextEn: 'Sri Kalyana Venkateswara Swamy Temple (~12 km)',
    subtextTe: 'శ్రీ కల్యాణ వేంకటేశ్వర స్వామి సన్నిధి (~12 కి.మీ)',
    coords: { lat: 13.6108, lng: 79.3277 }
  },
  {
    id: 'appalayagunta',
    nameEn: 'Appalayagunta',
    nameTe: 'అప్పలాయగుంట',
    shortName: 'Appalayagunta',
    category: 'kshethram',
    subtextEn: 'Sri Prasanna Venkateswara Swamy (~16 km)',
    subtextTe: 'శ్రీ ప్రసన్న వేంకటేశ్వర స్వామి సన్నిధి (~16 కి.మీ)',
    coords: { lat: 13.5374, lng: 79.4776 }
  },

  // ── MAJOR PLANNING HUBS (PLANNING FROM HOME) ──
  {
    id: 'bengaluru',
    nameEn: 'Bengaluru (Planning Trip)',
    nameTe: 'బెంగళూరు (యాత్ర ప్లానింగ్)',
    shortName: 'Bengaluru',
    category: 'planning-city',
    subtextEn: 'Majestic / Kempegowda Intl Airport (~250 km)',
    subtextTe: 'మెజెస్టిక్ / విమానాశ్రయం (~250 కి.మీ)',
    coords: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 'chennai',
    nameEn: 'Chennai (Planning Trip)',
    nameTe: 'చెన్నై (యాత్ర ప్లానింగ్)',
    shortName: 'Chennai',
    category: 'planning-city',
    subtextEn: 'Central / Koyambedu / Airport (~135 km)',
    subtextTe: 'సెంట్రల్ / కోయంబేడు / ఎయిర్‌పోర్ట్ (~135 కి.మీ)',
    coords: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 'hyderabad',
    nameEn: 'Hyderabad (Planning Trip)',
    nameTe: 'హైదరాబాద్ (యాత్ర ప్లానింగ్)',
    shortName: 'Hyderabad',
    category: 'planning-city',
    subtextEn: 'Secunderabad / Shamshabad Airport (~550 km)',
    subtextTe: 'సికింద్రాబాద్ / శంషాబాద్ ఎయిర్‌పోర్ట్ (~550 కి.మీ)',
    coords: { lat: 17.3850, lng: 78.4867 }
  },
  {
    id: 'vijayawada',
    nameEn: 'Vijayawada (Planning Trip)',
    nameTe: 'విజయవాడ (యాత్ర ప్లానింగ్)',
    shortName: 'Vijayawada',
    category: 'planning-city',
    subtextEn: 'Central Junction / Kanaka Durga (~380 km)',
    subtextTe: 'రైల్వే జంక్షన్ / కనకదుర్గ (~380 కి.మీ)',
    coords: { lat: 16.5062, lng: 80.6480 }
  },
  {
    id: 'nellore',
    nameEn: 'Nellore',
    nameTe: 'నెల్లూరు',
    shortName: 'Nellore',
    category: 'planning-city',
    subtextEn: 'NH16 Corridor (~130 km)',
    subtextTe: 'జాతీయ రహదారి 16 కారిడార్ (~130 కి.మీ)',
    coords: { lat: 14.4426, lng: 79.9865 }
  },
  {
    id: 'kadapa',
    nameEn: 'Kadapa (Devuni Kadapa)',
    nameTe: 'కడప (దేవుని కడప)',
    shortName: 'Kadapa',
    category: 'planning-city',
    subtextEn: 'Gateway to Tirumala (~140 km)',
    subtextTe: 'శ్రీవారి ముఖద్వారం కడప (~140 కి.మీ)',
    coords: { lat: 14.4673, lng: 78.8242 }
  },
  {
    id: 'anantapur',
    nameEn: 'Anantapur',
    nameTe: 'అనంతపురం',
    shortName: 'Anantapur',
    category: 'planning-city',
    subtextEn: 'Rayalaseema Gateway (~290 km)',
    subtextTe: 'రాయలసీమ ముఖద్వారం (~290 కి.మీ)',
    coords: { lat: 14.6819, lng: 77.6006 }
  },
  {
    id: 'vellore',
    nameEn: 'Vellore (Golden Temple)',
    nameTe: 'వెల్లూరు (స్వర్ణ దేవాలయం)',
    shortName: 'Vellore',
    category: 'planning-city',
    subtextEn: 'Sripuram & Katpadi Junction (~105 km)',
    subtextTe: 'శ్రీపురం మరియు కాట్పాడి (~105 కి.మీ)',
    coords: { lat: 12.9165, lng: 79.1325 }
  }
];

export interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocationName?: string;
  onSelectLocation?: (name: string, coords: { lat: number; lng: number }) => void;
}

export function LocationPickerModal({
  isOpen,
  onClose,
  selectedLocationName,
  onSelectLocation
}: LocationPickerModalProps) {
  const lang = useLanguage();
  const { setUserLocation, setLocationName, setLocationPermission, locationName } = useTrip();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'local' | 'planning'>('all');
  const [isLocating, setIsLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeName = selectedLocationName || locationName || 'Tirupati';

  const filteredLocations = useMemo(() => {
    return PRESET_LOCATIONS.filter((loc) => {
      // Tab filter
      if (activeTab === 'local' && loc.category === 'planning-city') return false;
      if (activeTab === 'planning' && loc.category !== 'planning-city') return false;

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        loc.nameEn.toLowerCase().includes(q) ||
        loc.nameTe.toLowerCase().includes(q) ||
        loc.shortName.toLowerCase().includes(q) ||
        loc.subtextEn.toLowerCase().includes(q) ||
        loc.subtextTe.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeTab]);

  const handleSelectLocation = (loc: LocationOption) => {
    setUserLocation(loc.coords);
    setLocationName(loc.shortName);
    setLocationPermission('granted');
    if (typeof window !== 'undefined') {
      localStorage.setItem('saarthi_user_region', loc.shortName);
    }
    if (onSelectLocation) {
      onSelectLocation(loc.shortName, loc.coords);
    }
    onClose();
  };

  const handleAutoDetectGPS = () => {
    setIsLocating(true);
    setStatusMessage(lang === 'te' ? 'జీపీఎస్ సిగ్నల్ శోధిస్తోంది...' : 'Acquiring high-accuracy GPS...');
    
    detectCoordinates(
      (coords) => {
        setIsLocating(false);
        setUserLocation(coords);
        setLocationPermission('granted');
        
        const isTirumala = isCoordinateOnTirumalaHill(coords.lat, coords.lng);
        const resolvedName = isTirumala ? 'Tirumala' : 'Tirupati';
        setLocationName(resolvedName);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('saarthi_user_region', resolvedName);
        }
        if (onSelectLocation) {
          onSelectLocation(resolvedName, coords);
        }
        onClose();
      },
      () => {
        setIsLocating(false);
        setStatusMessage(lang === 'te' ? 'జీపీఎస్ అనుమతించబడలేదు. దయచేసి క్రింద ఉన్న నగరాన్ని ఎంచుకోండి.' : 'GPS unavailable. Please select your city below.');
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.22)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 20px 14px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#FEF3C7', border: '1px solid #FDE68A',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <MapPin size={18} color="#B45309" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                {lang === 'te' ? 'మీ ప్రారంభ ప్రాంతాన్ని ఎంచుకోండి' : 'Choose Your Starting Location'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                {lang === 'te' ? 'సరియైన దూరం & మార్గ సమయం కోసం' : 'For accurate route times & recommendations'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              transition: 'background 0.2s'
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          
          {/* GPS Auto-Detect CTA Button */}
          <button
            onClick={handleAutoDetectGPS}
            disabled={isLocating}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '16px',
              background: isLocating ? '#F0FDF4' : 'linear-gradient(135deg, #ECFDF5 0%, #E6FBF0 100%)',
              border: '1.5px solid #10B981',
              color: '#065F46',
              fontWeight: 800,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              marginBottom: '14px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)',
              transition: 'all 0.2s'
            }}
          >
            <Navigation size={17} className={isLocating ? 'animate-spin' : ''} style={{ color: '#059669' }} />
            <span>
              {isLocating 
                ? (lang === 'te' ? 'జీపీఎస్ సిగ్నల్ శోధిస్తోంది...' : 'Acquiring Live GPS...')
                : (lang === 'te' ? 'లైవ్ GPS లొకేషన్ ఉపయోగించు' : 'Use Current Live GPS Location')}
            </span>
          </button>

          {statusMessage && (
            <p style={{ fontSize: '12px', color: '#D97706', margin: '-6px 0 12px 0', textAlign: 'center', fontWeight: 600 }}>
              {statusMessage}
            </p>
          )}

          {/* Not on GPS Hint Card */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '10px 12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <Sparkles size={16} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
              {lang === 'te' 
                ? 'మీరు ప్రస్తుతం తిరుపతిలో లేకపోతే, ఇంటి నుండి ప్లాన్ చేయడానికి మీ ప్రారంభ నగరాన్ని ఎంచుకోండి.'
                : 'Not in Tirupati right now? Pick your starting city to calculate exact highway travel times and trip itineraries.'}
            </p>
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#F1F5F9',
            borderRadius: '14px',
            padding: '8px 12px',
            marginBottom: '12px'
          }}>
            <Search size={16} color="#64748B" />
            <input 
              type="text"
              placeholder={lang === 'te' ? 'నగరం లేదా క్షేత్రం శోధించండి...' : 'Search city, station, or temple...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                color: '#0F172A',
                fontWeight: 600
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tab Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'all', labelEn: 'All Places', labelTe: 'అన్ని ప్రాంతాలు' },
              { id: 'local', labelEn: 'Tirupati & Hills', labelTe: 'తిరుపతి & కొండపై' },
              { id: 'planning', labelEn: 'From Other Cities', labelTe: 'ఇతర నగరాల నుండి' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  border: activeTab === tab.id ? '1px solid #B45309' : '1px solid #E2E8F0',
                  background: activeTab === tab.id ? '#FEF3C7' : '#FFFFFF',
                  color: activeTab === tab.id ? '#92400E' : '#64748B',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                {lang === 'te' ? tab.labelTe : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Location List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredLocations.map((loc) => {
              const isSelected = activeName.toLowerCase() === loc.shortName.toLowerCase();
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid #0F5132' : '1px solid #E2E8F0',
                    background: isSelected ? '#F0FDF4' : '#FAFAFA',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.15s, border 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: isSelected ? '#DCFCE7' : '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MapPin size={15} color={isSelected ? '#15803D' : '#64748B'} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {lang === 'te' ? loc.nameTe : loc.nameEn}
                      </p>
                      <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                        {lang === 'te' ? loc.subtextTe : loc.subtextEn}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: '#0F5132', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}

            {filteredLocations.length === 0 && (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748B' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>
                  {lang === 'te' ? 'ఫలితాలు కనుగొనబడలేదు' : 'No locations found matching your search.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Drop-in Location Pill Button matching exact warm amber UI:
 * [📍 Location ⌄]
 */
export function LocationPill({
  locationName,
  onClick,
  style
}: {
  locationName: string;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      title="Change Starting Location"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: '#FEF3C7',
        border: '1px solid #FDE68A',
        color: '#92400E',
        padding: '5px 12px',
        borderRadius: '9999px',
        fontSize: '12.5px',
        fontWeight: 800,
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(180, 83, 9, 0.08)',
        userSelect: 'none',
        transition: 'all 0.15s ease',
        ...style
      }}
    >
      <MapPin size={13} color="#B45309" strokeWidth={2.2} />
      <span style={{ color: '#92400E', letterSpacing: '-0.01em' }}>{locationName || 'Tirupati'}</span>
      <span style={{ color: '#B45309', fontSize: '10px', display: 'flex', alignItems: 'center', opacity: 0.85 }}>▼</span>
    </div>
  );
}
