'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Car, Bike, Zap, Bus, Footprints, 
  CheckCircle2, AlertTriangle, Mountain, Fuel, 
  Navigation, Locate, Compass, Clock,
  CircleParking, Milestone, ExternalLink,
  SlidersHorizontal, ChevronDown, ChevronUp, Leaf, Minus, Plus,
  AlertCircle
} from 'lucide-react';
import styles from './TripEstimator.module.css';
import { PLACES } from '@/data/places';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { 
  calculateTripEstimates, 
  TripEstimateResult, 
  TransportEstimate, 
  FuelRates, 
  DEFAULT_FUEL_RATES,
  PILGRIM_FUEL_BUNKS
} from '@/services/decision/trip.estimator';
import { useLanguage } from '@/lib/useLanguage';
import { detectCoordinates } from '@/lib/location';
import { SrivariNamamVector } from '@/components/common/DevotionalSvgIcons';

const MAJOR_HUBS: Record<string, { name: string; lat: number; lng: number }> = {
  'renigunta-junction': { name: 'Tirupati Central / Railway Station', lat: 13.6288, lng: 79.4192 },
  'central-bus-station': { name: 'APSRTC Central Bus Station (CBS)', lat: 13.6335, lng: 79.4215 },
  'alipiri-checkpoint': { name: 'Alipiri Toll Gate / Ghat Road Entry', lat: 13.6470, lng: 79.4058 },
  'alipiri-gateway': { name: 'Alipiri Gateway (Mettu Footpath Entry)', lat: 13.6470, lng: 79.4058 },
  'srinivasam': { name: 'Srinivasam Complex (Opp. RTC Bus Stand)', lat: 13.6320, lng: 79.4225 },
  'vishnu-nivasam': { name: 'Vishnu Nivasam (Opp. Railway Station)', lat: 13.6292, lng: 79.4185 },
  'tirupati-airport': { name: 'Tirupati International Airport (TIR)', lat: 13.6324, lng: 79.5434 },
  'tirumala-bus-stand': { name: 'Tirumala CRO / Central Bus Stand', lat: 13.6820, lng: 79.3490 },
};

const MODE_ICON_MAP: Record<string, { Icon: typeof Car; color: string }> = {
  walk: { Icon: Footprints, color: '#16A34A' },
  bike: { Icon: Bike, color: '#E9801D' },
  car: { Icon: Car, color: '#2563EB' },
  car_diesel: { Icon: Car, color: '#0284C7' },
  suv: { Icon: Car, color: '#7C3AED' },
  ev: { Icon: Zap, color: '#059669' },
  auto: { Icon: Zap, color: '#D97706' },
  bus: { Icon: Bus, color: '#059669' },
};

