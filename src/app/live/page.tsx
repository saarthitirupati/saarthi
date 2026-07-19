'use client';

import React from 'react';
import { ArrowLeft, BellRing, Users, Clock, AlertTriangle, ShieldCheck, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { useRealtimeAlerts } from '@/lib/useRealtimeAlerts';
import DarshanTimingsCard from '@/components/dashboard/DarshanTimingsCard';
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
              {status?.ssdNextTokenTime && (
                <span className={styles.ssdNext}>Next: {status.ssdNextTokenTime}</span>
              )}
            </div>
            {status?.ssdTokenSlots?.map((slot) => (
              <div key={slot.slotTime} className={styles.ssdSlot}>
                <span className={styles.ssdSlotTime}>{slot.slotTime}</span>
                <span className={`${styles.ssdSlotBadge} ${
                  slot.status === 'available' ? styles.ssd_available
                  : slot.status === 'filling' ? styles.ssd_filling
                  : styles.ssd_closed
                }`}>
                  {slot.status === 'closed'
                    ? 'Full'
                    : slot.status === 'filling'
                    ? `Filling · ${slot.tokensLeft}`
                    : 'Available'}
                </span>
              </div>
            ))}
            {status?.ssdTimingsGuide && (
              <p className={styles.ssdGuide}>{status.ssdTimingsGuide}</p>
            )}
          </div>
        </section>

        {/* Darshan Timings */}
        <section className={styles.section}>
          <span className={styles.sectionTitle}>Darshan Timings</span>
          <DarshanTimingsCard />
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
              </div>
            ))
          )}
        </section>

      </div>
    </main>
  );
}
