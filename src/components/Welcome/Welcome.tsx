'use client';

import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, MapPin, HandHeart, Brain, Landmark } from 'lucide-react';
import styles from './Welcome.module.css';

interface WelcomeProps {
  onSelectDays: (days: number) => void;
}

export default function Welcome({ onSelectDays }: WelcomeProps) {
  const options = [
    { days: 1, label: '1 Day',  sub: 'The Essential Circuit',       Icon: HandHeart, color: '#B45309' },
    { days: 2, label: '2 Days', sub: 'Deep Spiritual Discovery',    Icon: Brain,     color: '#0E6B72' },
    { days: 3, label: '3 Days', sub: 'The Complete Journey',        Icon: Landmark,  color: '#7C3AED' },
  ];

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.content}>
        <motion.div 
          className={styles.locationTag}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MapPin size={14} />
          <span>Currently: Tirumala Hills, Tirupati</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Design Your <br />
          <span>Spiritual Journey</span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Select how many days you&apos;ll be spending in the spiritual heart of India. We&apos;ll curate the perfect experience for you.
        </motion.p>

        <div className={styles.optionsList}>
          {options.map((opt, index) => (
            <motion.button
              key={opt.days}
              className={styles.optionCard}
              onClick={() => onSelectDays(opt.days)}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + (index * 0.1) }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.optIcon}><opt.Icon size={20} color={opt.color} /></div>
              <div className={styles.optText}>
                <h3>{opt.label}</h3>
                <p>{opt.sub}</p>
              </div>
              <ChevronRight size={20} className={styles.chevron} />
            </motion.button>
          ))}
        </div>

        <motion.div 
          className={styles.trustFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Sparkles size={16} color="var(--primary)" />
          <span>Personalized by your Spiritual Travel Assistant</span>
        </motion.div>
      </div>

      <div className={styles.bgDecor}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>
    </motion.div>
  );
}
