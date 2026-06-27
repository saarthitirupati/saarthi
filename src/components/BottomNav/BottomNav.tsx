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
              <div className={`${styles.iconWrapper} ${isActive ? styles.active : ''}`}>
                <item.icon size={24} />
                {isActive && (
                  <motion.div 
                    layoutId="navTab"
                    className={styles.activeIndicator}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              <span className={isActive ? styles.activeLabel : ''}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
