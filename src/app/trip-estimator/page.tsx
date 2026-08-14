'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, Bike, Zap, Bus, Footprints, Flame, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Mountain, MapPin, Fuel } from 'lucide-react';
import styles from './TripEstimator.module.css';
import { PLACES, Place } from '@/data/places';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { TripEstimateResult, TransportEstimate } from '@/services/decision/trip.estimator';

export default function TripEstimatorPage() {
  const { places } = useRealtimePlaces(PLACES);
  const placesList = places.length > 0 ? places : PLACES;

  const [originId, setOriginId] = useState<string>('renigunta-junction');
  const [destId, setDestId] = useState<string>('venkateswara');
  const [passengers, setPassengers] = useState<number>(1);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<string>('all');

  const [loading, setLoading] = useState<boolean>(true);
  const [estimateResult, setEstimateResult] = useState<TripEstimateResult | null>(null);

  const fetchEstimates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/trip-estimator?originId=${originId}&destId=${destId}&passengers=${passengers}&roundTrip=${isRoundTrip}`);
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
  }, [originId, destId, passengers, isRoundTrip]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={20} /> Back
        </Link>
        <h1 className={styles.title}>Saarthi Trip Estimator</h1>
        <div style={{ width: '24px' }} />
      </header>

      <main className={styles.content}>
        
        {/* ROUTE SELECTOR CARD */}
        <div className={styles.card}>
          <div className={styles.routeSelector}>
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Origin (Starting Point)</label>
              <select
                className={styles.select}
                value={originId}
                onChange={e => setOriginId(e.target.value)}
              >
                <option value="renigunta-junction">Tirupati Railway Station / Central</option>
                <option value="alipiri-checkpoint">Alipiri Toll Gate / Footpath Start</option>
                <option value="srinivasam">Srinivasam Complex (Near Railway Stn)</option>
                <option value="vishnu-nivasam">Vishnu Nivasam (Near Railway Stn)</option>
                {placesList.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Destination</label>
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
                <label className={styles.label} style={{ margin: 0 }}>Passengers:</label>
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
                Round Trip (Both Ways)
              </label>
            </div>

          </div>
        </div>

        {/* DISTANCE & SUMMARY CARD */}
        {estimateResult && (
          <div style={{ background: 'linear-gradient(135deg, #1E1B18 0%, #2A2521 100%)', color: '#FFFFFF', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#C89B3C', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {estimateResult.isTirumalaRoute
                    ? <><Mountain size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} /> Tirumala Hill Route</>
                    : <><MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} /> Tirupati Town Route</>}
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

            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.8)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Fuel size={12} /> Petrol: ₹{estimateResult.fuelRates.petrol}/L</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Fuel size={12} /> Diesel: ₹{estimateResult.fuelRates.diesel}/L</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Zap size={12} /> CNG: ₹{estimateResult.fuelRates.cng}/kg</span>
            </div>
          </div>
        )}

        {/* MODE COMPARISON CARDS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>Calculating real-time transport costs...</div>
        ) : estimateResult ? (
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#E9801D" /> Decision Intelligence (5 Transport Modes)
            </h2>

            {Object.entries(estimateResult.estimates).map(([key, est]) => {
              const isBest = est.recommendationStatus === 'best';
              const isWarn = est.recommendationStatus === 'not_recommended';

              return (
                <div 
                  key={key} 
                  className={styles.estimateCard}
                  style={{
                    border: isBest ? '2px solid #16A34A' : isWarn ? '1.5px solid #FCA5A5' : '1px solid #E7E3DD',
                    background: isBest ? '#F0FDF4' : '#FFFFFF'
                  }}
                >
                  <div className={styles.estimateHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {key === 'walk' && <Footprints size={22} color="#16A34A" />}
                      {key === 'bike' && <Bike size={22} color="#E9801D" />}
                      {key === 'car' && <Car size={22} color="#2563EB" />}
                      {key === 'auto' && <Zap size={22} color="#D97706" />}
                      {key === 'bus' && <Bus size={22} color="#059669" />}

                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{est.title}</h3>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>~{est.travelTimeMins} mins • {est.distanceKm} km</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {key === 'walk' ? (
                        <span className={styles.costDisplay} style={{ color: '#16A34A' }}>Free</span>
                      ) : key === 'auto' ? (
                        <span className={styles.costDisplay}>₹{est.fareMin}–₹{est.fareMax}</span>
                      ) : (
                        <span className={styles.costDisplay}>₹{est.totalCostMin}</span>
                      )}
                      <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Estimated Total</span>
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

                  {est.busDetails && (
                    <div style={{ marginTop: '12px', background: '#DCFCE7', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', color: '#15803D', fontWeight: 600 }}>
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
