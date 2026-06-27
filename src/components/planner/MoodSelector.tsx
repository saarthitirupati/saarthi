'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePlanner, MoodType } from '@/store/PlannerContext';
import styles from './MoodSelector.module.css';

const MOOD_OPTIONS: { id: MoodType; label: string; icon: string; desc: string; color: string }[] = [
  { id: 'peaceful',    label: 'Peaceful',    icon: '🌿', desc: 'Calm, unhurried, serene spots',   color: '#2F6144' },
  { id: 'adventurous', label: 'Adventurous', icon: '⛰️', desc: 'Thrilling, offbeat, active',       color: '#E9801D' },
  { id: 'luxury',     label: 'Luxury',      icon: '✨', desc: 'Premium, high-end experiences',    color: '#D0A73D' },
  { id: 'spiritual',   label: 'Spiritual',   icon: '🛕', desc: 'Sacred, mindful, meaningful',      color: '#A8831F' },
  { id: 'explore',     label: 'Explore',     icon: '🔭', desc: 'Hidden gems, curiosity-driven',    color: '#0E6B72' },
  { id: 'fun',         label: 'Fun',         icon: '🎡', desc: 'Family, playful, energetic',        color: '#3C8FB6' },
  { id: 'romantic',    label: 'Romantic',    icon: '🌅', desc: 'Sunsets, cafés, scenic views',     color: '#D95F31' },
  { id: 'learning',    label: 'Learning',    icon: '📜', desc: 'History, heritage, stories',      color: '#8C7355' },
];

interface MoodSelectorProps {
  onNext: () => void;
  onBack: () => void;
}

export default function MoodSelector({ onNext, onBack }: MoodSelectorProps) {
  const { state, setMood } = usePlanner() as any;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.28 }}
    >
      <div className={styles.header}>
        <h2 className="section-header">What's your mood?</h2>
        <p className="body-text">This shapes the kind of experience we craft for you.</p>
      </div>

      <div className={styles.moodGrid}>
        {MOOD_OPTIONS.map((option) => {
          const isSelected = state.mood === option.id;
          return (
            <motion.div
              key={option.id}
              className={`${styles.moodCard} ${isSelected ? styles.selected : ''}`}
              style={isSelected ? { borderColor: option.color, background: `${option.color}12` } : {}}
              onClick={() => setMood(option.id)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              <span className={styles.icon} style={isSelected ? { fontSize: '28px' } : {}}>{option.icon}</span>
              <div className={styles.moodText}>
                <span className={styles.label} style={isSelected ? { color: option.color } : {}}>{option.label}</span>
                <span className={styles.desc}>{option.desc}</span>
              </div>
              {isSelected && (
                <motion.div
                  className={styles.checkDot}
                  style={{ background: option.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={onBack}>Back</button>
        <button
          className={`${styles.nextButton} ${!state.mood ? styles.disabled : ''}`}
          onClick={onNext}
          disabled={!state.mood}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
