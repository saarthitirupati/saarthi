'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, ClipboardCheck, Map, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Explore', icon: Compass, href: '/explore' },
    { name: 'Essentials', icon: ClipboardCheck, href: '/essentials' },
    { name: 'Journey', icon: Map, href: '/saved' },
    { name: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {navItems.map((item) => {
          const isActive = mounted && pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={styles.navLink}>
              <div className={styles.iconWrapper}>
                {isActive && (
                  <motion.div 
                    layoutId="activePill"
                    className={styles.activePill}
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                  />
                )}
                <item.icon size={22} className={isActive ? styles.activeIcon : styles.inactiveIcon} style={{ zIndex: 2 }} />
              </div>
              <span className={isActive ? styles.activeLabel : styles.inactiveLabel}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
