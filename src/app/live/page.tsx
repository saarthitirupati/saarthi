'use client';

import React from 'react';
import { ArrowLeft, BellRing, Users, Clock, AlertTriangle, ShieldCheck, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { useRealtimeAlerts } from '@/lib/useRealtimeAlerts';

import styles from './Live.module.css';

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const CROWD_COLOR: Record<string, string> = {
  low: '#16a34a',
  moderate: '#d97706',
  high: '#ea580c',
  'very-high': '#dc2626',
};

const SSD_LABEL: Record<string, string> = {
  issuing: 'Issuing Now',
  paused: 'Paused',
  'closed-for-day': 'Closed for Today',
};

export default function LivePage() {
  const router = useRouter();
  const { status, loading: statusLoading } = useRealtimeStatus();
  const { alerts, loading: alertsLoading } = useRealtimeAlerts();

  const crowdColor = status ? (CROWD_COLOR[status.crowdLevel] ?? '#d97706') : '#d97706';

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={18} />
        </button>
        <h1 className={styles.headerTitle}>
          <BellRing size={18} />
          Live Updates
        </h1>
        <div style={{ width: '36px' }} />
      </header>

      <div className={styles.content}>

        {/* Trust line */}
        {status && (
          <div className={styles.trustLine}>
            <span className={styles.liveDot} />
            Updated {timeAgo(status.lastUpdated)} · Source: TTD Admin
          </div>
        )}

        {/* Crowd & Wait */}
        <section className={styles.section}>
          <span className={styles.sectionTitle}>Crowd & Wait Time</span>
          <div className={styles.crowdCard}>
            <div className={styles.crowdRow}>
              <Users size={18} color={crowdColor} />
              <span className={styles.crowdLevel} style={{ color: crowdColor }}>
                {statusLoading ? '—' : (status?.crowdLevel?.replace('-', ' ') ?? 'Unknown')}
              </span>
            </div>
            <div className={styles.crowdRow}>
              <Clock size={15} color="#78716c" />
              <span className={styles.crowdWait}>
                Est. wait: {statusLoading ? '—' : (status?.waitTime ?? '—')}
              </span>
            </div>
          </div>
        </section>

        {/* SSD Token */}
        <section className={styles.section}>
          <span className={styles.sectionTitle}>SSD Token</span>
          <div className={styles.ssdCard}>
            <div className={styles.ssdHeader}>
              <Ticket size={15} color="#7c3aed" />
              <span className={styles.ssdStatus}>
                {statusLoading ? '—' : (SSD_LABEL[status?.ssdTokenStatus ?? ''] ?? '—')}
              </span>
            </div>

            {/* DYNAMIC ADMIN ISSUING TIME HIGHLIGHT BOX */}
            <div style={{
              background: status?.ssdTokenStatus === 'issuing' ? '#F0FDF4' : status?.ssdTokenStatus === 'paused' ? '#FFFBEB' : '#FEF2F2',
              border: `1px solid ${status?.ssdTokenStatus === 'issuing' ? '#BBF7D0' : status?.ssdTokenStatus === 'paused' ? '#FDE68A' : '#FECACA'}`,
              borderRadius: '12px',
              padding: '10px 14px',
              marginTop: '10px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color={status?.ssdTokenStatus === 'issuing' ? '#16A34A' : status?.ssdTokenStatus === 'paused' ? '#D97706' : '#DC2626'} />
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748B', display: 'block' }}>
                    Next Release / Issuing Time
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: status?.ssdTokenStatus === 'issuing' ? '#166534' : status?.ssdTokenStatus === 'paused' ? '#B45309' : '#991B1B' }}>
                    {status?.ssdNextTokenTime ? status.ssdNextTokenTime : (status?.ssdTokenStatus === 'issuing' ? 'Tokens Being Issued Now' : 'Closed for Today')}
                  </span>
                </div>
              </div>
              {status?.ssdNotice && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#1E293B',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {status.ssdNotice}
                </span>
              )}
            </div>
          </div>
          
          <div className={styles.ssdInfo}>
            {status?.ssdTimingsGuide ? (
              <p>{status.ssdTimingsGuide}</p>
            ) : (
              <>
                <p>
                  <strong>SSD (Slotted Sarva Darshan)</strong> is a free time-slotted pass issued by the TTD to reduce waiting times for free darshan at the Tirumala Temple from 12–24+ hours down to 3–6 hours.
                </p>
                <h3>How to Get Your Token</h3>
                <ul>
                  <li><strong>Where:</strong> Offline counters in Tirupati at Srinivasam Complex, Vishnu Nivasam (railway station), and Bhudevi Complex (Alipiri tollgate).</li>
                  <li><strong>When:</strong> Counters typically open around midnight (3:00 AM / 4:00 AM) for same-day darshan. Queues form very early due to high demand.</li>
                  <li><strong>Requirements:</strong> All pilgrims must be physically present and carry their original Aadhaar cards.</li>
                </ul>
                <h3>Key Rules</h3>
                <ul className={styles.rulesList}>
                  <li>Children under 12 do not require a token (free entry with parents).</li>
                  <li>Tokens are non-transferable.</li>
                  <li>Every token includes one free laddu prasadam.</li>
                </ul>
              </>
            )}
          </div>
        </section>



        {/* Active Alerts */}
        <section className={styles.section}>
          <span className={styles.sectionTitle}>Active Alerts</span>
          {alertsLoading ? (
            <div className={styles.allClearCard}>Checking for alerts…</div>
          ) : alerts.length === 0 ? (
            <div className={styles.allClearCard}>
              <ShieldCheck size={20} color="#16a34a" />
              <span>No active alerts — conditions are normal</span>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={styles.alertCard}>
                <div className={styles.alertHeader}>
                  <AlertTriangle size={18} className={styles.alertIcon} />
                  <h3 className={styles.alertTitle}>{alert.title}</h3>
                </div>
                <p className={styles.alertDesc}>{alert.description}</p>
                {alert.image && (
                  <img 
                    src={alert.image} 
                    alt={alert.title} 
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px', marginTop: '8px' }}
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                )}
              </div>
            ))
          )}
        </section>

      </div>
    </main>
  );
}
