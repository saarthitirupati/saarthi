'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Compass, Calendar, Award, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import styles from './SideMenu.module.css';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const menuItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Explore Places', icon: Compass, href: '/explore' },
    { name: 'Live Updates', icon: Award, href: '/live' },
    { name: 'Festivals', icon: Calendar, href: '/festivals' },
    { name: 'Alerts', icon: Info, href: '/alerts' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div 
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2>Menu</h2>
              <button className={styles.closeButton} onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <nav className={styles.nav}>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href} className={styles.navLink} onClick={onClose}>
                    <div className={styles.linkLeft}>
                      <item.icon size={20} className={styles.icon} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight size={16} className={styles.chevron} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className={styles.footer}>
              <div className={styles.spiritualTip}>
                <div className={styles.tipHeader}>
                  <Info size={16} />
                  <span>Darshan Tip</span>
                </div>
                <p>Morning slots are usually less crowded. Visit Kapila Theertham first for a traditional start.</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
