'use client';

import { motion } from 'framer-motion';

export default function Logo({ size = 100, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.img
      src="/assets/logo.png"
      alt="Saarthi Brand Logo"
      width={size}
      height={size}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        objectFit: 'contain',
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  );
}
