'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Clock, Users, Bell, ChevronDown, ChevronUp, 
  RefreshCw, CloudSun, Box, Hotel, Zap, CalendarDays,
  Ticket, Star
} from 'lucide-react';
import styles from './LiveStatus.module.css';

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
  darshans?: DarshanTypeStatus[];
}

const CROWD_META = {
  low:       { label: 'Less Crowded', color: '#16A34A', bg: '#DCFCE7', pulse: '#16A34A', percent: 15 },
  moderate:  { label: 'Moderate',     color: '#D97706', bg: '#FEF3C7', pulse: '#D97706', percent: 45 },
  high:      { label: 'Heavy Crowd',  color: '#EA580C', bg: '#FFEDD5', pulse: '#EA580C', percent: 75 },
  'very-high': { label: 'Very Heavy', color: '#DC2626', bg: '#FEE2E2', pulse: '#DC2626', percent: 95 },
};

const ACCOMMODATION_META = {
  available: { label: 'Rooms Available', color: '#16A34A', bg: '#E8F5E9' },
  limited:   { label: 'Filling Fast', color: '#D97706', bg: '#FFF8E1' },
  full:      { label: 'Fully Booked', color: '#DC2626', bg: '#FFEBEE' },
};

const LADDU_META = {
  available: { label: 'Abundant Stock', color: '#16A34A', bg: '#E8F5E9' },
  limited:   { label: 'Limited Stock', color: '#D97706', bg: '#FFF8E1' },
  'no-stock':{ label: 'No Stock', color: '#DC2626', bg: '#FFEBEE' },
};

const DARSHAN_FLOW_META = {
  fast:   { label: 'Moving Fast', color: '#16A34A', bg: '#E8F5E9' },
  normal: { label: 'Normal Pace', color: '#D97706', bg: '#FFF8E1' },
  slow:   { label: 'Slow Moving', color: '#DC2626', bg: '#FFEBEE' },
};

import { useRealtimeStatus } from '@/lib/useRealtimeStatus';

export default function LiveStatus() {
  const [expanded, setExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { status, loading } = useRealtimeStatus();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  if (!status) return null;

  const meta = CROWD_META[status.crowdLevel] ?? CROWD_META.moderate;
  const roomMeta = ACCOMMODATION_META[status.accommodationStatus] ?? ACCOMMODATION_META.available;
  const ladduMeta = LADDU_META[status.ladduAvailability] ?? LADDU_META.available;
  const flowMeta = DARSHAN_FLOW_META[status.darshanSpeed] ?? DARSHAN_FLOW_META.normal;

  const formatHeaderWait = (timeStr: string) => {
    const clean = timeStr.toLowerCase().replace('wait', '').replace('time', '').trim();
    if (!clean.endsWith('h') && !clean.endsWith('hrs') && !clean.endsWith('hours') && !clean.endsWith('hour') && !clean.endsWith('m') && !clean.endsWith('mins') && !clean.endsWith('minutes')) {
      return `${clean} hrs`;
    }
    return clean;
  };

  const getDarshanIcon = (name: string) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('300') || lowercase.includes('special')) {
      return <Ticket size={13} className={styles.iconCyan} />;
    }
    if (lowercase.includes('footpath') || lowercase.includes('divya')) {
      return <Zap size={13} className={styles.iconBlue} />;
    }
    if (lowercase.includes('vip') || lowercase.includes('srivani')) {
      return <Star size={13} className={styles.iconGold} />;
    }
    return <CalendarDays size={13} className={styles.iconOrange} />;
  };

  const getWaitTimeBadgeStyle = (timeStr: string) => {
    const clean = timeStr.toLowerCase();
    // Extract numbers if present to color-code wait severity
    const matches = clean.match(/\d+/g);
    const hours = matches ? Math.max(...matches.map(Number)) : 0;
    
    if (clean.includes('15') || clean.includes('12') || clean.includes('10') || hours >= 8) {
      return { color: '#B91C1C', background: '#FEE2E2' }; // Red
    }
    if (clean.includes('3') || clean.includes('4') || clean.includes('5') || hours >= 3) {
      return { color: '#B45309', background: '#FEF3C7' }; // Amber
    }
    return { color: '#047857', background: '#D1FAE5' }; // Green
  };

  const fmtTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch { return ''; }
  };

  return (
    <motion.div
      className={styles.banner}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Top row: always visible ── */}
      <div className={styles.topRow} onClick={() => setExpanded(e => !e)}>
        {/* Live dot + label */}
        <div className={styles.liveChip}>
          <span className={styles.liveDot} style={{ background: meta.pulse }} />
          <Activity size={13} strokeWidth={2.5} />
          <span>Tirumala Live</span>
        </div>

        {/* Crowd badge */}
        <div
          className={styles.crowdBadge}
          style={{ background: meta.bg, color: meta.color }}
        >
          <Users size={12} />
          {meta.label}
        </div>

        {/* Wait time */}
        <div className={styles.waitTime}>
          <Clock size={12} />
          <span>{formatHeaderWait(status.waitTime)} Wait</span>
        </div>

        {/* Expand toggle */}
        <div className={styles.toggleBtn}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* ── Expanded details ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.details}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Queue Wait Progress Meter */}
            <div className={styles.meterContainer}>
              <div className={styles.meterLabels}>
                <span className={styles.meterTitle}>Queue congestion</span>
                <span className={styles.meterVal}>{formatHeaderWait(status.waitTime)} overall</span>
              </div>
              <div className={styles.meterTrack}>
                <div 
                  className={styles.meterBar} 
                  style={{ width: `${meta.percent}%`, backgroundColor: meta.color }}
                />
              </div>
            </div>

            {/* Darshan Breakdown */}
            {status.darshans && status.darshans.length > 0 && (
              <div className={styles.darshanList}>
                <div className={styles.darshanHeader}>
                  <span>Darshan Category</span>
                  <span style={{ textAlign: 'center' }}>Wait Time</span>
                  <span style={{ textAlign: 'right' }}>Peak Hours</span>
                </div>
                {status.darshans.map((d, i) => (
                  <div key={i} className={styles.darshanRow}>
                    <div className={styles.darshanNameCol}>
                      {getDarshanIcon(d.name)}
                      <span className={styles.darshanName}>{d.name}</span>
                    </div>
                    <div className={styles.darshanTimeCol}>
                      <span 
                        className={styles.darshanTimeBadge} 
                        style={getWaitTimeBadgeStyle(d.waitTime)}
                      >
                        {d.waitTime}
                      </span>
                    </div>
                    <div className={styles.darshanPeakCol}>
                      <Clock size={11} className={styles.clockIcon} />
                      <span className={styles.darshanPeak}>{d.peakHours}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status Grid removed - focusing on times only */}

            {status.notice && (
              <div className={styles.noticeBox}>
                <Bell size={14} />
                <span>{status.notice}</span>
              </div>
            )}

            {/* Footer row */}
            <div className={styles.expandedFooter}>
              <button 
                className={`${styles.refreshButton} ${refreshing ? styles.refreshSpin : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefresh();
                }}
                disabled={refreshing}
                title="Refresh Status"
              >
                <RefreshCw size={13} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <p className={styles.updatedAt}>Updated at {fmtTime(status.lastUpdated)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
