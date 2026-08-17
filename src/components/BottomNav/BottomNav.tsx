'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
              <div key={item.name} className={styles.slot}>
                <Link href={item.href} className={styles.fabWrapper}>
                  <motion.div 
                    className={styles.fabRing}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.75, 0.25, 0.75]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.8,
                      ease: 'easeInOut'
                    }}
                  />
                  <motion.div
                    className={styles.fabBtn}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.88, rotate: -10 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  >
                    <motion.div
                      animate={isActive ? { rotate: [0, 180, 360], scale: [1, 1.15, 1] } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <item.icon size={23} className={styles.fabIcon} />
                    </motion.div>
                  </motion.div>
                </Link>
              </div>
            );
          }

          return (
            <div key={item.name} className={styles.slot}>
              <Link 
                href={item.href} 
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                <motion.div
                  className={styles.navContent}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <motion.div
                    animate={{ 
                      scale: isActive ? 1.08 : 1,
                      y: isActive ? -1 : 0
                    }}
                    transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <item.icon
                      size={20}
                      className={isActive ? styles.activeIcon : styles.inactiveIcon}
                    />
                  </motion.div>
                  {isActive && (
                    <span className={styles.activeLabel}>
                      {item.name}
                    </span>
                  )}
                </motion.div>
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
