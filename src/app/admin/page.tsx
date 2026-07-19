'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Database, MessagesSquare } from 'lucide-react';
import styles from './admin.module.css';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [places, setPlaces] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/admin/places').then(r => r.json()).then(d => {
      setPlaces(d.places || []);
    });
  }, []);

  const totalPlaces = places.length;
  const verifiedPlaces = places.filter(p => p.verification_status === 'Verified').length;
  const partiallyVerified = places.filter(p => p.verification_status === 'Partially Verified').length;
  const notVerified = places.filter(p => p.verification_status === 'Not Verified').length;
  
  const trustScoreAvg = totalPlaces > 0 
    ? Math.round(places.reduce((acc, p) => acc + (p.trust_score || 0), 0) / totalPlaces) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
    >
      <div className={styles.topRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Content Health and Operations KPI</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div className={styles.statLabel}>Total Places</div>
            <div className={styles.statValue}>{totalPlaces}</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className={styles.statLabel}>Fully Verified</div>
            <div className={styles.statValue}>{verifiedPlaces}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className={styles.statLabel}>Needs Verification</div>
            <div className={styles.statValue}>{notVerified}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className={styles.statLabel}>Avg Trust Score</div>
            <div className={styles.statValue}>{trustScoreAvg}%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 40 }}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Recent Places</h2>
          <div className={styles.recentList}>
            {places.slice(0, 5).map((p: any) => (
              <div key={p.id} className={styles.recentItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EDF2F7', backgroundImage: `url(${p.image})`, backgroundSize: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: '#2D3748' }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: '#718096' }}>{p.verification_status}</div>
                  </div>
                </div>
                <Link href={`/admin/places/${p.id}/edit`} className={styles.btnSecondary} style={{ padding: '6px 12px', fontSize: 13 }}>
                  Edit
                </Link>
              </div>
            ))}
            <Link href="/admin/places" className={styles.viewAllBtn} style={{ display: 'block', textAlign: 'center', marginTop: 16, color: '#3B82F6', fontWeight: 500 }}>
              View all places &rarr;
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/admin/places/new" className={styles.btnPrimary} style={{ justifyContent: 'center' }}>
              + Add New Place
            </Link>
            <Link href="/admin/live-status" className={styles.btnSecondary} style={{ justifyContent: 'center' }}>
              Update Crowd Status
            </Link>
            <Link href="/admin/live-alerts" className={styles.btnSecondary} style={{ justifyContent: 'center' }}>
              Issue New Alert
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
