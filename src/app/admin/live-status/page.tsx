'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Bell, Save, Users } from 'lucide-react';
import styles from '../admin.module.css';

interface DarshanTypeStatus {
  name: string;
  waitTime: string;
  peakHours: string;
}

interface TirumalaStatus {
  waitTime: string;
  crowdLevel: 'low' | 'moderate' | 'high' | 'very-high';
  sevaStatus: string;
  notice: string;
  lastUpdated: string;
  darshanSpeed: 'fast' | 'normal' | 'slow';
  accommodationStatus: 'available' | 'limited' | 'full';
  ladduAvailability: 'available' | 'limited' | 'no-stock';
  weather: string;
  darshans: DarshanTypeStatus[];
  ssdTokenStatus: 'issuing' | 'paused' | 'closed-for-day';
  ssdNextTokenTime: string;
  ssdTokenSlots: { slotTime: string; status: 'available' | 'filling' | 'closed'; tokensLeft?: string }[];
  ssdNotice: string;
  ssdTimingsGuide: string;
  ssdCounters: { name: string; description: string }[];
}

export default function LiveStatusEditor() {
  const [status, setStatus] = useState<TirumalaStatus>({
    waitTime: '2-3 hours',
    crowdLevel: 'moderate',
    sevaStatus: 'All sevas open',
    notice: '',
    lastUpdated: '',
    darshanSpeed: 'normal',
    accommodationStatus: 'available',
    ladduAvailability: 'available',
    weather: 'Pleasant, 24°C',
    darshans: [],
    ssdTokenStatus: 'issuing',
    ssdNextTokenTime: '',
    ssdTokenSlots: [],
    ssdNotice: '',
    ssdTimingsGuide: '',
    ssdCounters: [],
  });
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/admin/status').then(r => r.json()).then(setStatus);
  }, []);

  if (!mounted) return null;

  const formatWaitTimeValue = (val: string) => {
    if (!val) return '';
    const clean = val.trim();
    if (/^\d+$/.test(clean)) {
      const num = parseInt(clean, 10);
      return `${num} ${num === 1 ? 'hour' : 'hours'}`;
    }
    return clean;
  };

  const saveStatus = async () => {
    setStatusSaving(true);
    const formattedStatus = {
      ...status,
      waitTime: formatWaitTimeValue(status.waitTime),
      darshans: (status.darshans || []).map(d => ({
        ...d,
        waitTime: formatWaitTimeValue(d.waitTime)
      }))
    };

    try {
      const res = await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedStatus),
      });
      const updated = await res.json();
      setStatus(updated);
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 2500);
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.topRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Tirumala Live Status</h1>
          <p className={styles.pageSubtitle}>Manually update Darshan queue times and alerts</p>
        </div>
      </div>

      <div className={styles.chartCard} style={{ marginTop: 20 }}>
        <p className={styles.chartTitle}>
          <Activity size={18} /> Live Tirumala Queue Updates
        </p>
        <p style={{ fontSize: 12, color: '#64748B', marginBottom: 16, marginTop: -4 }}>
          Changes published here appear instantly on the user home screen.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 12 }}>
          {/* Crowd Level */}
          <div>
            <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
              <Users size={12} style={{ display: 'inline', marginRight: 4 }} />Crowd Level
            </label>
            <select
              value={status.crowdLevel}
              onChange={e => setStatus(s => ({ ...s, crowdLevel: e.target.value as any }))}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #334155', background: '#1E293B', color: '#E2E8F0', fontSize: 13 }}
            >
              <option value="low">🟢 Less Crowded</option>
              <option value="moderate">🟡 Moderate</option>
              <option value="high">🟠 Heavy Crowd</option>
              <option value="very-high">🔴 Very Heavy</option>
            </select>
          </div>

          {/* Overall Wait Time */}
          <div>
            <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
              <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />Wait Time (Overall)
            </label>
            <input
              type="text"
              value={status.waitTime}
              onChange={e => setStatus(s => ({ ...s, waitTime: e.target.value }))}
              placeholder="e.g. 2-3 hours"
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #334155', background: '#1E293B', color: '#E2E8F0', fontSize: 13, boxSizing: 'border-box' }}
            />
          </div>

          {/* Darshan Queue Estimates & Peak Crowd Hours */}
          <div style={{ gridColumn: '1 / -1', marginTop: 12, borderTop: '1px solid #334155', paddingTop: 16 }}>
            <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 14 }}>
              ⏳ Darshan Queue Estimates & Peak Crowd Hours
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
              {(status.darshans || []).map((d, index) => {
                let icon = '🛕';
                if (d.name.includes('300') || d.name.toLowerCase().includes('special')) icon = '🎫';
                else if (d.name.toLowerCase().includes('footpath') || d.name.toLowerCase().includes('divya')) icon = '🚶‍♂️';
                else if (d.name.toLowerCase().includes('vip') || d.name.toLowerCase().includes('srivani')) icon = '🌟';

                return (
                  <div key={index} style={{ background: '#1E293B', padding: '14px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#F1F5F9' }}>{d.name}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                          Wait Time
                        </label>
                        <input
                          type="text"
                          value={d.waitTime}
                          onChange={e => {
                            const list = [...status.darshans];
                            list[index] = { ...list[index], waitTime: e.target.value };
                            setStatus(s => ({ ...s, darshans: list }));
                          }}
                          placeholder="e.g. 12-14 hours"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                          Peak Crowd Hours
                        </label>
                        <input
                          type="text"
                          value={d.peakHours}
                          onChange={e => {
                            const list = [...status.darshans];
                            list[index] = { ...list[index], peakHours: e.target.value };
                            setStatus(s => ({ ...s, darshans: list }));
                          }}
                          placeholder="e.g. Sat-Sun 6 AM"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: '12px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SSD Token Timing Management */}
          <div style={{ gridColumn: '1 / -1', marginTop: 12, borderTop: '1px solid #334155', paddingTop: 16 }}>
            <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 14 }}>
              🎟 SSD Token Timing Management
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  Token Status
                </label>
                <select
                  value={status.ssdTokenStatus}
                  onChange={e => setStatus(s => ({ ...s, ssdTokenStatus: e.target.value as any }))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: 12 }}
                >
                  <option value="issuing">🟢 Issuing Tokens</option>
                  <option value="paused">🟡 Paused</option>
                  <option value="closed-for-day">🔴 Closed for Day</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  Next Token Time
                </label>
                <input
                  type="text"
                  value={status.ssdNextTokenTime}
                  onChange={e => setStatus(s => ({ ...s, ssdNextTokenTime: e.target.value }))}
                  placeholder="e.g. 2:00 PM"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: 12, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                SSD Notice
              </label>
              <textarea
                value={status.ssdNotice}
                onChange={e => setStatus(s => ({ ...s, ssdNotice: e.target.value }))}
                placeholder="e.g. Morning tokens exhausted, next batch at 2 PM"
                rows={2}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: 12, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                SSD Timings Guide (When TTD issues tokens)
              </label>
              <textarea
                value={status.ssdTimingsGuide || ''}
                onChange={e => setStatus(s => ({ ...s, ssdTimingsGuide: e.target.value }))}
                placeholder="e.g. Offline free SSD tokens are released daily starting at 3:00 AM / 4:00 AM..."
                rows={3}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: 12, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            {/* Counters Locations (Where to get tokens) */}
            <div style={{ marginBottom: 16, borderTop: '1px dashed #334155', paddingTop: 12 }}>
              <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📍 SSD Counter Location Settings
              </label>
              {(status.ssdCounters || []).map((counter, idx) => (
                <div key={idx} style={{ background: '#1E293B', padding: '10px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <label style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>
                      Counter Name
                    </label>
                    <input
                      type="text"
                      value={counter.name}
                      onChange={e => {
                        const list = [...status.ssdCounters];
                        list[idx] = { ...list[idx], name: e.target.value };
                        setStatus(s => ({ ...s, ssdCounters: list }));
                      }}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: '11px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>
                      Counter Description / Directions
                    </label>
                    <input
                      type="text"
                      value={counter.description}
                      onChange={e => {
                        const list = [...status.ssdCounters];
                        list[idx] = { ...list[idx], description: e.target.value };
                        setStatus(s => ({ ...s, ssdCounters: list }));
                      }}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: '11px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {(status.ssdTokenSlots || []).map((slot, idx) => (
              <div key={idx} style={{ background: '#1E293B', padding: 14, borderRadius: 12, border: '1px solid #334155', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 10, alignItems: 'end', marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Slot Time
                  </label>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9', padding: '8px 0', display: 'block' }}>{slot.slotTime}</span>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Status
                  </label>
                  <select
                    value={slot.status}
                    onChange={e => {
                      const list = [...status.ssdTokenSlots];
                      list[idx] = { ...list[idx], status: e.target.value as any };
                      setStatus(s => ({ ...s, ssdTokenSlots: list }));
                    }}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: 12 }}
                  >
                    <option value="available">Available</option>
                    <option value="filling">Filling</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Tokens Left
                  </label>
                  <input
                    type="text"
                    value={slot.tokensLeft || ''}
                    onChange={e => {
                      const list = [...status.ssdTokenSlots];
                      list[idx] = { ...list[idx], tokensLeft: e.target.value };
                      setStatus(s => ({ ...s, ssdTokenSlots: list }));
                    }}
                    placeholder="e.g. 500"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #475569', background: '#0F172A', color: '#E2E8F0', fontSize: 12, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
              <Bell size={12} style={{ display: 'inline', marginRight: 4 }} />Special Notice (optional)
            </label>
            <textarea
              value={status.notice}
              onChange={e => setStatus(s => ({ ...s, notice: e.target.value }))}
              placeholder="e.g. Brahmotsavam starts tomorrow — expect heavy crowds"
              rows={2}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #334155', background: '#1E293B', color: '#E2E8F0', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        <button
          onClick={saveStatus}
          disabled={statusSaving}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: statusSaved ? '#16A34A' : 'linear-gradient(135deg, #E9801D, #D0A73D)',
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 20px', fontSize: 13, fontWeight: 700,
            cursor: statusSaving ? 'not-allowed' : 'pointer',
            opacity: statusSaving ? 0.7 : 1, transition: 'all 0.2s'
          }}
        >
          <Save size={15} />
          {statusSaving ? 'Saving…' : statusSaved ? '✓ Saved!' : 'Publish Status'}
        </button>
      </div>
    </motion.div>
  );
}
