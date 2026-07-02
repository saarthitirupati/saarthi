'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  MapPin, 
  Bookmark, 
  Clock, 
  Trash2, 
  ExternalLink
} from 'lucide-react';
import styles from './Profile.module.css';
import { useTrip } from '@/components/TripContext';

export default function ProfilePage() {
  const router = useRouter();
  const { 
    savedPlans, 
    visitedPlaces, 
    removePlan 
  } = useTrip();

  const handleViewPlan = (type: string) => {
    router.push(`/itinerary/${type}`);
  };

  return (
    <main className={styles.container}>
      <button onClick={() => router.push('/')} className={styles.backBtn}>
        <ChevronLeft size={24} />
      </button>

      <header className={styles.header}>
        <h1 className={styles.title}>Your Profile</h1>
        <p className={styles.subtitle}>Manage your journeys and preferences.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statVal}>{savedPlans.length}</span>
          <span className={styles.statLabel}>Plans Saved</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statVal}>{visitedPlaces.length}</span>
          <span className={styles.statLabel}>Places Visited</span>
        </div>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Bookmark size={20} />
          Saved Journeys
        </h3>
        <div className={styles.planList}>
          {savedPlans.length > 0 ? (
            savedPlans.map((plan, index) => (
              <motion.div 
                key={plan.id}
                className={styles.planCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.planInfo}>
                  <h4>{plan.emoji} {plan.title}</h4>
                  <div className={styles.planMeta}>
                    <span><Clock size={12} /> {Math.floor(plan.totalMins / 60)}h {plan.totalMins % 60}m</span>
                    <span><MapPin size={12} /> {plan.stops.length} Stops</span>
                  </div>
                </div>
                <div className={styles.planActions}>
                  <button 
                    onClick={() => handleViewPlan(plan.type)} 
                    className={styles.actionBtn}
                    title="View Plan"
                  >
                    <ExternalLink size={18} />
                  </button>
                  <button 
                    onClick={() => removePlan(plan.id)} 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <Bookmark size={40} color="var(--color-text-dim)" />
              <p>You haven&apos;t saved any plans yet.</p>
              <button 
                onClick={() => router.push('/planner')}
                style={{ marginTop: 20, color: 'var(--color-teal-500)', fontWeight: 600, background: 'none', border: 'none' }}
              >
                Start Planning →
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
