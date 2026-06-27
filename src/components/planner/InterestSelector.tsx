import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info } from 'lucide-react';
import { usePlanner } from '@/store/PlannerContext';
import styles from './InterestSelector.module.css';

const INTEREST_OPTIONS = [
  { id: 'spiritual', label: 'Spiritual',   icon: '🛕', preview: 'Temples, rituals, and sacred mantras' },
  { id: 'nature',    label: 'Nature',      icon: '🌿', preview: 'Waterfalls, hill views, and biological parks' },
  { id: 'water',     label: 'Water',       icon: '🌊', preview: 'Sacred theerthams and scenic falls' },
  { id: 'food',      label: 'Food',        icon: '🍛', preview: 'Local Andhra thalis, street food, and prasad' },
  { id: 'history',   label: 'History',     icon: '🏰', preview: 'Ancient forts, museums, and architecture' },
  { id: 'gems',      label: 'Hidden Gems', icon: '✨', preview: 'Quiet forest spots and lesser-known trails' },
  { id: 'adventure', label: 'Adventure',   icon: '⛰️', preview: 'Trekking paths and hillside climbs' },
  { id: 'photo',     label: 'Photography', icon: '📷', preview: 'Panoramic viewpoints and photogenic spots' },
];

interface InterestSelectorProps {
  onGenerate: () => void;
  onBack: () => void;
}

export default function InterestSelector({ onGenerate, onBack }: InterestSelectorProps) {
  const { state, toggleInterest } = usePlanner();
  const selectedCount = state.selectedInterests.length;

  const selectedPreviews = INTEREST_OPTIONS
    .filter(opt => state.selectedInterests.includes(opt.id))
    .map(opt => opt.preview);

  const unselectedPreviews = INTEREST_OPTIONS
    .filter(opt => !state.selectedInterests.includes(opt.id))
    .slice(0, 2)
    .map(opt => opt.label);

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className={styles.header}>
        <h2 className="text-h1">What interests you?</h2>
        <p className="text-body text-slate-600">Choose 1-5 categories for your journey.</p>
      </div>

      {/* Innovation #7: Interest Preview Feature */}
      <div className={styles.previewSection}>
        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <Info size={14} className="text-orange-500" />
            <span className={styles.previewTitle}>Your Experience Preview</span>
          </div>
          <div className={styles.previewContent}>
            {selectedCount > 0 ? (
              <ul className={styles.previewList}>
                {selectedPreviews.map((p, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.previewItem}
                  >
                    ✨ {p}
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyPreview}>Select interests to see what we'll plan for you.</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.chipGrid}>
        {INTEREST_OPTIONS.map((option) => {
          const isSelected = state.selectedInterests.includes(option.id);
          const isDisabled = !isSelected && selectedCount >= 5;

          return (
            <motion.div
              key={option.id}
              className={`${styles.interestCard} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
              onClick={() => {
                if (!isDisabled) toggleInterest(option.id);
              }}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
            >
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{option.icon}</span>
              </div>
              <h4 className={styles.cardLabel}>{option.label}</h4>
              
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className={styles.selectionIndicator}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <CheckCircle size={18} fill="#ff6b35" color="white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button className={styles.backButton} onClick={onBack}>Back</button>
        <button 
          className={`btn-primary ${styles.nextButton} ${selectedCount === 0 ? styles.disabled : ''}`}
          onClick={onGenerate}
          disabled={selectedCount === 0}
        >
          Generate My Plan →
        </button>
      </div>
    </motion.div>
  );
}
