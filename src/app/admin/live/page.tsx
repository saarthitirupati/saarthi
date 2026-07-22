'use client';

import { useState, useEffect } from 'react';
import styles from './LiveUpdates.module.css';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';
import { notifyRealtimeUpdate } from '@/lib/useRealtimeStatus';

import { safeFetchJson } from '@/lib/safeFetch';

export default function AdminLiveUpdates() {
  const [ssdStatus, setSsdStatus] = useState({ ssdTokenStatus: 'issuing', ssdNextTokenTime: '', ssdNotice: '' });

  useEffect(() => {
    safeFetchJson<any>('/api/admin/status').then(data => {
      if (data) {
        setSsdStatus({
          ssdTokenStatus: data.ssdTokenStatus || 'issuing',
          ssdNextTokenTime: data.ssdNextTokenTime || '',
          ssdNotice: data.ssdNotice || ''
        });
      }
    });
  }, []);

  const handleBroadcast = async () => {
    await fetch('/api/admin/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ssdStatus)
    });
    notifyRealtimeUpdate();
    alert('SSD Status Broadcasted!');
  };

  const [livePlaces, setLivePlaces] = useState<any[]>([]);

  useEffect(() => {
    safeFetchJson<any>('/api/admin/live-places').then(data => {
      if (data) {
        setLivePlaces(data.places || []);
      }
    });
  }, []);

  const handlePlaceUpdate = async (id: string, updates: any) => {
    // 1. Update live places API
    const data = await safeFetchJson<any>('/api/admin/live-places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates })
    });
    if (data && data.places) {
      setLivePlaces(data.places);
      
      // 2. If it's Tirumala (uuid-1), also sync to the global status!
      if (id === 'uuid-1') {
        const globalStatusUpdates: any = {};
        if (updates.time) globalStatusUpdates.waitTime = updates.time;
        if (updates.crowd) globalStatusUpdates.crowdLevel = updates.crowd.toLowerCase();
        if (updates.parking) globalStatusUpdates.accommodationStatus = updates.parking === 'FULL' ? 'full' : 'available';
        
        await fetch('/api/admin/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(globalStatusUpdates)
        });
      }
      
      notifyRealtimeUpdate();
      alert('Live status updated!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Live Operations</h1>
          <p className={styles.subtitle}>Manage real-time crowd, parking, and transit status for Layer 3</p>
        </div>
        <div className={styles.quickActions}>
          <button className={styles.dangerButton}>
            <AlertTriangle size={16} /> Broadcast Emergency Alert
          </button>
        </div>
      </div>

      <div className={styles.globalOverride}>
        <div className={styles.overrideHeader}>
          <Zap size={18} color="#d97706" />
          <h3>Global Weather Override</h3>
        </div>
        <p className={styles.overrideDesc}>Forces the recommendation engine to use this weather state instead of the API for all calculations.</p>
        <div className={styles.weatherToggles}>
          <button className={`${styles.weatherBtn} ${styles.active}`}>Auto (API)</button>
          <button className={styles.weatherBtn}>Clear</button>
          <button className={styles.weatherBtn}>Heavy Rain</button>
          <button className={styles.weatherBtn}>Extreme Heat</button>
        </div>
      </div>

      <div className={styles.ssdSection}>
        <div className={styles.overrideHeader}>
          <h3>🎟️ Slotted Sarva Darshan (SSD) Token Operations</h3>
        </div>
        <p className={styles.overrideDesc}>Manage offline free darshan token counters in Tirupati (Srinivasam, Vishnu Nivasam, Bhudevi Complex).</p>
        
        <div className={styles.ssdControls}>
          <div className={styles.controlGroup}>
            <label>Token Status</label>
            <select className={styles.select} value={ssdStatus.ssdTokenStatus} onChange={e => setSsdStatus(s => ({ ...s, ssdTokenStatus: e.target.value }))}>
              <option value="ISSUING">Issuing Tokens</option>
              <option value="PAUSED">Paused Temporarily</option>
              <option value="CLOSED">Closed for the Day</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>Issue Time / Quota Updates</label>
            <input type="text" className={styles.input} value={ssdStatus.ssdNextTokenTime} onChange={e => setSsdStatus(s => ({ ...s, ssdNextTokenTime: e.target.value }))} placeholder="e.g., Tomorrow 4:00 AM" style={{ width: '100%' }} />
          </div>

          <div className={styles.controlGroup}>
            <label>Pro Tip (When to go faster)</label>
            <input type="text" className={styles.input} value={ssdStatus.ssdNotice} onChange={e => setSsdStatus(s => ({ ...s, ssdNotice: e.target.value }))} placeholder="e.g., Visit Bhudevi Complex after 4 PM for faster queues" style={{ width: '100%' }} />
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className={styles.updateButton} onClick={handleBroadcast} style={{ width: 'auto', padding: '8px 24px' }}>
            Broadcast SSD Update
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {livePlaces.map(place => (
          <div key={place.id} className={styles.liveCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.placeName}>{place.name}</h3>
              <span className={styles.lastUpdated}><Clock size={12}/> {place.updated}</span>
            </div>
            
            <div className={styles.controls} id={`controls-${place.id}`}>
              <div className={styles.controlGroup}>
                <label>Wait Time (Hrs)</label>
                <input name="time" type="text" className={styles.input} defaultValue={place.time} placeholder="e.g. 2-3" />
              </div>

              <div className={styles.controlGroup}>
                <label>Crowd Level</label>
                <select name="crowd" className={styles.select} defaultValue={place.crowd}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="EXTREME">Extreme</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>Parking Status</label>
                <select name="parking" className={styles.select} defaultValue={place.parking}>
                  <option value="AVAILABLE">Available</option>
                  <option value="FULL">Full</option>
                </select>
              </div>
              
              <div className={styles.controlGroup}>
                <label>RTC Status</label>
                <select name="rtc" className={styles.select} defaultValue={place.rtc || 'NORMAL'}>
                  <option value="NORMAL">Normal</option>
                  <option value="DELAYED">Delayed</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>

            <button className={styles.updateButton} onClick={() => {
              const controls = document.getElementById(`controls-${place.id}`);
              if (!controls) return;
              const time = (controls.querySelector('[name="time"]') as HTMLInputElement).value;
              const crowd = (controls.querySelector('[name="crowd"]') as HTMLSelectElement).value;
              const parking = (controls.querySelector('[name="parking"]') as HTMLSelectElement).value;
              const rtc = (controls.querySelector('[name="rtc"]') as HTMLSelectElement).value;
              handlePlaceUpdate(place.id, { time, crowd, parking, rtc });
            }}>
              Update Live Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