function TripEstimatorContent() {
  const searchParams = useSearchParams();
  const lang = useLanguage();
  const { places } = useRealtimePlaces(PLACES);
  const placesList = useMemo(() => (places.length > 0 ? places : PLACES), [places]);

  const initialDest = searchParams?.get('destId') || 'venkateswara';
  const initialOrigin = searchParams?.get('originId') || 'renigunta-junction';

  // State
  const [useLiveGps, setUseLiveGps] = useState<boolean>(false);
  const [userGpsCoords, setUserGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [originId, setOriginId] = useState<string>(initialOrigin);
  const [destId, setDestId] = useState<string>(initialDest);
  const [passengers, setPassengers] = useState<number>(1);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'bike' | 'car' | 'ev' | 'bus' | 'walk'>('all');

  // Custom mileage overrides
  const [bikeMileage, setBikeMileage] = useState<number>(52);
  const [carMileage, setCarMileage] = useState<number>(16);
  const [carDieselMileage, setCarDieselMileage] = useState<number>(20);
  const [suvMileage, setSuvMileage] = useState<number>(12);
  const [evMileage, setEvMileage] = useState<number>(7.14);

  // Accordion states
  const [showFuelSettings, setShowFuelSettings] = useState<boolean>(false);
  const [showAllModes, setShowAllModes] = useState<boolean>(false);
  const [showFuelPumps, setShowFuelPumps] = useState<boolean>(false);
  const [expandedBreakdown, setExpandedBreakdown] = useState<string | null>(null);

  // Live Fuel Rates
  const [fuelRates, setFuelRates] = useState<FuelRates>(DEFAULT_FUEL_RATES);
  const [fuelSource, setFuelSource] = useState<string>('IndianAPI (Live)');

  const [estimateResult, setEstimateResult] = useState<TripEstimateResult | null>(null);

  // Geolocation Handler
  const handleGetLiveLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    detectCoordinates(
      (coords) => {
        setUserGpsCoords(coords);
        setUseLiveGps(true);
        setGpsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsError('GPS location access denied or timed out. Using default starting hub.');
        setUseLiveGps(false);
        setGpsLoading(false);
      }
    );
  }, []);

  // Auto-request live location on mount
  useEffect(() => {
    handleGetLiveLocation();
  }, [handleGetLiveLocation]);

  // Fetch Live Fuel Rates on Mount
  useEffect(() => {
    async function loadFuelRates() {
      try {
        const res = await fetch('/api/fuel-prices');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.rates) {
            setFuelRates(json.data.rates);
            if (json.data.source) setFuelSource(json.data.source);
          }
        }
      } catch (e) {
        console.error('Fuel rates fetch error:', e);
      }
    }
    loadFuelRates();
  }, []);

  // Resolve coordinates & calculate estimates immediately
  useEffect(() => {
    let oLat = 13.6288;
    let oLng = 79.4192;
    let oName = 'Tirupati Central / Railway Station';

    if (useLiveGps && userGpsCoords) {
      oLat = userGpsCoords.lat;
      oLng = userGpsCoords.lng;
      oName = 'Your Live Location (GPS)';
    } else if (MAJOR_HUBS[originId]) {
      oLat = MAJOR_HUBS[originId].lat;
      oLng = MAJOR_HUBS[originId].lng;
      oName = MAJOR_HUBS[originId].name;
    } else {
      const foundOrigin = placesList.find(p => p.id === originId);
      if (foundOrigin && foundOrigin.coordinates) {
        oLat = foundOrigin.coordinates.lat;
        oLng = foundOrigin.coordinates.lng;
        oName = foundOrigin.name;
      }
    }

    let dLat = 13.6780;
    let dLng = 79.3510;
    let dName = 'Srivari Venkateswara Temple';

    const foundDest = placesList.find(p => p.id === destId);
    if (foundDest && foundDest.coordinates) {
      dLat = foundDest.coordinates.lat;
      dLng = foundDest.coordinates.lng;
      dName = foundDest.name;
    }

    calculateTripEstimates({
      originLat: oLat,
      originLng: oLng,
      destLat: dLat,
      destLng: dLng,
      originName: oName,
      destName: dName,
      passengers,
      isRoundTrip,
      customMileage: {
        bike: bikeMileage,
        car: carMileage,
        carDiesel: carDieselMileage,
        suv: suvMileage,
        ev: evMileage
      },
      fuelRates
    }).then(res => {
      setEstimateResult(res);
    }).catch(() => {});

  }, [
    originId, destId, passengers, isRoundTrip, 
    bikeMileage, carMileage, carDieselMileage, suvMileage, evMileage,
    fuelRates, useLiveGps, userGpsCoords, placesList
  ]);

  const filteredEstimates = useMemo(() => {
    if (!estimateResult) return [];
    const entries = Object.entries(estimateResult.estimates);
    if (activeTab === 'all') return entries;
    if (activeTab === 'bike') return entries.filter(([k]) => k === 'bike');
    if (activeTab === 'car') return entries.filter(([k]) => k === 'car' || k === 'car_diesel' || k === 'suv');
    if (activeTab === 'ev') return entries.filter(([k]) => k === 'ev');
    if (activeTab === 'bus') return entries.filter(([k]) => k === 'bus' || k === 'auto');
    if (activeTab === 'walk') return entries.filter(([k]) => k === 'walk');
    return entries;
  }, [estimateResult, activeTab]);

  // Split into recommended (top 2-3) vs other when "All" tab is active
  const { recommendedEstimates, otherEstimates } = useMemo(() => {
    if (activeTab !== 'all') return { recommendedEstimates: filteredEstimates, otherEstimates: [] as [string, TransportEstimate][] };
    const best = filteredEstimates.filter(([, est]) => est.recommendationStatus === 'best');
    const rec = filteredEstimates.filter(([, est]) => est.recommendationStatus === 'recommended');
    const rest = filteredEstimates.filter(([, est]) => est.recommendationStatus !== 'best' && est.recommendationStatus !== 'recommended');
    // Show best + up to 2 recommended = top 3 max
    const top = [...best, ...rec.slice(0, best.length === 0 ? 3 : 2)];
    const other = [...rec.slice(best.length === 0 ? 3 : 2), ...rest];
    return { recommendedEstimates: top, otherEstimates: other };
  }, [filteredEstimates, activeTab]);

  // Destination coordinates for Google Maps navigation
  const destinationCoords = useMemo(() => {
    const found = placesList.find(p => p.id === destId);
    return found?.coordinates || { lat: 13.6832, lng: 79.3473 };
  }, [destId, placesList]);

  // Fastest travel time for summary
  const fastestTimeMins = useMemo(() => {
    if (!estimateResult) return 0;
    const times = Object.values(estimateResult.estimates).map(e => e.travelTimeMins).filter(t => t > 0);
    return times.length > 0 ? Math.min(...times) : 0;
  }, [estimateResult]);

  // Render a single transport card
  const renderTransportCard = ([key, est]: [string, TransportEstimate]) => {
    const isBest = est.recommendationStatus === 'best';
    const isWarn = est.recommendationStatus === 'not_recommended';
    const iconInfo = MODE_ICON_MAP[key] || { Icon: Car, color: '#64748B' };
    const ModeIcon = iconInfo.Icon;
    const isBreakdownOpen = expandedBreakdown === key;
    const hasCosts = est.fuelCost > 0 || est.parkingCost > 0 || est.tollCost > 0;

    return (
      <div 
        key={key} 
        className={styles.estimateCard}
        style={{
          border: isBest ? '2px solid #0F5132' : isWarn ? '1.5px solid #FCA5A5' : undefined,
          background: isBest ? '#F0FDF4' : undefined
        }}
      >
        {/* Header: Icon + Title | Price */}
        <div className={styles.estimateHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              padding: '8px',
              borderRadius: '10px',
              backgroundColor: `${iconInfo.color}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ModeIcon size={20} color={iconInfo.color} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{est.title}</h3>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <Clock size={11} /> ~{est.travelTimeMins} min · {est.distanceKm} km
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {key === 'walk' ? (
              <span className={styles.costDisplay} style={{ color: '#16A34A' }}>FREE</span>
            ) : key === 'auto' ? (
              <span className={styles.costDisplay}>₹{est.fareMin}–{est.fareMax}</span>
            ) : (
              <span className={styles.costDisplay}>₹{est.totalCostMin}</span>
            )}
            {passengers > 1 && est.costPerPerson > 0 && (
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>
                ₹{est.costPerPerson}/person
              </span>
            )}
            {est.co2Kg !== undefined && est.co2Kg > 0 && (
              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
                ~{est.co2Kg} kg CO₂
              </span>
            )}
          </div>
        </div>

        {/* Single recommendation badge */}
        {(isBest || est.recommendationStatus === 'recommended' || isWarn) && (
          <div style={{ margin: '8px 0 0' }}>
            <span 
              className={`${styles.tagBadge} ${isBest ? styles.tagBest : isWarn ? styles.tagWarning : styles.tagRec}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              {isBest ? '★ SAARTHI PICK' : isWarn ? '⚠ NOT IDEAL' : est.recommendationTag}
            </span>
          </div>
        )}

        {/* Top 2 reasons only */}
        {est.reasons.length > 0 && (
          <ul className={styles.reasonList}>
            {est.reasons.slice(0, 2).map((r, i) => (
              <li key={i} className={styles.reasonItem}>
                <CheckCircle2 size={12} color={isBest ? '#0F5132' : '#94A3B8'} />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Bus details inline */}
        {est.busDetails && (
          <div style={{ marginTop: '6px', fontSize: '12px', color: '#0F5132', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Bus size={13} color="#0F5132" />
            <span>{est.busDetails.busNumber} · {est.busDetails.frequency}</span>
          </div>
        )}

        {/* Walking extras */}
        {key === 'walk' && (est.caloriesBurned || est.stepCount) && (
          <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748B' }}>
            {est.stepCount && <span>{est.stepCount.toLocaleString()} steps</span>}
            {est.caloriesBurned && <span> · {est.caloriesBurned} kcal</span>}
          </div>
        )}

        {/* Cost breakdown toggle + Navigate */}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {hasCosts ? (
            <button
              className={styles.breakdownToggle}
              onClick={() => setExpandedBreakdown(isBreakdownOpen ? null : key)}
            >
              Cost breakdown {isBreakdownOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          ) : <div />}

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${destinationCoords.lat},${destinationCoords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navigateBtn}
          >
            <Navigation size={13} />
            <span>{key === 'walk' ? 'Start Walking' : key === 'bus' ? 'View Route' : 'Navigate'}</span>
            <ExternalLink size={10} />
          </a>
        </div>

        {/* Collapsible cost breakdown */}
        {isBreakdownOpen && hasCosts && (
          <div className={styles.breakdownContent}>
            {est.fuelCost > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Fuel size={12} color="#059669" />
                Fuel: <strong>{est.fuelUsedLiters} {est.fuelUsedUnit}</strong> · ₹{est.fuelCost}
              </span>
            )}
            {est.tollCost > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Milestone size={12} color="#2563EB" />
                Tolls: <strong>₹{est.tollCost}</strong>
              </span>
            )}
            {est.parkingCost > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CircleParking size={12} color="#7C3AED" />
                Parking: <strong>₹{est.parkingCost}</strong>
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* ═══ HEADER — Matches Explore Places ═══ */}
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn} aria-label="Back">
          <ArrowLeft size={20} />
        </Link>
        <div className={styles.headerTitleContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <SrivariNamamVector size={24} />
          <h1 style={{ margin: 0, fontFamily: "var(--font-sacred-serif), 'Cinzel', Georgia, serif", fontSize: '18px' }}>
            {lang === 'te' ? 'ప్రయాణ అంచనా' : 'Trip & Fuel'}
          </h1>
        </div>
        <div style={{ width: '40px' }} />
      </header>

      <main className={styles.content}>

        {/* ═══ 1. YOUR TRIP — Compact Config ═══ */}
        <div className={styles.card}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            {lang === 'te' ? 'మీ ప్రయాణం' : 'Your Trip'}
          </div>
          
          <div className={styles.routeSelector}>
            {/* Origin */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>From</label>
              {useLiveGps ? (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                    <div>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>Current location</span>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>GPS detected</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setUseLiveGps(false)}
                    style={{ background: 'none', border: 'none', color: '#0F5132', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    className={styles.select}
                    value={originId}
                    onChange={e => { setOriginId(e.target.value); setUseLiveGps(false); }}
                    style={{ flex: 1 }}
                  >
                    <optgroup label="Popular Starting Hubs">
                      {Object.entries(MAJOR_HUBS).map(([id, hub]) => (
                        <option key={id} value={id}>{hub.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="All Places">
                      {placesList.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </optgroup>
                  </select>
                  <button
                    type="button"
                    onClick={handleGetLiveLocation}
                    disabled={gpsLoading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '40px', height: '40px', minWidth: '40px',
                      borderRadius: '10px', border: '1px solid #E2E8F0',
                      background: '#F8FAFC', cursor: 'pointer'
                    }}
                    aria-label="Use GPS"
                  >
                    <Locate size={18} className={gpsLoading ? 'animate-spin' : ''} color="#64748B" />
                  </button>
                </div>
              )}

              {gpsError && (
                <div style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={11} />
                  <span>{gpsError}</span>
                </div>
              )}
            </div>

            {/* Destination */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>To</label>
              <select
                className={styles.select}
                value={destId}
                onChange={e => setDestId(e.target.value)}
              >
                {placesList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Trip type + Passengers row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Direction</label>
                <div className={styles.toggleGroup}>
                  <button type="button" onClick={() => setIsRoundTrip(false)} className={`${styles.toggleBtn} ${!isRoundTrip ? styles.toggleBtnActive : ''}`}>
                    One-Way
                  </button>
                  <button type="button" onClick={() => setIsRoundTrip(true)} className={`${styles.toggleBtn} ${isRoundTrip ? styles.toggleBtnActive : ''}`}>
                    Round
                  </button>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Passengers</label>
                <div className={styles.passengerCounter}>
                  <button type="button" onClick={() => setPassengers(Math.max(1, passengers - 1))} disabled={passengers <= 1} className={styles.counterBtn} aria-label="Decrease">
                    <Minus size={14} />
                  </button>
                  <div className={styles.counterValue}>{passengers}</div>
                  <button type="button" onClick={() => setPassengers(Math.min(10, passengers + 1))} disabled={passengers >= 10} className={styles.counterBtn} aria-label="Increase">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trip summary line */}
          {estimateResult && (
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={14} color="#0F5132" />
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                {estimateResult.distanceKm} km
              </span>
              <span style={{ fontSize: '13px', color: '#64748B' }}>
                · ~{fastestTimeMins} min {isRoundTrip ? '(round-trip)' : ''}
              </span>
              {estimateResult.isTirumalaRoute && (
                <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Mountain size={12} color="#D97706" /> Hill route
                </span>
              )}
            </div>
          )}
        </div>

        {/* ═══ 2. MODE FILTER TABS ═══ */}
        <div className={styles.modeTabsContainer}>
          {[
            { id: 'all', label: 'All', Icon: Compass },
            { id: 'bike', label: 'Bike', Icon: Bike },
            { id: 'car', label: 'Car', Icon: Car },
            { id: 'ev', label: 'EV', Icon: Zap },
            { id: 'bus', label: 'Bus', Icon: Bus },
            { id: 'walk', label: 'Walk', Icon: Footprints }
          ].map(tab => {
            const TabIcon = tab.Icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as typeof activeTab); setShowAllModes(false); }}
                style={{
                  backgroundColor: isSelected ? '#0F5132' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#0F172A',
                  border: isSelected ? 'none' : '1px solid #E2E8F0',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: isSelected ? '0 4px 12px rgba(15, 81, 50, 0.25)' : 'none'
                }}
              >
                <TabIcon size={14} color={isSelected ? '#FFFFFF' : '#64748B'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ═══ 3. TRANSPORT CARDS — Recommended + Other ═══ */}
        {estimateResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            
            {/* Recommended cards */}
            {recommendedEstimates.length > 0 && activeTab === 'all' && (
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '-4px' }}>
                Recommended for you
              </div>
            )}
            {recommendedEstimates.map(entry => renderTransportCard(entry))}

            {/* "Other options" accordion — only in All tab */}
            {otherEstimates.length > 0 && activeTab === 'all' && (
              <>
                <button
                  className={styles.accordionToggle}
                  onClick={() => setShowAllModes(!showAllModes)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Other options ({otherEstimates.length})
                  </span>
                  {showAllModes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showAllModes && otherEstimates.map(entry => renderTransportCard(entry))}
              </>
            )}
          </div>
        )}

        {/* ═══ 4. ROUTE CARD — Compact, Light ═══ */}
        {estimateResult && (
          <div className={styles.card} style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Route
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
              {estimateResult.originName} → {estimateResult.destinationName}
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '10px' }}>
              {estimateResult.distanceKm} km · ~{fastestTimeMins} min{isRoundTrip ? ' (round-trip)' : ''}
            </div>
            {estimateResult.isTirumalaRoute && (
              <div style={{ fontSize: '12px', color: '#D97706', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Zap size={13} color="#D97706" />
                <span>Ghat road +820m elevation — ~20% higher fuel burn</span>
              </div>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${destinationCoords.lat},${destinationCoords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navigateBtn}
            >
              <Navigation size={13} />
              <span>View route on Google Maps</span>
              <ExternalLink size={10} />
            </a>
          </div>
        )}

        {/* ═══ 5. FUEL & MILEAGE SETTINGS — Accordion ═══ */}
        <button
          className={styles.accordionToggle}
          onClick={() => setShowFuelSettings(!showFuelSettings)}
          style={{ marginBottom: showFuelSettings ? '0' : '16px' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={16} color="#64748B" />
            <span>Fuel & Mileage Settings</span>
          </span>
          {showFuelSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showFuelSettings && (
          <div className={styles.accordionContent} style={{ marginBottom: '16px' }}>
            {/* Live Fuel Prices */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                Live AP Fuel Prices ({fuelSource})
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span>Petrol: <strong style={{ color: '#059669' }}>₹{fuelRates.petrol}</strong>/L</span>
                <span>Diesel: <strong style={{ color: '#0284C7' }}>₹{fuelRates.diesel}</strong>/L</span>
                <span>CNG: <strong>₹{fuelRates.cng}</strong>/kg</span>
              </div>
            </div>

            {/* Fuel Pumps Toggle */}
            <button
              onClick={() => setShowFuelPumps(!showFuelPumps)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                border: '1px solid #E2E8F0', backgroundColor: showFuelPumps ? '#FFFBEB' : '#FFFFFF',
                color: '#475569', cursor: 'pointer', marginBottom: showFuelPumps ? '10px' : '14px'
              }}
            >
              <Fuel size={13} color="#D97706" />
              <span>{showFuelPumps ? 'Hide Fuel Stations' : 'View Pumps On Route'}</span>
              {showFuelPumps ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Fuel Pump Cards */}
            {showFuelPumps && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', color: '#92400E', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <AlertCircle size={13} color="#D97706" />
                  <span>Only <strong>1</strong> fuel pump on Tirumala hill (6 AM–8 PM). Keep 5L minimum before Alipiri.</span>
                </div>
                {PILGRIM_FUEL_BUNKS.map(bunk => (
                  <div key={bunk.id} style={{
                    backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '10px 12px',
                    border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{bunk.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                        {bunk.location} · <strong style={{ color: bunk.isHillStation ? '#DC2626' : '#16A34A' }}>{bunk.timings}</strong>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${bunk.lat},${bunk.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.navigateBtn}
                      style={{ fontSize: '11px', padding: '5px 8px' }}
                    >
                      <span>Route</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Vehicle Mileage Sliders */}
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              Custom Vehicle Mileage
            </div>

            <div className={styles.sliderRow}>
              <div className={styles.sliderHeader}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Bike size={14} color="#E9801D" /> Bike
                </span>
                <strong>{bikeMileage} km/L</strong>
              </div>
              <input type="range" min="25" max="75" step="1" value={bikeMileage} onChange={e => setBikeMileage(Number(e.target.value))} className={styles.sliderInput} />
            </div>

            <div className={styles.sliderRow}>
              <div className={styles.sliderHeader}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Car size={14} color="#2563EB" /> Car (Petrol)
                </span>
                <strong>{carMileage} km/L</strong>
              </div>
              <input type="range" min="8" max="25" step="0.5" value={carMileage} onChange={e => setCarMileage(Number(e.target.value))} className={styles.sliderInput} />
            </div>

            <div className={styles.sliderRow}>
              <div className={styles.sliderHeader}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Fuel size={14} color="#0284C7" /> Car (Diesel)
                </span>
                <strong>{carDieselMileage} km/L</strong>
              </div>
              <input type="range" min="10" max="30" step="0.5" value={carDieselMileage} onChange={e => setCarDieselMileage(Number(e.target.value))} className={styles.sliderInput} />
            </div>

            <div className={styles.sliderRow}>
              <div className={styles.sliderHeader}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Car size={14} color="#7C3AED" /> SUV
                </span>
                <strong>{suvMileage} km/L</strong>
              </div>
              <input type="range" min="7" max="18" step="0.5" value={suvMileage} onChange={e => setSuvMileage(Number(e.target.value))} className={styles.sliderInput} />
            </div>

            <div className={styles.sliderRow} style={{ marginBottom: 0 }}>
              <div className={styles.sliderHeader}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Zap size={14} color="#059669" /> EV
                </span>
                <strong>{evMileage} km/kWh</strong>
              </div>
              <input type="range" min="4.0" max="10.0" step="0.1" value={evMileage} onChange={e => setEvMileage(Number(e.target.value))} className={styles.sliderInput} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function TripEstimatorPage() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
      <TripEstimatorContent />
    </Suspense>
  );
}
