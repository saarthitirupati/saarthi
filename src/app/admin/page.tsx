'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp, Eye, PlusCircle, Sparkles, Pencil, Activity, Users, Clock, Bell, Save } from 'lucide-react';
import styles from './admin.module.css';
import { PLACES } from '@/data/places';
import { motion } from 'framer-motion';

interface TrafficSummary {
  last7: { date: string; total: number }[];
  todayTotal: number;
  allTotal: number;
  topPage: string;
}

export default function AdminDashboard() {
  const [traffic, setTraffic] = useState<TrafficSummary | null>(null);
  const [dynCount, setDynCount] = useState(0);
  const [allPlaces, setAllPlaces] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/traffic').then(r => r.json()).then(setTraffic);
    fetch('/api/admin/places').then(r => r.json()).then(d => {
      const p = d.places || [];
      setAllPlaces(p);
      setDynCount(p.filter((x: any) => x._dynamic).length);
    });
  }, []);

  const maxBar = traffic ? Math.max(...traffic.last7.map(d => d.total), 1) : 1;

  const fmtDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { weekday: 'short' });
  };

  const recentPlaces = allPlaces.length > 0 
    ? [...allPlaces].slice(-5).reverse() 
    : PLACES.slice(0, 5);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
    >
      <div className={styles.topRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Real-time overview of JeevaPath platform</p>
        </div>
        <Link href="/admin/places/new" className={styles.btnPrimary}>
          <PlusCircle size={16} /> Add Place
        </Link>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: 'Total Places', value: PLACES.length + dynCount, delta: `↑ ${dynCount} dynamic`, icon: MapPin },
          { label: "Today's Visitors", value: traffic?.todayTotal ?? '—', delta: 'Live tracking', icon: TrendingUp, live: true },
          { label: 'Total Page Views', value: traffic?.allTotal?.toLocaleString() ?? '—', delta: 'All time', icon: Eye },
          { label: 'Top Page', value: traffic?.topPage ?? '—', delta: 'Most visited', icon: Sparkles },
        ].map((s, i) => (
          <motion.div 
            key={s.label}
            className={styles.statCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statValue}>{s.value}</p>
            <div className={styles.statDelta}>
              {s.live && <span className={styles.pulse} />}
              {s.delta}
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        {/* Traffic Chart */}
        <motion.div 
          className={styles.chartCard}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className={styles.chartTitle}><TrendingUp size={18} /> Page Views — Last 7 Days</p>
          {traffic ? (
            <div className={styles.barChart}>
              {traffic.last7.map((day, i) => (
                <div key={day.date} className={styles.barWrap}>
                  <span className={styles.barCount}>{day.total}</span>
                  <motion.div
                    className={styles.bar}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((day.total / maxBar) * 110, 4)}px` }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                  />
                  <span className={styles.barLabel}>{fmtDate(day.date)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#4A5568', fontSize: 14 }}>Loading traffic data…</p>
          )}
        </motion.div>

        {/* Admin Tips */}
        <motion.div 
          className={styles.chartCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className={styles.chartTitle}><Sparkles size={18} /> Admin Tips</p>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none', color: '#94A3B8', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li style={{ display: 'flex', gap: 8 }}><span>✨</span> Keep descriptions cinematic for better engagement.</li>
            <li style={{ display: 'flex', gap: 8 }}><span>📍</span> Ensure coordinates are accurate for the route map.</li>
            <li style={{ display: 'flex', gap: 8 }}><span>🏷️</span> Use diverse tags to help the AI categorize better.</li>
          </ul>
        </motion.div>
      </div>

      {/* Recent Places */}
      <motion.div 
        className={styles.tableCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className={styles.tableHeader}>
          <p className={styles.tableTitle}>Recent Places</p>
          <Link href="/admin/places" className={styles.btnSecondary}>View All</Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Place</th>
              <th>Type</th>
              <th>Distance</th>
              <th>Budget</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentPlaces.map(p => (
              <tr key={p.id}>
                <td>
                  <div className={styles.placeThumbCell}>
                    <div
                      className={styles.placeImg}
                      style={{ backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    <div>
                      <p className={styles.placeCellName}>{p.name}</p>
                      <p className={styles.placeCellSub}>{p.location}</p>
                    </div>
                  </div>
                </td>
                <td><span className={`${styles.badge} ${styles.badgeBlue}`}>{p.placeType}</span></td>
                <td>{p.distanceKms} km</td>
                <td>
                  <span className={`${styles.badge} ${p.budgetLevel === 'budget' ? styles.badgeGreen : p.budgetLevel === 'premium' ? styles.badgePurple : styles.badgeOrange}`}>
                    {p.budgetLevel}
                  </span>
                </td>
                <td>⭐ {p.rating}</td>
                <td>
                  {p._dynamic && (
                    <Link href={`/admin/places/${p.id}/edit`} className={styles.recentAction}>
                      <Pencil size={14} />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
