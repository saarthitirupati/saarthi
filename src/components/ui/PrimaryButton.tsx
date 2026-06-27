'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps extends HTMLMotionProps<'button'> {
  title: string;
  loading?: boolean;
}

export default function PrimaryButton({ 
  title, 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}: PrimaryButtonProps) {
  return (
    <motion.button
      className={`${styles.container} ${className} ${(disabled || loading) ? styles.disabled : ''}`}
      disabled={disabled || loading}
      whileHover={{ scale: (disabled || loading) ? 1 : 1.02 }}
      whileTap={{ scale: (disabled || loading) ? 1 : 0.98 }}
      {...props}
    >
      <div className={styles.gradient}>
        <span className={styles.text}>
          {loading ? 'Processing...' : title}
        </span>
      </div>
    </motion.button>
  );
}
