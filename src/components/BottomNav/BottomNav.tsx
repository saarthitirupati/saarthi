'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Layers } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    home: 'Home',
    essentials: 'Essentials',
    explore: 'Explore'
  },
  te: {
    home: 'హోమ్',
    essentials: 'అవసరాలు',
    explore: 'అన్వేషించు'
  }
};

const getNavItems = (t: any) => [
  { name: t.home,       icon: Home,     href: '/' },
  { name: t.essentials, icon: Layers,   href: '/essentials', isFab: true },
  { name: t.explore,    icon: Compass,  href: '/explore' },
];

export default function BottomNav() {
  const pathname  = usePathname();
  const [mounted, setMounted] = useState(false);
  const lang = useLanguage();
  const t = TEXTS[lang];

  useEffect(() => { setMounted(true); }, []);

  const navItems = getNavItems(t);

  return (
    <nav className={styles.nav} suppressHydrationWarning>
      <div className={styles.container}>
        {navItems.map((item) => {
          const isActive = mounted && (
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))
          );

          if (item.isFab) {
            return (
              <Link key={item.name} href={item.href} className={styles.fabWrapper}>
                <div className={styles.fabRing} />
                <motion.div
                  className={styles.fabBtn}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <item.icon size={26} className={styles.fabIcon} />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {isActive && (
                <motion.div
                  layoutId="navPill"
                  className={styles.activeBg}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <div className={styles.navContent}>
                <item.icon
                  size={22}
                  className={isActive ? styles.activeIcon : styles.inactiveIcon}
                />
                <AnimatePresence mode="popLayout">
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, scale: 0.8 }}
                      animate={{ opacity: 1, width: 'auto', scale: 1 }}
                      exit={{ opacity: 0, width: 0, scale: 0.8 }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                      className={styles.activeLabel}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
