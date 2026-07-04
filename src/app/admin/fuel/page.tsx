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

      <div className={styles.formCard} style={{ marginTop: 24 }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div className={styles.field}>
            <label className={styles.label}>
              Petrol Price (per Litre)
            </label>
            <input 
              type="number"
              step="0.01"
              className={styles.input} 
              value={petrol} 
              onChange={e => setPetrol(e.target.value)} 
              placeholder="e.g. 118.25"
            />
            <span style={{ fontSize: 11, color: '#64748B', display: 'block', marginTop: 4 }}>
              Current market retail: ₹117.75 to ₹118.50 per litre.
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Diesel Price (per Litre)
            </label>
            <input 
              type="number"
              step="0.01"
              className={styles.input} 
              value={diesel} 
              onChange={e => setDiesel(e.target.value)} 
              placeholder="e.g. 105.20"
            />
            <span style={{ fontSize: 11, color: '#64748B', display: 'block', marginTop: 4 }}>
              Current market retail: ₹104.50 to ₹105.70 per litre.
            </span>
          </div>

          {error && (
            <div style={{ color: '#F87171', background: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: 8, fontSize: 12, border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          {savedMessage && (
            <div style={{ color: '#34D399', background: 'rgba(16, 185, 129, 0.1)', padding: 12, borderRadius: 8, fontSize: 12, border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
              <CheckCircle size={16} /> Fuel rates updated successfully! Dynamic travel calculators are now live with these prices.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button 
              type="submit" 
              className={styles.btnPrimary} 
              disabled={saving}
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
