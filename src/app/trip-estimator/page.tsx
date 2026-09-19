'use client';

import { useState, useEffect, useMemo, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Car, Bike, Zap, Bus, Footprints, 
  CheckCircle2, AlertTriangle, Mountain, MapPin, Fuel, 
  RefreshCw, Users, Shield, Sliders, ChevronRight, Info,
  Navigation, Locate, Compass, Clock, IndianRupee, Sparkles,
  ShieldCheck, CircleParking, Milestone, ShieldAlert, ExternalLink,
  SlidersHorizontal, ChevronDown, ChevronUp, Leaf, Minus, Plus,
  Gauge, AlertCircle
} from 'lucide-react';
import styles from './TripEstimator.module.css';
import { PLACES, Place } from '@/data/places';
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

  // Custom mileage overrides (First Principles)
  const [bikeMileage, setBikeMileage] = useState<number>(52);
  const [carMileage, setCarMileage] = useState<number>(16);
  const [carDieselMileage, setCarDieselMileage] = useState<number>(20);
  const [suvMileage, setSuvMileage] = useState<number>(12);
  const [evMileage, setEvMileage] = useState<number>(7.14);

  // Settings & Fuel Modals
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFuelPumps, setShowFuelPumps] = useState<boolean>(false);

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

    // Run direct calculation (instant 0ms)
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

  // Destination coordinates for Google Maps navigation
  const destinationCoords = useMemo(() => {
    const found = placesList.find(p => p.id === destId);
    return found?.coordinates || { lat: 13.6832, lng: 79.3473 };
  }, [destId, placesList]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={18} /> {lang === 'te' ? 'వెనుకకు' : 'Back'}
        </Link>
        <h1 className={styles.title}>
          {lang === 'te' ? 'సారథి ప్రయాణ & ఇంధన అంచనా' : 'Saarthi Trip & Fuel Estimator'}
        </h1>
        <div style={{ width: '24px' }} />
      </header>

      <main className={styles.content}>
        
        {/* 1. ROUTE & TRIP CONFIGURATION CARD */}
        <div className={styles.card}>
          <div className={styles.routeSelector}>
            
            {/* ORIGIN SELECTOR + LIVE GPS BUTTON */}
            <div className={styles.fieldGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className={styles.label} style={{ margin: 0 }}>
                  {lang === 'te' ? 'ప్రారంభ స్థానం (Origin)' : 'Starting Point'}
                </label>
                
                <button
                  type="button"
                  onClick={useLiveGps ? () => setUseLiveGps(false) : handleGetLiveLocation}
                  disabled={gpsLoading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    border: useLiveGps ? '1px solid #10B981' : '1px solid #CBD5E1',
                    backgroundColor: useLiveGps ? '#ECFDF5' : '#F8FAFC',
                    color: useLiveGps ? '#059669' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Locate size={13} className={gpsLoading ? 'animate-spin' : ''} color={useLiveGps ? '#10B981' : '#64748B'} />
                  <span>{gpsLoading ? 'Locating...' : useLiveGps ? 'Live GPS Active' : 'Use My GPS'}</span>
                </button>
              </div>

              {useLiveGps ? (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#065F46' }}>
                      Your Live Location (GPS Detected)
                    </span>
                  </div>
                  <button
                    onClick={() => setUseLiveGps(false)}
                    style={{ background: 'none', border: 'none', color: '#047857', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <select
                  className={styles.select}
                  value={originId}
                  onChange={e => {
                    setOriginId(e.target.value);
                    setUseLiveGps(false);
                  }}
                >
                  <optgroup label="Popular Starting Hubs & Stations">
                    {Object.entries(MAJOR_HUBS).map(([id, hub]) => (
                      <option key={id} value={id}>{hub.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="All Temples & Pilgrimage Sites">
                    {placesList.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </optgroup>
                </select>
              )}

              {gpsError && (
                <div style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={11} />
                  <span>{gpsError}</span>
                </div>
              )}
            </div>

            {/* DESTINATION SELECTOR */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                {lang === 'te' ? 'గమ్యస్థానం (Destination)' : 'Destination Temple / Spot'}
              </label>
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

            {/* TRIP CONFIGURATION ROW: ONE-WAY/ROUND-TRIP & PASSENGER COUNTER */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              paddingTop: '6px',
              borderTop: '1px solid #F1F5F9'
            }}>
              
              {/* Trip Type Toggle */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Trip Direction</label>
                <div className={styles.toggleGroup}>
                  <button
                    type="button"
                    onClick={() => setIsRoundTrip(false)}
                    className={`${styles.toggleBtn} ${!isRoundTrip ? styles.toggleBtnActive : ''}`}
                  >
                    One-Way
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRoundTrip(true)}
                    className={`${styles.toggleBtn} ${isRoundTrip ? styles.toggleBtnActive : ''}`}
                  >
                    Round-Trip
                  </button>
                </div>
              </div>

              {/* Passenger Counter */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Pilgrims / Passengers</label>
                <div className={styles.passengerCounter}>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    disabled={passengers <= 1}
                    className={styles.counterBtn}
                    aria-label="Decrease passengers"
                  >
                    <Minus size={14} />
                  </button>
                  <div className={styles.counterValue}>
                    {passengers} {passengers === 1 ? 'Person' : 'People'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.min(10, passengers + 1))}
                    disabled={passengers >= 10}
                    className={styles.counterBtn}
                    aria-label="Increase passengers"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 2. LIVE REGIONAL FUEL RATES & CUSTOM MILEAGE TOOLBAR */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '12px 16px',
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fuel size={15} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Live AP Fuel Prices ({fuelSource})
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '1px' }}>
                  <span>Petrol: <strong style={{ color: '#059669' }}>₹{fuelRates.petrol}</strong>/L</span>
                  <span>Diesel: <strong style={{ color: '#0284C7' }}>₹{fuelRates.diesel}</strong>/L</span>
                  <span>CNG: <strong>₹{fuelRates.cng}</strong>/kg</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: showSettings ? '#F1F5F9' : '#FFFFFF',
                color: '#334155',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <SlidersHorizontal size={12} />
              <span>{showSettings ? 'Close Mileage' : 'Custom Mileage'}</span>
              {showSettings ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>

          {/* COLLAPSIBLE VEHICLE MILEAGE SLIDERS */}
          {showSettings && (
            <div className={styles.settingsSection}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                Customize Your Vehicle Mileage (First Principles Calculation)
              </div>
              
              <div className={styles.sliderRow}>
                <div className={styles.sliderHeader}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Bike size={14} color="#E9801D" /> Two-Wheeler / Bike
                  </span>
                  <strong>{bikeMileage} km/L</strong>
                </div>
                <input
                  type="range"
                  min="25"
                  max="75"
                  step="1"
                  value={bikeMileage}
                  onChange={e => setBikeMileage(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderHeader}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Car size={14} color="#2563EB" /> Petrol Car (Hatchback / Sedan)
                  </span>
                  <strong>{carMileage} km/L</strong>
                </div>
                <input
                  type="range"
                  min="8"
                  max="25"
                  step="0.5"
                  value={carMileage}
                  onChange={e => setCarMileage(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderHeader}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Fuel size={14} color="#0284C7" /> Diesel Car (Hatchback / Sedan)
                  </span>
                  <strong>{carDieselMileage} km/L</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  step="0.5"
                  value={carDieselMileage}
                  onChange={e => setCarDieselMileage(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderRow}>
                <div className={styles.sliderHeader}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Car size={14} color="#7C3AED" /> SUV / 7-Seater (Diesel)
                  </span>
                  <strong>{suvMileage} km/L</strong>
                </div>
                <input
                  type="range"
                  min="7"
                  max="18"
                  step="0.5"
                  value={suvMileage}
                  onChange={e => setSuvMileage(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderRow} style={{ marginBottom: 0 }}>
                <div className={styles.sliderHeader}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Zap size={14} color="#059669" /> Electric Car (EV)
                  </span>
                  <strong>{evMileage} km/kWh</strong>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="10.0"
                  step="0.1"
                  value={evMileage}
                  onChange={e => setEvMileage(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. DISTANCE & ROUTE HEADER WITH ELEVATION PHYSICS */}
        {estimateResult && (
          <div style={{ background: 'linear-gradient(135deg, #1E1B18 0%, #2A2521 100%)', color: '#FFFFFF', borderRadius: '20px', padding: '20px', marginBottom: '18px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#C89B3C', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {estimateResult.isTirumalaRoute ? (
                    <>
                      <Mountain size={13} color="#C89B3C" />
                      Tirumala Hill Ghat Route (+820m Elevation Incline)
                    </>
                  ) : (
                    <>
                      <Navigation size={13} color="#C89B3C" />
                      Regional Plains Highway Route
                    </>
                  )}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0 0 0', color: '#FFFFFF' }}>
                  {estimateResult.originName} → {estimateResult.destinationName}
                </h2>
                {estimateResult.isTirumalaRoute && (
                  <p style={{ fontSize: '11.5px', color: '#FCD34D', margin: '4px 0 0 0', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={12} color="#FCD34D" />
                    <span>Physics Factor Applied: +20% to +25% fuel burn calculated for steep uphill mountain grade.</span>
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#E9801D', letterSpacing: '-0.5px' }}>{estimateResult.distanceKm} km</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block' }}>{isRoundTrip ? 'Total Round-trip' : 'One-way Route'}</span>
              </div>
            </div>

            {/* Google Maps External Action & Nearest Fuel Bunk Trigger */}
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={() => setShowFuelPumps(!showFuelPumps)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(234, 179, 8, 0.2)',
                  color: '#FEF08A',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  cursor: 'pointer'
                }}
              >
                <Fuel size={13} />
                <span>{showFuelPumps ? 'Hide Fuel Stations' : 'View Pumps On Route (Alipiri & Hill)'}</span>
              </button>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${destinationCoords.lat},${destinationCoords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <Navigation size={13} color="#38BDF8" />
                <span>Open in Google Maps</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}

        {/* 4. PILGRIM REFUELING & GHAT ROAD SAFETY ADVISORY */}
        {showFuelPumps && (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '18px',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertCircle size={18} color="#D97706" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#92400E', margin: 0 }}>
                Tirumala Hill Refueling & Ghat Road Guidance
              </h3>
            </div>
            
            <p style={{ fontSize: '12.5px', color: '#78350F', lineHeight: 1.5, margin: '0 0 12px 0' }}>
              <strong>Important:</strong> There is only <strong>ONE</strong> fuel pump on Tirumala hill (near GNC Toll, open 6 AM–8 PM only). Maintain at least <strong>5 Liters</strong> before crossing Alipiri Toll Gate to prevent steep-grade stalling.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PILGRIM_FUEL_BUNKS.map(bunk => (
                <div key={bunk.id} style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '12px',
                  border: '1px solid #FDE68A',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                      {bunk.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                      {bunk.location} • <strong style={{ color: bunk.isHillStation ? '#DC2626' : '#16A34A' }}>{bunk.timings}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#92400E', marginTop: '3px' }}>
                      {bunk.notes}
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${bunk.lat},${bunk.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      border: '1px solid #FDE68A',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Route</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. VEHICLE CATEGORY FILTER TABS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '8px' }}>
          {[
            { id: 'all', label: 'All Modes', Icon: Compass },
            { id: 'bike', label: 'Motorcycle', Icon: Bike },
            { id: 'car', label: 'Car & SUV', Icon: Car },
            { id: 'ev', label: 'Electric EV', Icon: Zap },
            { id: 'bus', label: 'Bus & Auto', Icon: Bus },
            { id: 'walk', label: 'Walking', Icon: Footprints }
          ].map(tab => {
            const TabIcon = tab.Icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  backgroundColor: isSelected ? '#0F5132' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#0F172A',
                  border: isSelected ? 'none' : '1px solid rgba(15, 23, 42, 0.1)',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? '0 4px 12px rgba(15, 81, 50, 0.25)' : 'none'
                }}
              >
                <TabIcon size={14} color={isSelected ? '#FFFFFF' : '#64748B'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 6. MODE COMPARISON CARDS */}
        {estimateResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredEstimates.map(([key, est]) => {
              const isBest = est.recommendationStatus === 'best';
              const isWarn = est.recommendationStatus === 'not_recommended';

              return (
                <div 
                  key={key} 
                  className={styles.estimateCard}
                  style={{
                    border: isBest ? '2px solid #16A34A' : isWarn ? '1.5px solid #FCA5A5' : '1px solid #E7E3DD',
                    background: isBest ? '#F0FDF4' : '#FFFFFF',
                    borderRadius: '18px',
                    padding: '16px 18px'
                  }}
                >
                  <div className={styles.estimateHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        padding: '10px',
                        borderRadius: '12px',
                        backgroundColor: key === 'walk' ? 'rgba(22, 163, 74, 0.1)' :
                                         key === 'bike' ? 'rgba(233, 128, 29, 0.1)' :
                                         key === 'ev' ? 'rgba(5, 150, 105, 0.1)' :
                                         key === 'bus' ? 'rgba(16, 185, 129, 0.1)' :
                                         key === 'auto' ? 'rgba(217, 119, 6, 0.1)' :
                                         'rgba(37, 99, 235, 0.1)'
                      }}>
                        {key === 'walk' && <Footprints size={22} color="#16A34A" />}
                        {key === 'bike' && <Bike size={22} color="#E9801D" />}
                        {key === 'car' && <Car size={22} color="#2563EB" />}
                        {key === 'car_diesel' && <Car size={22} color="#0284C7" />}
                        {key === 'suv' && <Car size={22} color="#7C3AED" />}
                        {key === 'ev' && <Zap size={22} color="#059669" />}
                        {key === 'auto' && <Zap size={22} color="#D97706" />}
                        {key === 'bus' && <Bus size={22} color="#059669" />}
                      </div>

                      <div>
                        <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{est.title}</h3>
                        <span style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Clock size={11} /> ~{est.travelTimeMins} mins • {est.distanceKm} km {est.vehicleType ? `• ${est.vehicleType}` : ''}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {key === 'walk' ? (
                        <span className={styles.costDisplay} style={{ color: '#16A34A' }}>Free</span>
                      ) : key === 'auto' ? (
                        <span className={styles.costDisplay}>₹{est.fareMin}–₹{est.fareMax}</span>
                      ) : (
                        <div>
                          <span className={styles.costDisplay}>₹{est.totalCostMin}</span>
                          {passengers > 1 && est.costPerPerson > 0 && (
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, display: 'block' }}>
                              (₹{est.costPerPerson} / person)
                            </span>
                          )}
                        </div>
                      )}
                      <span style={{ fontSize: '9.5px', color: '#64748B', display: 'block' }}>
                        {isRoundTrip ? 'Estimated Round-Trip' : 'Estimated Total'}
                      </span>
                    </div>
                  </div>

                  <div style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span 
                      className={`${styles.tagBadge} ${isBest ? styles.tagBest : isWarn ? styles.tagWarning : styles.tagRec}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      {isBest && <ShieldCheck size={13} color="#15803D" />}
                      {isWarn && <ShieldAlert size={13} color="#B91C1C" />}
                      {!isBest && !isWarn && <Sparkles size={13} color="#B45309" />}
                      <span>{est.recommendationTag}</span>
                    </span>

                    {est.co2Kg !== undefined && est.co2Kg > 0 && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#059669',
                        backgroundColor: '#ECFDF5',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Leaf size={11} />
                        <span>~{est.co2Kg} kg CO₂</span>
                      </span>
                    )}
                  </div>

                  {/* COST & FUEL BREAKDOWN PILL */}
                  {(est.fuelCost > 0 || est.parkingCost > 0 || est.tollCost > 0) && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.03)',
                      borderRadius: '10px',
                      display: 'flex',
                      gap: '14px',
                      fontSize: '11.5px',
                      color: '#475569',
                      flexWrap: 'wrap'
                    }}>
                      {est.fuelCost > 0 && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Fuel size={12} color="#059669" />
                          Fuel: <strong>{est.fuelUsedLiters} {est.fuelUsedUnit}</strong> (₹{est.fuelCost})
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

                  <ul className={styles.reasonList}>
                    {est.reasons.map((r, i) => (
                      <li key={i} className={styles.reasonItem}>
                        <CheckCircle2 size={13} color={isBest ? '#16A34A' : '#64748B'} />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>

                  {est.busDetails && (
                    <div style={{ marginTop: '10px', background: '#DCFCE7', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bus size={14} />
                      <span>{est.busDetails.busNumber} • {est.busDetails.frequency}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}

export default function TripEstimatorPage() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading Saarthi Trip Estimator...</div>}>
      <TripEstimatorContent />
    </Suspense>
  );
}
