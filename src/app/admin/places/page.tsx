'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Pencil, Trash2, MapPin, ExternalLink, Filter } from 'lucide-react';
import styles from '../admin.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPlaces() {
  const [places, setPlaces] = useState<any[]>([]);
  const [q, setQ]           = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/admin/places').then(r => r.json()).then(d => {
      setPlaces(d.places ?? []);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const del = async (id: string, isDynamic: boolean) => {
    if (!isDynamic) return alert('Static places are part of the core build and cannot be deleted here.');
    if (!confirm('Are you sure you want to delete this place? This action is permanent.')) return;
    await fetch(`/api/admin/places/${id}`, { method: 'DELETE' });
    load();
  };

  const filtered = places.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.location?.toLowerCase().includes(q.toLowerCase()) ||
    p.placeType?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.topRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Explore Directory</h1>
          <p className={styles.pageSubtitle}>
            {places.length} experiences listed · {places.filter(p => p._dynamic).length} dynamic assets
          </p>
        </div>
        <Link href="/admin/places/new" className={styles.btnPrimary}>
          <PlusCircle size={16} /> New Experience
        </Link>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.filterRow}>
          <div className={styles.searchBar}>
            <Search size={16} color="#4A5568" />
            <input
              placeholder="Search experiences, types, tags..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <button className={styles.btnSecondary} style={{ padding: '8px 12px' }}>
            <Filter size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 100, textAlign: 'center', color: '#64748B' }}>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              style={{ display: 'inline-block', marginBottom: 12 }}
            >
              <PlusCircle size={24} />
            </motion.div>
            <p>Scanning directory...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Experience</th>
                  <th>Type</th>
                  <th>Dist.</th>
                  <th>Budget</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((p, idx) => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <td>
                        <div className={styles.placeThumbCell}>
                          <div
                            className={styles.placeImg}
                            style={{ backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                          >
                            {p.video && <div style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', padding: 2, borderRadius: 4 }}><ExternalLink size={10} color="#fff" /></div>}
                          </div>
                          <div>
                            <p className={styles.placeCellName}>{p.name}</p>
                            <p className={styles.placeCellSub}><MapPin size={10} style={{ display: 'inline', marginRight: 4 }} />{p.location}</p>
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
                      <td>
                        {p._dynamic
                          ? <span className={`${styles.badge} ${styles.badgeNew}`}>Dynamic</span>
                          : <span className={`${styles.badge} ${styles.badgeOrange}`}>Core</span>
                        }
                      </td>
                      <td>
                        <div className={styles.actionRow}>
                          <Link href={`/admin/places/${p.id}/edit`} className={styles.btnSecondary} style={{ padding: '6px 10px' }}>
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => del(p.id, !!p._dynamic)}
                            className={styles.btnDanger}
                            title={p._dynamic ? 'Delete asset' : 'Core asset — deletion disabled'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className={styles.emptyState}>No experiences found for &quot;{q}&quot;</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
