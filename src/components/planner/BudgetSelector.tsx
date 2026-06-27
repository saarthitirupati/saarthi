'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePlanner, BudgetTier } from '@/store/PlannerContext';
import styles from './BudgetSelector.module.css';

const BUDGET_OPTIONS: { id: BudgetTier; title: string; range: string; desc: string; icon: string }[] = [
  { 
    id: 'budget', 
    title: 'Budget', 
    range: '₹0 - ₹500', 
    desc: 'Great local experiences & public transport',
    icon: '💰'
  },
  { 
    id: 'medium', 
    title: 'Medium', 
    range: '₹500 - ₹2000', 
    desc: 'Balanced quality with comfortable travel',
    icon: '💼'
  },
  { 
    id: 'premium', 
    title: 'Premium', 
    range: '₹2000+', 
    desc: 'Luxury touches and exclusive access',
    icon: '✨'
  },
];

interface BudgetSelectorProps {
  onNext: () => void;
  onBack: () => void;
}

export default function BudgetSelector({ onNext, onBack }: BudgetSelectorProps) {
  const { state, setBudgetTier } = usePlanner();

  const handleSelect = (tier: BudgetTier) => {
    setBudgetTier(tier);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className={styles.header}>
        <h2 className="section-header">What's your budget?</h2>
        <p className="body-text">Per person estimate to tailor your experience.</p>
      </div>

      <div className={styles.optionsList}>
        {BUDGET_OPTIONS.map((option) => (
          <motion.div
            key={option.id}
            className={`${styles.budgetCard} ${state.budgetTier === option.id ? styles.selected : ''}`}
            onClick={() => handleSelect(option.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={styles.icon}>{option.icon}</div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h4 className={styles.title}>{option.title}</h4>
                <span className={styles.range}>{option.range}</span>
              </div>
              <p className={styles.desc}>{option.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={onBack}>Back</button>
        <button 
          className={`button-text ${styles.nextButton} ${!state.budgetTier ? styles.disabled : ''}`}
          onClick={onNext}
          disabled={!state.budgetTier}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
