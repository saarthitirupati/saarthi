'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Save, CheckCircle } from 'lucide-react';
import styles from '../admin.module.css';

export default function AdminFuelManager() {
  const [petrol, setPetrol] = useState<string>('118.00');
  const [diesel, setDiesel] = useState<string>('105.00');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedMessage, setSavedMessage] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/api/admin/fuel')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load rates');
        return r.json();
      })
      .then(data => {
        if (data.petrol) setPetrol(data.petrol.toString());
        if (data.diesel) setDiesel(data.diesel.toString());
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedMessage(false);

    const petrolNum = parseFloat(petrol);
    const dieselNum = parseFloat(diesel);

    if (isNaN(petrolNum) || petrolNum <= 0 || isNaN(dieselNum) || dieselNum <= 0) {
      setError('Please enter valid positive decimal numbers for fuel rates.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petrol: petrolNum, diesel: dieselNum })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update rates');
      }

      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading fuel rates config...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      style={{ maxWidth: 600 }}
    >
      <div className={styles.topRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Coins size={28} color="#D97706" /> Fuel Rates Manager
          </h1>
          <p className={styles.pageSubtitle}>Update real-time fuel tariffs used in trip cost estimations</p>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24, marginTop: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className={styles.field}>
            <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
              Petrol Price (per Litre)
            </label>
            <input 
              type="number"
              step="0.01"
              className={styles.input} 
              value={petrol} 
              onChange={e => setPetrol(e.target.value)} 
              placeholder="e.g. 118.25"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none'
              }}
            />
            <span style={{ fontSize: 11, color: '#64748B', display: 'block', marginTop: 4 }}>
              Current market retail: ₹117.75 to ₹118.50 per litre.
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
              Diesel Price (per Litre)
            </label>
            <input 
              type="number"
              step="0.01"
              className={styles.input} 
              value={diesel} 
              onChange={e => setDiesel(e.target.value)} 
              placeholder="e.g. 105.20"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none'
              }}
            />
            <span style={{ fontSize: 11, color: '#64748B', display: 'block', marginTop: 4 }}>
              Current market retail: ₹104.50 to ₹105.70 per litre.
            </span>
          </div>

          {error && (
            <div style={{ color: '#EF4444', background: '#FEF2F2', padding: 12, borderRadius: 8, fontSize: 12, border: '1px solid #FEE2E2', fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          {savedMessage && (
            <div style={{ color: '#10B981', background: '#ECFDF5', padding: 12, borderRadius: 8, fontSize: 12, border: '1px solid #D1FAE5', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
              <CheckCircle size={16} /> Fuel rates updated successfully! Dynamic travel calculators are now live with these prices.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button 
              type="submit" 
              className={styles.btnPrimary} 
              disabled={saving}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '10px 20px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 13
              }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </form>
      </div>
    </motion.div>
  );
}
