'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './LiveUpdates.module.css';
import { Activity, Clock, Zap, AlertTriangle, RefreshCw, CheckCircle2, Ticket } from 'lucide-react';
import { notifyRealtimeUpdate } from '@/lib/useRealtimeStatus';
import { safeFetchJson } from '@/lib/safeFetch';

export default function AdminLiveUpdates() {
  const [ssdStatus, setSsdStatus] = useState({ ssdTokenStatus: 'issuing', ssdNextTokenTime: '', ssdNotice: '' });
  const [weatherState, setWeatherState] = useState<string>('Auto (API)');
  const [livePlaces, setLivePlaces] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [placeUpdateStatus, setPlaceUpdateStatus] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchLiveData = useCallback(async () => {
    try {
      const [fetchedStatus, placesData] = await Promise.all([
        safeFetchJson<any>('/api/admin/status?t=' + Date.now()),
        safeFetchJson<any>('/api/admin/live-places?t=' + Date.now())
      ]);

      if (fetchedStatus) {
        setStatusData(fetchedStatus);
        setSsdStatus({
          ssdTokenStatus: fetchedStatus.ssdTokenStatus || 'issuing',
          ssdNextTokenTime: fetchedStatus.ssdNextTokenTime || '',
          ssdNotice: fetchedStatus.ssdNotice || ''
        });
        if (fetchedStatus.weather) {
          setWeatherState(fetchedStatus.weather);
        }
      }

      if (placesData && placesData.places) {
        setLivePlaces(placesData.places);
      }

      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Failed to fetch live operations data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);

    const handleCustomEvent = () => fetchLiveData();
    window.addEventListener('saarthi:live_update', handleCustomEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('saarthi:live_update', handleCustomEvent);
    };
  }, [fetchLiveData]);

  const handleBroadcastSsd = async () => {
    try {
      await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ssdStatus)
      });
      notifyRealtimeUpdate();
      showToast('SSD Token Status Broadcasted Live!');
      fetchLiveData();
    } catch (e) {
      showToast('Failed to broadcast SSD status');
    }
  };

  const handleWeatherOverride = async (weather: string) => {
    setWeatherState(weather);
    try {
      await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weather })
      });
      notifyRealtimeUpdate();
      showToast(`Weather Override set to "${weather}"`);
    } catch (e) {
      showToast('Failed to update weather override');
    }
  };

  const handleEmergencyAlert = async () => {
    const alertMsg = prompt('Enter Emergency Alert Notice to broadcast to all visitors:', 'HIGH CROWD WARNING: Ghat road traffic slow. Exercise caution.');
    if (!alertMsg) return;

    try {
      await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Emergency Operational Alert',
          message: alertMsg,
          type: 'emergency',
          location: 'Tirumala / Tirupati',
          active: true
        })
      });
      await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notice: alertMsg })
      });
      notifyRealtimeUpdate();
      showToast('Emergency Alert Broadcasted Live to all visitors!');
      fetchLiveData();
    } catch (e) {
      showToast('Failed to send emergency broadcast');
    }
  };

  const handlePlaceUpdate = async (id: string, updates: any) => {
    setPlaceUpdateStatus(prev => ({ ...prev, [id]: 'Updating...' }));
    try {
      const data = await safeFetchJson<any>('/api/admin/live-places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates })
      });

      if (data && data.places) {
        setLivePlaces(data.places);
        
        if (id === 'uuid-1' || id.includes('1') || id === 'tirumala') {
          const globalStatusUpdates: any = {};
          if (updates.time) globalStatusUpdates.waitTime = updates.time;
          if (updates.crowd) {
            const c = updates.crowd.toUpperCase();
            if (c === 'LOW') globalStatusUpdates.crowdLevel = 'low';
            else if (c === 'MEDIUM') globalStatusUpdates.crowdLevel = 'moderate';
            else if (c === 'HIGH') globalStatusUpdates.crowdLevel = 'high';
            else if (c === 'EXTREME') globalStatusUpdates.crowdLevel = 'very-high';
            else globalStatusUpdates.crowdLevel = updates.crowd.toLowerCase();
          }
          if (updates.parking) globalStatusUpdates.accommodationStatus = updates.parking === 'FULL' ? 'full' : 'available';

          // Update individual Darshan Category wait times
          if (updates.sarva || updates.ssd || updates.special || updates.time) {
            const list = statusData?.darshans || [
              { name: 'Sarva Darshan (Free)', waitTime: '12-15 hours', peakHours: 'Daily 10 AM - 6 PM' },
              { name: 'Special Entry (₹300)', waitTime: '3-4 hours', peakHours: 'Daily 9 AM - 3 PM' },
              { name: 'Divya Darshan (Footpath)', waitTime: '8-10 hours', peakHours: 'Daily 8 AM - 4 PM' },
              { name: 'VIP / Srivani Break', waitTime: '1.5 hours', peakHours: 'Daily 6 AM - 8 AM' }
            ];
            globalStatusUpdates.darshans = list.map((d: any) => {
              const nameLower = (d.name || '').toLowerCase();
              if ((updates.sarva || updates.time) && (nameLower.includes('sarva') || nameLower.includes('free'))) {
                return { ...d, waitTime: updates.sarva || updates.time };
              }
              if (updates.ssd && (nameLower.includes('divya') || nameLower.includes('footpath') || nameLower.includes('ssd'))) {
                return { ...d, waitTime: updates.ssd };
              }
              if (updates.special && (nameLower.includes('300') || nameLower.includes('special'))) {
                return { ...d, waitTime: updates.special };
              }
              return d;
            });
            if (updates.sarva) {
              globalStatusUpdates.waitTime = updates.sarva;
            }
          }
          
          await fetch('/api/admin/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(globalStatusUpdates)
          });
        }
        
        notifyRealtimeUpdate();
        fetchLiveData();
        setPlaceUpdateStatus(prev => ({ ...prev, [id]: '✓ Updated!' }));
        showToast('Live Temple Status updated and broadcasted live!');
        setTimeout(() => {
          setPlaceUpdateStatus(prev => ({ ...prev, [id]: '' }));
        }, 2500);
      }
    } catch (e) {
      setPlaceUpdateStatus(prev => ({ ...prev, [id]: 'Failed' }));
    }
  };

  return (
    <div className={styles.container}>
      {/* Dynamic Toast Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          fontSize: '13.5px',
          fontWeight: 700,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} color="#4ADE80" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Live Operations</h1>
          <p className={styles.subtitle}>Manage real-time crowd, parking, and transit status across all key hubs</p>
        </div>
        <div className={styles.quickActions} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#16A34A',
            background: '#DCFCE7',
            border: '1px solid #86EFAC',
            padding: '5px 12px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
            Live Sync (5s) {lastUpdated && `· ${lastUpdated}`}
          </span>
          <button 
            onClick={fetchLiveData} 
            title="Refresh Live Operations"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '9px 14px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button className={styles.dangerButton} onClick={handleEmergencyAlert}>
            <AlertTriangle size={16} /> Broadcast Emergency Alert
          </button>
        </div>
      </div>

      <div className={styles.globalOverride}>
        <div className={styles.overrideHeader}>
          <Zap size={18} color="#d97706" />
          <h3>Global Weather Override</h3>
        </div>
        <p className={styles.overrideDesc}>Forces the recommendation engine and live status banner to display this active weather condition.</p>
        <div className={styles.weatherToggles}>
          {['Auto (API)', 'Clear Sky, 26°C', 'Pleasant, 24°C', 'Heavy Rain, 22°C', 'Extreme Heat, 38°C'].map(w => (
            <button 
              key={w}
              className={`${styles.weatherBtn} ${weatherState === w ? styles.active : ''}`}
              onClick={() => handleWeatherOverride(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.ssdSection}>
        <div className={styles.overrideHeader}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={18} color="#2563EB" /> Slotted Sarva Darshan (SSD) Token Operations
          </h3>
        </div>
        <p className={styles.overrideDesc}>Manage offline free darshan token counters in Tirupati (Srinivasam, Vishnu Nivasam, Bhudevi Complex).</p>
        
        <div className={styles.ssdControls}>
          <div className={styles.controlGroup}>
            <label>Token Status</label>
            <select 
              className={styles.select} 
              value={ssdStatus.ssdTokenStatus} 
              onChange={e => setSsdStatus(s => ({ ...s, ssdTokenStatus: e.target.value }))}
            >
              <option value="issuing">Issuing Tokens</option>
              <option value="paused">Paused Temporarily</option>
              <option value="closed-for-day">Closed for the Day</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>Issue Time / Quota Updates</label>
            <input 
              type="text" 
              className={styles.input} 
              value={ssdStatus.ssdNextTokenTime} 
              onChange={e => setSsdStatus(s => ({ ...s, ssdNextTokenTime: e.target.value }))} 
              placeholder="e.g., Tomorrow 4:00 AM" 
              style={{ width: '100%' }} 
            />
          </div>

          <div className={styles.controlGroup}>
            <label>Pro Tip (When to go faster)</label>
            <input 
              type="text" 
              className={styles.input} 
              value={ssdStatus.ssdNotice} 
              onChange={e => setSsdStatus(s => ({ ...s, ssdNotice: e.target.value }))} 
              placeholder="e.g., Visit Bhudevi Complex after 4 PM for faster queues" 
              style={{ width: '100%' }} 
            />
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className={styles.updateButton} onClick={handleBroadcastSsd} style={{ width: 'auto', padding: '8px 24px', background: '#2563EB', color: '#FFFFFF' }}>
            Broadcast SSD Update Live
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {livePlaces.map(place => (
          <div key={place.id} className={styles.liveCard}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.placeName}>{place.name}</h3>
                {placeUpdateStatus[place.id] && (
                  <span style={{ fontSize: '11px', fontWeight: 800, color: placeUpdateStatus[place.id].includes('✓') ? '#16A34A' : '#2563EB' }}>
                    {placeUpdateStatus[place.id]}
                  </span>
                )}
              </div>
              <span className={styles.lastUpdated}><Clock size={12}/> {place.updated}</span>
            </div>
            
            <div className={styles.controls} id={`controls-${place.id}`}>
              <div className={styles.controlGroup}>
                <label>Wait Time (Hrs / Mins)</label>
                <input name="time" type="text" className={styles.input} defaultValue={place.time} placeholder="e.g. 2-3 hours" />
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

              {(place.id === 'uuid-1' || place.name.includes('Tirumala')) && (
                <>
                  <div className={styles.controlGroup} style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', marginTop: '6px' }}>
                    <label style={{ color: '#D97706', fontWeight: 800 }}>👥 Sarva Darshan Wait</label>
                    <input 
                      name="sarva" 
                      type="text" 
                      className={styles.input} 
                      defaultValue={
                        statusData?.darshans?.find((d: any) => d.name?.toLowerCase().includes('sarva') || d.name?.toLowerCase().includes('free'))?.waitTime || '12-15 hours'
                      } 
                      placeholder="e.g. 10-12 hours" 
                    />
                  </div>
                  <div className={styles.controlGroup}>
                    <label style={{ color: '#0284C7', fontWeight: 800 }}>🎫 SSD / DD Wait</label>
                    <input 
                      name="ssd" 
                      type="text" 
                      className={styles.input} 
                      defaultValue={
                        statusData?.darshans?.find((d: any) => d.name?.toLowerCase().includes('divya') || d.name?.toLowerCase().includes('footpath') || d.name?.toLowerCase().includes('ssd'))?.waitTime || '8-10 hours'
                      } 
                      placeholder="e.g. 4-6 hours" 
                    />
                  </div>
                  <div className={styles.controlGroup}>
                    <label style={{ color: '#CA8A04', fontWeight: 800 }}>⚡ ₹300 Special Entry Wait</label>
                    <input 
                      name="special" 
                      type="text" 
                      className={styles.input} 
                      defaultValue={
                        statusData?.darshans?.find((d: any) => d.name?.includes('300') || d.name?.toLowerCase().includes('special'))?.waitTime || '3-4 hours'
                      } 
                      placeholder="e.g. 3-5 hours" 
                    />
                  </div>
                </>
              )}
            </div>

            <button 
              className={styles.updateButton} 
              onClick={() => {
                const controls = document.getElementById(`controls-${place.id}`);
                if (!controls) return;
                const time = (controls.querySelector('[name="time"]') as HTMLInputElement).value;
                const crowd = (controls.querySelector('[name="crowd"]') as HTMLSelectElement).value;
                const parking = (controls.querySelector('[name="parking"]') as HTMLSelectElement).value;
                const rtc = (controls.querySelector('[name="rtc"]') as HTMLSelectElement).value;

                const sarvaEl = controls.querySelector('[name="sarva"]') as HTMLInputElement | null;
                const ssdEl = controls.querySelector('[name="ssd"]') as HTMLInputElement | null;
                const specialEl = controls.querySelector('[name="special"]') as HTMLInputElement | null;

                const sarva = sarvaEl?.value;
                const ssd = ssdEl?.value;
                const special = specialEl?.value;

                handlePlaceUpdate(place.id, { time, crowd, parking, rtc, sarva, ssd, special });
              }}
            >
              Update Live Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

