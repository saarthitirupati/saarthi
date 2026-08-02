'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Save, CheckCircle, Flame, Car, Bike, Bus, Zap, Sparkles } from 'lucide-react';
import styles from '../Dashboard.module.css';

export default function AdminFuelManager() {
  const [petrol, setPetrol] = useState<string>('108.50');
  const [diesel, setDiesel] = useState<string>('96.20');
  const [cng, setCng] = useState<string>('89.00');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMessage, setSavedMessage] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/fuel');
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (data.petrol) setPetrol(data.petrol.toString());
        if (data.diesel) setDiesel(data.diesel.toString());
        if (data.cng) setCng(data.cng.toString());
      }
    } catch (err) {
      console.error('Failed to load fuel rates', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedMessage(false);

    const petrolNum = parseFloat(petrol);
    const dieselNum = parseFloat(diesel);
    const cngNum = parseFloat(cng);

    if (isNaN(petrolNum) || petrolNum <= 0 || isNaN(dieselNum) || dieselNum <= 0 || isNaN(cngNum) || cngNum <= 0) {
      setError('Please enter valid positive decimal numbers for fuel rates.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petrol: petrolNum, diesel: dieselNum, cng: cngNum })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update rates');
      }

      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // Preview calculations for sample 10km trip
  const pVal = parseFloat(petrol) || 108.5;
  const dVal = parseFloat(diesel) || 96.2;
  const cVal = parseFloat(cng) || 89.0;

  const sampleBikeCost = Math.round((10 / 45) * pVal);
  const sampleCarCost = Math.round((10 / 15) * pVal);
  const sampleAutoCost = Math.round(30 + (8 * 15)); // 10km auto

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Coins size={28} color="#E9801D" /> Fuel Prices & Tariff Control
          </h1>
          <p className={styles.subtitle}>
            Update real-time fuel tariffs across Tirupati. Every update recalculates Saarthi Trip Estimator live.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '20px' }}>
        
        {/* EDIT FORM */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={18} color="#EA580C" /> Live Market Tariff Rates (₹/Litre or ₹/kg)
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Petrol Price (₹ / Litre)
              </label>
              <input
                type="number"
                step="0.01"
                value={petrol}
                onChange={e => setPetrol(e.target.value)}
                placeholder="108.50"
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '4px' }}>
                Tirupati Regional Average: ~₹108.20 – ₹108.80 / L
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Diesel Price (₹ / Litre)
              </label>
              <input
                type="number"
                step="0.01"
                value={diesel}
                onChange={e => setDiesel(e.target.value)}
                placeholder="96.20"
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '4px' }}>
                Used for APSRTC Buses & Heavy Commercial Vans
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                CNG Price (₹ / kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={cng}
                onChange={e => setCng(e.target.value)}
                placeholder="89.00"
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '4px' }}>
                Used for Auto Rickshaw fare baseline
              </span>
            </div>

            {error && (
              <div style={{ color: '#DC2626', background: '#FEE2E2', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            {savedMessage && (
              <div style={{ color: '#15803D', background: '#DCFCE7', padding: '12px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                <CheckCircle size={16} /> Fuel rates updated! Live trip estimators are now using these tariffs.
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                marginTop: '8px',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: '#E9801D',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(233, 128, 29, 0.25)'
              }}
            >
              <Save size={16} />
              {saving ? 'Updating Rates...' : 'Update Fuel Prices Live'}
            </button>
          </form>
        </div>

        {/* LIVE IMPACT PREVIEW */}
        <div style={{ background: '#FAF8F5', padding: '24px', borderRadius: '16px', border: '1px solid #E7E3DD' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#E9801D" /> Live Impact Preview (10 km Sample Trip)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bike size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0F172A' }}>Motorcycle / Bike</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>45 km/L • Petrol @ ₹{pVal}/L</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A' }}>₹{sampleBikeCost}</span>
                <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Estimated Fuel</span>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0F172A' }}>Personal Car</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>15 km/L • Petrol @ ₹{pVal}/L</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>₹{sampleCarCost}</span>
                <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Estimated Fuel</span>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0F172A' }}>Auto Rickshaw</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Base ₹30 + ₹15/km</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#15803D' }}>₹{sampleAutoCost - 10}–₹{sampleAutoCost + 20}</span>
                <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Metered Fare Range</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
