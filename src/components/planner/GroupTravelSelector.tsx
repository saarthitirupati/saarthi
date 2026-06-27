'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePlanner, GroupType, TravelMode } from '@/store/PlannerContext';
import styles from './GroupTravelSelector.module.css';

const GROUP_OPTIONS: { id: GroupType; label: string; icon: string }[] = [
  { id: 'solo',    label: 'Solo',    icon: '🧑' },
  { id: 'couple',  label: 'Couple',  icon: '👫' },
  { id: 'family',  label: 'Family',  icon: '👨‍👩‍👧' },
  { id: 'friends', label: 'Friends', icon: '👯' },
  { id: 'elderly', label: 'Elderly', icon: '🧓' },
];

const TRAVEL_OPTIONS: { id: TravelMode; label: string; icon: string }[] = [
  { id: 'walk',   label: 'Walk',    icon: '🚶' },
  { id: 'bike',   label: 'Bike',    icon: '🏍️' },
  { id: 'car',    label: 'Car',     icon: '🚗' },
  { id: 'cab',    label: 'Cab',     icon: '🚕' },
  { id: 'public', label: 'Transit', icon: '🚌' },
];

interface GroupTravelSelectorProps {
  onGenerate: () => void;
  onBack: () => void;
}

export default function GroupTravelSelector({ onGenerate, onBack }: GroupTravelSelectorProps) {
  const { state, setGroupType, setTravelMode } = usePlanner() as any;
  const canGenerate = !!state.groupType && !!state.travelMode;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.28 }}
    >
      <div className={styles.header}>
        <h2 className="section-header">Who's joining & how?</h2>
        <p className="body-text">We'll tailor routes and stops to your group.</p>
      </div>

      <div className={styles.section}>
        <label className={styles.sectionLabel}>Your group</label>
        <div className={styles.chipRow}>
          {GROUP_OPTIONS.map((opt) => (
            <motion.button
              key={opt.id}
              className={`${styles.chip} ${state.groupType === opt.id ? styles.chipActive : ''}`}
              onClick={() => setGroupType(opt.id)}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.14 }}
            >
              <span className={styles.chipIcon}>{opt.icon}</span>
              <span>{opt.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.sectionLabel}>Getting around</label>
        <div className={styles.chipRow}>
          {TRAVEL_OPTIONS.map((opt) => (
            <motion.button
              key={opt.id}
              className={`${styles.chip} ${state.travelMode === opt.id ? styles.chipActive : ''}`}
              onClick={() => setTravelMode(opt.id)}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.14 }}
            >
              <span className={styles.chipIcon}>{opt.icon}</span>
              <span>{opt.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={onBack}>Back</button>
        <motion.button
          className={`${styles.generateButton} ${!canGenerate ? styles.disabled : ''}`}
          onClick={canGenerate ? onGenerate : undefined}
          disabled={!canGenerate}
          whileHover={canGenerate ? { scale: 1.02 } : {}}
          whileTap={canGenerate ? { scale: 0.97 } : {}}
        >
          ✨ Build My Plan
        </motion.button>
      </div>
    </motion.div>
  );
}
