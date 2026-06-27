'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePlanner } from '@/store/PlannerContext';
import styles from './TimeSelector.module.css';

const TIME_OPTIONS = [
  { label: '1 Hour', value: 60 },
  { label: '2 Hours', value: 120 },
  { label: '3 Hours', value: 180 },
  { label: 'Half Day', value: 360 },
  { label: 'Full Day', value: 720 },
  { label: '2 Days', value: 1440 },
];

interface TimeSelectorProps {
  onNext: () => void;
}

export default function TimeSelector({ onNext }: TimeSelectorProps) {
  const { state, setTimeAvailable } = usePlanner();

  const handleSelect = (value: number) => {
    setTimeAvailable(value);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className={styles.header}>
        <h2 className="section-header">How much time do you have today?</h2>
        <p className="body-text">Select your available time to get the best recommendations.</p>
      </div>

      <div className={styles.optionsGrid}>
        {TIME_OPTIONS.map((option) => (
          <motion.div
            key={option.value}
            className={`${styles.timeCard} ${state.timeAvailable === option.value ? styles.selected : ''}`}
            onClick={() => handleSelect(option.value)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={styles.timeLabel}>{option.label}</span>
          </motion.div>
        ))}
      </div>

      <div className={styles.actions}>
        <button 
          className={`button-text ${styles.nextButton} ${!state.timeAvailable ? styles.disabled : ''}`}
          onClick={onNext}
          disabled={!state.timeAvailable}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
