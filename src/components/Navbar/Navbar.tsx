'use client';

import Logo from '@/components/Logo/Logo';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ 
  onMenuToggle, 
  onProfileToggle: _onProfileToggle 
}: { 
  onMenuToggle?: () => void; 
  onProfileToggle?: () => void;
}) {
  const handleMenuClick = () => {
    if (onMenuToggle) {
      onMenuToggle();
    } else {
      window.dispatchEvent(new CustomEvent('toggle-side-menu'));
    }
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        <Logo size={46} />
        <div className={styles.brandText}>
          <span className={`${styles.appName} notranslate`}>Saarthi</span>
          <span className={styles.tagline}>Spiritual Place Guide</span>
        </div>
      </Link>
      
      <div className={styles.actions}>
        <button className={styles.iconButton} onClick={handleMenuClick} aria-label="Toggle menu">
          <Menu size={26} />
        </button>
      </div>
    </nav>
  );
}
