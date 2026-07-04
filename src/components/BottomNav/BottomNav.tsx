'use client';

import { motion } from 'framer-motion';
import { Home, Compass, Bookmark, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Explore', icon: Compass, href: '/explore' },
    { name: 'Saved', icon: Bookmark, href: '/saved' },
    { name: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
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
