'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  MapPin, 
  Bookmark, 
  Clock, 
  Trash2, 
  ExternalLink,
  Sliders,
  RotateCcw
} from 'lucide-react';
import styles from './Profile.module.css';
import { useTrip } from '@/components/TripContext';
import { getMLWeights, saveMLWeights, resetMLWeights, MLWeights } from '@/lib/recommendation-engine';

export default function ProfilePage() {
  const router = useRouter();
  const { 
    savedPlans, 
    visitedPlaces, 
    removePlan 
  } = useTrip();

  const [weights, setWeights] = useState<MLWeights | null>(null);

  useEffect(() => {
    setWeights(getMLWeights());
  }, []);

  const handleViewPlan = (type: string) => {
    router.push(`/itinerary/${type}`);
  };

  const handleWeightChange = (category: keyof MLWeights['interests'], value: number) => {
    if (!weights) return;
    const newWeights = {
      ...weights,
      interests: {
        ...weights.interests,
        [category]: value
      }
    };
    setWeights(newWeights);
    saveMLWeights(newWeights);
  };

  const handleParamWeightChange = (key: 'rating' | 'mustVisit' | 'duration', value: number) => {
    if (!weights) return;
    const newWeights = {
      ...weights,
      [key]: value
    };
    setWeights(newWeights);
    saveMLWeights(newWeights);
  };

  const handleReset = () => {
    resetMLWeights();
    setWeights(getMLWeights());
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

      {weights && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <Sliders size={20} />
            AI Recommendation Engine
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: -10, marginBottom: 16 }}>
            Saarthi trains weights automatically based on your saved/visited history. Fine-tune them below to shape your recommendations.
          </p>

          <div className={styles.weightsCard}>
            <div className={styles.weightsHeader}>
              <span className={styles.weightsTitle}>Interest Preferences</span>
              <span className={styles.trainingBadge}>
                🧠 Model Trained {weights.trainingCount || 0}x
              </span>
            </div>

            <div className={styles.weightsGrid}>
              {Object.keys(weights.interests).map((interestKey) => {
                const val = weights.interests[interestKey as keyof MLWeights['interests']] || 1.0;
                return (
                  <div key={interestKey} className={styles.weightRow}>
                    <div className={styles.weightLabelRow}>
                      <span>{interestKey}</span>
                      <span className={styles.weightVal}>{val.toFixed(2)}</span>
                    </div>
                    <div className={styles.sliderContainer}>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="5.0" 
                        step="0.1"
                        value={val}
                        onChange={(e) => handleWeightChange(interestKey as keyof MLWeights['interests'], parseFloat(e.target.value))}
                        className={styles.slider}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.weightsHeader} style={{ marginTop: 24 }}>
              <span className={styles.weightsTitle}>General Scoring Modifiers</span>
            </div>

            <div className={styles.weightsGrid}>
              <div className={styles.weightRow}>
                <div className={styles.weightLabelRow}>
                  <span>Rating Importance</span>
                  <span className={styles.weightVal}>{weights.rating.toFixed(2)}</span>
                </div>
                <div className={styles.sliderContainer}>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="5.0" 
                    step="0.1"
                    value={weights.rating}
                    onChange={(e) => handleParamWeightChange('rating', parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                </div>
              </div>

              <div className={styles.weightRow}>
                <div className={styles.weightLabelRow}>
                  <span>Must-Visit Priority</span>
                  <span className={styles.weightVal}>{weights.mustVisit.toFixed(2)}</span>
                </div>
                <div className={styles.sliderContainer}>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="5.0" 
                    step="0.1"
                    value={weights.mustVisit}
                    onChange={(e) => handleParamWeightChange('mustVisit', parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                </div>
              </div>

              <div className={styles.weightRow}>
                <div className={styles.weightLabelRow}>
                  <span>Optimal Duration Fit</span>
                  <span className={styles.weightVal}>{weights.duration.toFixed(2)}</span>
                </div>
                <div className={styles.sliderContainer}>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="5.0" 
                    step="0.1"
                    value={weights.duration}
                    onChange={(e) => handleParamWeightChange('duration', parseFloat(e.target.value))}
                    className={styles.slider}
                  />
                </div>
              </div>
            </div>

            <button onClick={handleReset} className={styles.resetBtn}>
              <RotateCcw size={14} />
              Reset to AI Defaults
            </button>
          </div>
        </section>
      )}

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
