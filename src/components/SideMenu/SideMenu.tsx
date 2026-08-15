'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Compass, Calendar, Award, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import styles from './SideMenu.module.css';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    menu: 'Menu',
    home: 'Home',
    explore: 'Explore Places',
    tripEstimator: 'Trip Estimator & Fares',
    smartPlanner: 'Smart Trip Planner',
    liveUpdates: 'Live Tirumala Updates',
    festivals: 'Festivals & Events',
    liveAlerts: 'Live Alerts & Advisories',
    adminDashboard: 'Admin Dashboard',
    darshanTip: 'Darshan Tip',
    darshanTipDesc: 'Morning slots are usually less crowded. Visit Kapila Theertham first for a traditional start.'
  },
  te: {
    menu: 'మెనూ',
    home: 'హోమ్',
    explore: 'ప్రదేశాలు అన్వేషించండి',
    tripEstimator: 'యాత్ర అంచనా & ఛార్జీలు',
    smartPlanner: 'స్మార్ట్ యాత్ర ప్లానర్',
    liveUpdates: 'తిరుమల లైవ్ అప్డేట్స్',
    festivals: 'పండుగలు & ఈవెంట్స్',
    liveAlerts: 'లైవ్ అలర్ట్స్ & సూచనలు',
    adminDashboard: 'అడ్మిన్ డాష్బోర్డ్',
    darshanTip: 'దర్శన సూచన',
    darshanTipDesc: 'ఉదయపు స్లాట్లలో సాధారణంగా తక్కువ రద్దీ ఉంటుంది. సాంప్రదాయ ప్రారంభం కోసం ముందు కపిల తీర్థం సందర్శించండి.'
  }
};

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const lang = useLanguage();
  const t = TEXTS[lang];

  const menuItems = [
    { name: t.home, icon: Home, href: '/' },
    { name: t.explore, icon: Compass, href: '/explore' },
    { name: t.tripEstimator, icon: Compass, href: '/trip-estimator' },
    { name: t.smartPlanner, icon: Compass, href: '/planner' },
    { name: t.liveUpdates, icon: Award, href: '/live' },
    { name: t.festivals, icon: Calendar, href: '/festivals' },
    { name: t.liveAlerts, icon: Info, href: '/alerts' },
    { name: t.adminDashboard, icon: Award, href: '/saarthiadmin' },
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
              <h2>{t.menu}</h2>
              <button className={styles.closeButton} onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <nav className={styles.nav}>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
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
                  <span>{t.darshanTip}</span>
                </div>
                <p>{t.darshanTipDesc}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


