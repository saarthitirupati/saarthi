'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Car, Bike, Zap, Bus, Footprints, Flame, Sparkles, 
  CheckCircle2, AlertTriangle, Mountain, MapPin, Fuel, 
  RefreshCw, Users, Shield, Sliders, ChevronRight, Info
} from 'lucide-react';
import styles from './TripEstimator.module.css';
import { PLACES, Place } from '@/data/places';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { TripEstimateResult, TransportEstimate, FuelRates, VEHICLE_PRESETS } from '@/services/decision/trip.estimator';
import { useLanguage } from '@/lib/useLanguage';

function TripEstimatorContent() {
  const searchParams = useSearchParams();
  const lang = useLanguage();
  const { places } = useRealtimePlaces(PLACES);
  const placesList = places.length > 0 ? places : PLACES;

  const initialDest = searchParams?.get('destId') || 'venkateswara';
  const initialOrigin = searchParams?.get('originId') || 'renigunta-junction';

  const [originId, setOriginId] = useState<string>(initialOrigin);
  const [destId, setDestId] = useState<string>(initialDest);
  const [passengers, setPassengers] = useState<number>(1);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'bike' | 'car' | 'ev' | 'bus'>('all');

  // Custom mileage overrides
  const [bikeMileage, setBikeMileage] = useState<number>(52);
  const [carMileage, setCarMileage] = useState<number>(16);

  // Live Fuel Rates
  const [fuelRates, setFuelRates] = useState<FuelRates>({
    petrol: 108.49,
    diesel: 100.28,
    cng: 88.50,
    evKwh: 8.50
  });
  const [fuelSource, setFuelSource] = useState<string>('IndianAPI (Live)');
  const [isCustomFuelOpen, setIsCustomFuelOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [estimateResult, setEstimateResult] = useState<TripEstimateResult | null>(null);

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

  // Fetch estimates
  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/trip-estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originId,
          destId,
          passengers,
          isRoundTrip,
          customMileage: { bike: bikeMileage, car: carMileage },
          fuelRates
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setEstimateResult(json.data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch trip estimates', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, [originId, destId, passengers, isRoundTrip, bikeMileage, carMileage, fuelRates]);

  const filteredEstimates = useMemo(() => {
    if (!estimateResult) return [];
    const entries = Object.entries(estimateResult.estimates);
    if (activeTab === 'all') return entries;
    if (activeTab === 'bike') return entries.filter(([k]) => k === 'bike');
    if (activeTab === 'car') return entries.filter(([k]) => k === 'car' || k === 'suv');
    if (activeTab === 'ev') return entries.filter(([k]) => k === 'ev');
    if (activeTab === 'bus') return entries.filter(([k]) => k === 'bus' || k === 'auto' || k === 'walk');
    return entries;
  }, [estimateResult, activeTab]);

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
        
        {/* LIVE FUEL TICKER BAR */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          borderRadius: '16px',
          padding: '12px 16px',
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Fuel size={12} /> {fuelSource}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
              Petrol: <strong style={{ color: '#059669' }}>₹{fuelRates.petrol}/L</strong>
            </span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
              Diesel: <strong style={{ color: '#059669' }}>₹{fuelRates.diesel}/L</strong>
            </span>
          </div>

          <button
            onClick={() => setIsCustomFuelOpen(!isCustomFuelOpen)}
            style={{
              background: 'none',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#475569',
              cursor: 'pointer'
            }}
          >
            {isCustomFuelOpen ? 'Hide' : 'Edit Rate'}
          </button>
        </div>

        {/* CUSTOM FUEL MODAL / DRAWER */}
        {isCustomFuelOpen && (
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px dashed #CBD5E1',
            borderRadius: '14px',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px'
          }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Petrol (₹/L)</label>
              <input
                type="number"
                step="0.1"
                value={fuelRates.petrol}
                onChange={e => setFuelRates(prev => ({ ...prev, petrol: parseFloat(e.target.value) || 108.49 }))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Diesel (₹/L)</label>
              <input
                type="number"
                step="0.1"
                value={fuelRates.diesel}
                onChange={e => setFuelRates(prev => ({ ...prev, diesel: parseFloat(e.target.value) || 100.28 }))}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
              />
            </div>
          </div>
        )}
        
        {/* ROUTE SELECTOR CARD */}
        <div className={styles.card}>
          <div className={styles.routeSelector}>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                {lang === 'te' ? 'ప్రారంభ స్థానం (Origin)' : 'Origin (Starting Point)'}
              </label>
              <select
                className={styles.select}
                value={originId}
                onChange={e => setOriginId(e.target.value)}
              >
                <option value="renigunta-junction">Tirupati Central / Railway Station</option>
                <option value="alipiri-checkpoint">Alipiri Toll Gate / Ghat Road Entry</option>
                <option value="srinivasam">Srinivasam Complex (RTC Bus Stand)</option>
                <option value="vishnu-nivasam">Vishnu Nivasam (Railway Station)</option>
                {placesList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

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

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label className={styles.label} style={{ margin: 0 }}>
                  <Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  {lang === 'te' ? 'భక్తులు:' : 'Pilgrims:'}
                </label>
                <select
                  value={passengers}
                  onChange={e => setPassengers(Number(e.target.value))}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} Pilgrim{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isRoundTrip}
                  onChange={e => setIsRoundTrip(e.target.checked)}
                />
                {lang === 'te' ? 'రౌండ్ ట్రిప్ (రాను-పోను)' : 'Round Trip (Both Ways)'}
              </label>
            </div>

          </div>
        </div>

        {/* DISTANCE & ROUTE HEADER */}
        {estimateResult && (
          <div style={{ background: 'linear-gradient(135deg, #1E1B18 0%, #2A2521 100%)', color: '#FFFFFF', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#C89B3C', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {estimateResult.isTirumalaRoute
                    ? <><Mountain size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} /> Tirumala Hill Ghat Route (+820m Climb)</>
                    : <><MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} /> Regional Plains Highway Route</>}
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '4px 0 0 0', color: '#FFFFFF' }}>
                  {estimateResult.originName} → {estimateResult.destinationName}
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#E9801D' }}>{estimateResult.distanceKm} km</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block' }}>{isRoundTrip ? 'Total Round-trip' : 'One-way Drive'}</span>
              </div>
            </div>
          </div>
        )}

        {/* VEHICLE CATEGORY FILTER TABS */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '8px' }}>
          {[
            { id: 'all', label: 'All Modes' },
            { id: 'bike', label: '🏍️ Bike / Scooter' },
            { id: 'car', label: '🚗 Car & SUV' },
            { id: 'ev', label: '⚡ Electric EV' },
            { id: 'bus', label: '🚌 Bus & Auto' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                backgroundColor: activeTab === tab.id ? '#0F5132' : '#FFFFFF',
                color: activeTab === tab.id ? '#FFFFFF' : '#0F172A',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(15, 23, 42, 0.1)',
                padding: '8px 14px',
                borderRadius: '12px',
                fontSize: '12.5px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(15, 81, 50, 0.25)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MODE COMPARISON CARDS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            Calculating vehicle physics & live fuel rates...
          </div>
        ) : estimateResult ? (
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
                      {key === 'walk' && <Footprints size={22} color="#16A34A" />}
                      {key === 'bike' && <Bike size={22} color="#E9801D" />}
                      {key === 'car' && <Car size={22} color="#2563EB" />}
                      {key === 'suv' && <Car size={22} color="#7C3AED" />}
                      {key === 'ev' && <Zap size={22} color="#059669" />}
                      {key === 'auto' && <Zap size={22} color="#D97706" />}
                      {key === 'bus' && <Bus size={22} color="#059669" />}

                      <div>
                        <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{est.title}</h3>
                        <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                          ~{est.travelTimeMins} mins • {est.distanceKm} km {est.fuelType ? `• ${est.fuelType}` : ''}
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
                      <span style={{ fontSize: '9.5px', color: '#64748B', display: 'block' }}>Estimated Total</span>
                    </div>
                  </div>

                  <div style={{ margin: '8px 0' }}>
                    <span className={`${styles.tagBadge} ${isBest ? styles.tagBest : isWarn ? styles.tagWarning : styles.tagRec}`}>
                      {est.recommendationTag}
                    </span>
                  </div>

                  <ul className={styles.reasonList}>
                    {est.reasons.map((r, i) => (
                      <li key={i} className={styles.reasonItem}>
                        <CheckCircle2 size={13} color={isBest ? '#16A34A' : '#64748B'} />
                        {r}
                      </li>
                    ))}
                  </ul>

                  {/* COST BREAKDOWN PILL */}
                  {(est.fuelCost > 0 || est.parkingCost > 0 || est.tollCost > 0) && (
                    <div style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.03)',
                      borderRadius: '10px',
                      display: 'flex',
                      gap: '12px',
                      fontSize: '11.5px',
                      color: '#475569',
                      flexWrap: 'wrap'
                    }}>
                      {est.fuelCost > 0 && <span>⛽ Fuel: <strong>₹{est.fuelCost}</strong></span>}
                      {est.tollCost > 0 && <span>🛣️ Tolls: <strong>₹{est.tollCost}</strong></span>}
                      {est.parkingCost > 0 && <span>🅿️ Parking: <strong>₹{est.parkingCost}</strong></span>}
                    </div>
                  )}

                  {est.busDetails && (
                    <div style={{ marginTop: '10px', background: '#DCFCE7', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', color: '#15803D', fontWeight: 600 }}>
                      <Bus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />{est.busDetails.busNumber} • {est.busDetails.frequency}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}

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
