'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Plus, Search, CheckCircle, Clock, Trash2, Edit3, X, Save, RefreshCw } from 'lucide-react';
import styles from '../Dashboard.module.css';
import { notifyRealtimeUpdate } from '@/lib/useRealtimeStatus';
import { safeFetchJson } from '@/lib/safeFetch';
import { useLiveRefresh } from '@/hooks/useLiveRefresh';

export default function AdminFestivalsPage() {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Realtime updates
  const { isConnected } = useLiveRefresh('festivals');

  // Form states
  const [name, setName] = useState('');
  const [festivalType, setFestivalType] = useState('Spiritual');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [crowdLevel, setCrowdLevel] = useState('High');
  const [description, setDescription] = useState('');
  const [dressCode, setDressCode] = useState('Traditional');
  const [parkingStatus, setParkingStatus] = useState('Available');

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const data = await safeFetchJson<any>('/api/admin/festivals');
      if (data && data.festivals) {
        setFestivals(data.festivals);
      }
    } catch (e) {
      console.error('Failed to load festivals:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, [isConnected]); // Refetch if connection establishes/drops as a safety measure

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/festivals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          festival_type: festivalType,
          date,
          crowd_level: crowdLevel,
          description,
          dress_code: dressCode,
          parking_status: parkingStatus,
          status: 'Upcoming'
        })
      });

      if (res.ok) {
        notifyRealtimeUpdate();
        setShowModal(false);
        setName('');
        setDescription('');
        fetchFestivals();
      }
    } catch (e) {
      console.error('Failed to create festival:', e);
    } finally {
      setSaving(false);
    }
  };

  const filteredFestivals = useMemo(() => {
    return festivals.filter(f => {
      const query = searchQuery.toLowerCase().trim();
      return !query || f.name.toLowerCase().includes(query) || (f.festival_type && f.festival_type.toLowerCase().includes(query));
    });
  }, [festivals, searchQuery]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className={styles.title}>Festivals Center CMS</h1>
          <p className={styles.subtitle}>Managing {festivals.length} Major TTD & Regional Festivals</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={fetchFestivals}
            style={{
              backgroundColor: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', borderRadius: '8px',
              padding: '8px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <RefreshCw size={14} className={loading ? styles.spin : ''} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>

          <button 
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#0E6B72', color: '#FFF', border: 'none', borderRadius: '8px',
              padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Plus size={16} /> New Festival
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.dataQualitySection} style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <Search size={16} color="#64748B" />
          <input 
            type="text" 
            placeholder="Search festivals by name or event type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px', color: '#0F172A' }}
          />
        </div>
      </div>

      {/* Festivals List Table */}
      <div className={styles.dataQualitySection}>
        <h3 className={styles.sectionTitle}>
          <Calendar size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Upcoming & Scheduled Events
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredFestivals.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
              No festivals found. Click "New Festival" to add one.
            </div>
          ) : (
            filteredFestivals.map((fest) => (
              <div key={fest.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{fest.name}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                      background: fest.crowd_level === 'Extreme' ? '#FEF2F2' : '#EFF6FF',
                      color: fest.crowd_level === 'Extreme' ? '#DC2626' : '#2563EB'
                    }}>
                      {fest.crowd_level || 'Moderate'} Crowd
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#475569', margin: '4px 0 0 0', lineHeight: 1.4, maxWidth: '600px' }}>
                    {fest.description}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                    <span>📅 Date: <strong>{fest.date}</strong></span>
                    <span>👗 Dress: <strong>{fest.dress_code || 'Traditional'}</strong></span>
                    <span>🚗 Parking: <strong>{fest.parking_status || 'Available'}</strong></span>
                  </div>
                </div>

                <span style={{
                  fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                  background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0'
                }}>
                  {fest.status || 'Upcoming'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Creating Festival */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Add New TTD Festival</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Festival Name</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Srivari Brahmotsavam"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Event Date</label>
                  <input 
                    type="date" required value={date} onChange={e => setDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Expected Crowd</label>
                  <select 
                    value={crowdLevel} onChange={e => setCrowdLevel(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                  >
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Description & Highlights</label>
                <textarea 
                  rows={3} value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Details about Vahana Sevas, timings, or darshan impact..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={saving}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0E6B72', color: '#FFF', fontWeight: 700 }}
                >
                  {saving ? 'Saving...' : 'Save Festival'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
