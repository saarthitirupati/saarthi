'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Eye, Sparkles, Activity, ArrowRight } from 'lucide-react';
import styles from '../admin.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface TrafficSummary {
  last7: { date: string; total: number }[];
  todayTotal: number;
  allTotal: number;
  topPage: string;
  entries: { date: string; path: string; count: number }[];
}

export default function AdminTraffic() {
  const [traffic, setTraffic] = useState<TrafficSummary | null>(null);

  useEffect(() => {
    fetch('/api/admin/traffic').then(r => r.json()).then(setTraffic);
  }, []);

  const maxBar = traffic ? Math.max(...traffic.last7.map(d => d.total), 1) : 1;

  const fmtDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Compute top pages from entries
  const pagesMap = traffic?.entries.reduce((acc: any, e) => {
    acc[e.path] = (acc[e.path] || 0) + e.count;
    return acc;
  }, {}) ?? {};

  const topPagesList = Object.entries(pagesMap)
    .map(([path, count]) => ({ path, count: count as number }))
    .sort((a, b) => b.count - a.count);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
    >
      <div className={styles.topRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Traffic Analytics</h1>
          <p className={styles.pageSubtitle}>Real-time insights and visitor trends across Saarthi</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label: "Today's Visitors", value: traffic?.todayTotal ?? '—', delta: 'Live tracking', icon: Activity, live: true },
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
        {/* Large Traffic Chart */}
        <motion.div 
          className={styles.chartCard}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{ gridColumn: '1 / -1' }}
        >
          <p className={styles.chartTitle}><TrendingUp size={18} /> Page Views — Last 7 Days</p>
          {traffic ? (
            <div className={styles.barChart} style={{ height: 260 }}>
              {traffic.last7.map((day, i) => (
                <div key={day.date} className={styles.barWrap}>
                  <span className={styles.barCount}>{day.total}</span>
                  <motion.div
                    className={styles.bar}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((day.total / maxBar) * 200, 4)}px` }}
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
      </div>

      {/* Traffic Sources Table */}
      <motion.div 
        className={styles.tableCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className={styles.tableHeader}>
          <p className={styles.tableTitle}>Top Pages</p>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Page Path</th>
              <th>Total Views</th>
              <th>% of Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {topPagesList.map((p, idx) => {
                const percentage = traffic?.allTotal ? ((p.count / traffic.allTotal) * 100).toFixed(1) : '0.0';
                return (
                  <motion.tr 
                    key={p.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(14, 107, 114, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: '#2DD4BF', fontSize: 14, fontWeight: 700 }}>{idx + 1}</span>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 600, color: '#F1F5F9' }}>{p.path}</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 15, color: '#CBD5E1', fontWeight: 500 }}>{p.count.toLocaleString()}</span> views</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 1 + idx * 0.1, duration: 0.8 }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, #0E6B72, #2DD4BF)' }} 
                          />
                        </div>
                        <span style={{ fontSize: 13, color: '#94A3B8', width: 40 }}>{percentage}%</span>
                      </div>
                    </td>
                    <td>
                      <Link href={p.path} target="_blank" className={styles.btnSecondary} style={{ padding: '6px 12px', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        Visit <ArrowRight size={14} />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {!traffic && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>Loading data...</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
