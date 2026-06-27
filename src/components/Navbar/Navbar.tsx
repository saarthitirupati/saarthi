'use client';

import Logo from '@/components/Logo/Logo';
import Link from 'next/link';
import { Menu, User } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ 
  onMenuToggle, 
  onProfileToggle 
}: { 
  onMenuToggle: () => void; 
  onProfileToggle: () => void;
}) {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        <Logo size={32} />
        <div className={styles.brandText}>
          <span className={styles.appName}>Saarthi</span>
          <span className={styles.tagline}>Spiritual Place Guide</span>
        </div>
      </Link>
      
      <div className={styles.actions}>
        <button className={styles.iconButton} onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
      </div>
    </nav>
  );
}
