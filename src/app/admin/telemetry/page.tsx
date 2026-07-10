'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, Eye, Bookmark, HelpCircle, Compass, ShieldAlert, Award } from 'lucide-react';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabase';

interface UserEvent {
  id: string;
  sessionId: string;
  eventType: string;
  entityType: string | null;
  entityId: string | null;
  metadata: any;
  createdAt: string;
}

export default function TelemetryPage() {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    // Subscribe to realtime database changes for user_events in public schema
    const channel = supabase
      .channel('live-telemetry')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_events',
        },
        (payload) => {
          const newEvent = payload.new as UserEvent;
          setEvents((prev) => {
            if (prev.some(e => e.id === newEvent.id)) return prev;
            return [newEvent, ...prev].slice(0, 30);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [autoRefresh]);

  const eventTypes = ['all', ...Array.from(new Set(events.map(e => e.eventType)))];

  const filteredEvents = events.filter(e => filter === 'all' || e.eventType === filter);

  // Group stats
  const typeCounts = events.reduce((acc, e) => {
    acc[e.eventType] = (acc[e.eventType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group QR scans by Cab/Driver ID
  const qrScanCounts = Object.entries(
    events
      .filter(e => e.eventType === 'qr_scan')
      .reduce((acc, e) => {
        const cab = e.entityId || 'unknown';
        acc[cab] = (acc[cab] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  // Filter passenger feedback events
  const feedbackLogs = events
    .filter(e => e.eventType === 'passenger_feedback')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'viewed_temple': return <Eye size={16} color="#3B82F6" />;
      case 'read_story': return <Compass size={16} color="#F59E0B" />;
      case 'completed_quiz': return <Award size={16} color="#10B981" />;
      case 'saved_temple': return <Bookmark size={16} color="#EC4899" />;
      default: return <Zap size={16} color="#8B5CF6" />;
    }
  };

  const fmtTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.topRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Telemetry Events</h1>
          <p className={styles.pageSubtitle}>Real-time user behavior analytics & ML signals</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94A3B8', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={(e) => setAutoRefresh(e.target.checked)} 
              style={{ accentColor: '#2DD4BF' }}
            />
            Real-time stream ⚡
          </label>
          <button onClick={fetchEvents} className={styles.btnSecondary} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} className={loading ? styles.pulse : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.statsRow} style={{ marginTop: 24 }}>
        {[
          { label: 'Total Logs', value: events.length, desc: 'Last 30 telemetry events', icon: Zap },
          { label: 'Temple Views', value: typeCounts['viewed_temple'] || 0, desc: 'Interest mapping', icon: Eye },
          { label: 'Story Reads', value: typeCounts['read_story'] || 0, desc: 'Dwell time signals', icon: Compass },
          { label: 'Quiz Completes', value: typeCounts['completed_quiz'] || 0, desc: 'Interaction stats', icon: Award }
        ].map((c) => (
          <div key={c.label} className={styles.statCard}>
            <p className={styles.statLabel} style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
              <c.icon size={14} style={{ color: '#2DD4BF' }} />
              {c.label}
            </p>
            <p className={styles.statValue} style={{ margin: '8px 0' }}>{c.value}</p>
            <div className={styles.statDelta}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* GTM QR Pilot & Feedback Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginTop: '32px' }}>
        {/* Leaderboard Card */}
        <div className={styles.tableCard} style={{ margin: 0, padding: '20px' }}>
          <p className={styles.tableTitle} style={{ marginBottom: '16px' }}>🚕 QR Referral Leaderboard</p>
          {qrScanCounts.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center', padding: '20px' }}>No scans recorded yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {qrScanCounts.map(([cab, count]) => (
                <div key={cab} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#F1F5F9' }}>{cab}</span>
                  <span className={styles.badge} style={{ backgroundColor: 'rgba(45, 212, 191, 0.15)', color: '#2DD4BF', fontWeight: 800 }}>
                    {count} Scans
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Logs Card */}
        <div className={styles.tableCard} style={{ margin: 0, padding: '20px' }}>
          <p className={styles.tableTitle} style={{ marginBottom: '16px' }}>💬 Passenger Feedback Log</p>
          {feedbackLogs.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center', padding: '20px' }}>No feedback submitted yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', overflowY: 'auto' }}>
              {feedbackLogs.map((log) => (
                <div key={log.id} style={{ padding: '10px 12px', background: '#1E293B', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className={styles.badge} style={{ backgroundColor: 'rgba(233, 128, 29, 0.15)', color: '#E9801D', fontSize: '11px', fontWeight: 800 }}>
                      {log.entityId || 'general'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{fmtTime(log.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#E2E8F0', margin: 0, lineHeight: 1.4, fontStyle: 'italic' }}>
                    &quot;{log.metadata?.text || '—'}&quot;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter and Feed */}
      <div className={styles.tableCard} style={{ marginTop: 32 }}>
        <div className={styles.tableHeader} style={{ flexWrap: 'wrap', gap: 16 }}>
          <p className={styles.tableTitle}>Live Event Feed</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {eventTypes.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={filter === t ? styles.btnPrimary : styles.btnSecondary}
                style={{ fontSize: 12, padding: '6px 12px', textTransform: 'capitalize' }}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {loading && events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>Loading live feed...</div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>No telemetry logs matching filter criteria.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Session</th>
                <th>Event Type</th>
                <th>Target</th>
                <th>Target ID</th>
                <th>Payload</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(e => (
                <tr key={e.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: 13, color: '#94A3B8' }}>{fmtTime(e.createdAt)}</td>
                  <td style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748B' }} title={e.sessionId}>
                    {e.sessionId.slice(0, 8)}...
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {getEventIcon(e.eventType)}
                      <span className={styles.placeCellName} style={{ textTransform: 'capitalize', fontSize: 13 }}>
                        {e.eventType.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td>
                    {e.entityType ? (
                      <span className={styles.badge} style={{ backgroundColor: 'rgba(45, 212, 191, 0.1)', color: '#2DD4BF' }}>
                        {e.entityType}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748B' }}>{e.entityId || '—'}</td>
                  <td style={{ fontSize: 12, color: '#94A3B8' }}>
                    <pre style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', overflowX: 'auto', maxWidth: 300 }}>
                      {JSON.stringify(e.metadata || {})}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
