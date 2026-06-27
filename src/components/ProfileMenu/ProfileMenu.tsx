'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShieldCheck, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';
import styles from './ProfileMenu.module.css';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileMenu({ isOpen, onClose }: ProfileMenuProps) {
  const profileItems = [
    { name: 'My Saved Places', icon: Heart },
    { name: 'My Itineraries', icon: Calendar },
    { name: 'Verified Contributor', icon: ShieldCheck, isBadge: true },
    { name: 'Account Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div 
            className={styles.overlay}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  <User size={32} />
                </div>
                <div>
                  <h3>Priya Sharma</h3>
                  <span className={styles.userStatus}>Verified Tourist</span>
                </div>
              </div>
              <button className={styles.closeButton} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.menuList}>
              {profileItems.map((item) => (
                <button key={item.name} className={styles.menuItem}>
                  <div className={styles.itemLeft}>
                    <item.icon size={18} className={item.isBadge ? styles.badgeIcon : styles.icon} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={14} className={styles.chevron} />
                </button>
              ))}
            </div>

            <button className={styles.logoutButton}>
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Simple Calendar icon for the menuItems list
function Calendar({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
