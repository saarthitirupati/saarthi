'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';
import { Home, MapPin, Activity, Settings, BarChart2, Calendar, MessageSquare, AlertTriangle, Ticket, Coins, TrendingUp, Menu, X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/saarthiadmin') return pathname === '/saarthiadmin';
    return pathname.startsWith(path);
  };

  const isLoginPage = pathname === '/saarthiadmin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Saarthi</span>
            <span className={styles.logoBadge}>ADMIN</span>
          </div>
          <button 
            className={styles.menuBtn} 
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close Sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.navMenu}>
          <div className={styles.navGroup}>
            <p className={styles.navLabel}>Core Modules</p>
            <Link 
              href="/saarthiadmin" 
              className={`${styles.navItem} ${isActive('/saarthiadmin') ? styles.navItemActive : ''}`}
            >
              <Home size={18} /> Dashboard
            </Link>
            <Link 
              href="/saarthiadmin/growth" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/growth') ? styles.navItemActive : ''}`}
            >
              <TrendingUp size={18} /> Growth Hub &amp; QRs
            </Link>
            <Link 
              href="/saarthiadmin/places" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/places') ? styles.navItemActive : ''}`}
            >
              <MapPin size={18} /> Places
            </Link>
            <Link 
              href="/saarthiadmin/ssd-tokens" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/ssd-tokens') ? styles.navItemActive : ''}`}
            >
              <Ticket size={18} /> SSD Tokens
            </Link>
            <Link 
              href="/saarthiadmin/live" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/live') ? styles.navItemActive : ''}`}
            >
              <Activity size={18} /> Live Updates
            </Link>
          </div>

          <div className={styles.navGroup}>
            <p className={styles.navLabel}>Intelligence</p>
            <Link 
              href="/saarthiadmin/decision-engine" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/decision-engine') ? styles.navItemActive : ''}`}
            >
              <Activity size={18} /> Decision Engine
            </Link>
            <Link 
              href="/saarthiadmin/fuel" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/fuel') ? styles.navItemActive : ''}`}
            >
              <Coins size={18} /> Fuel &amp; Transport Tariffs
            </Link>
            <Link 
              href="/saarthiadmin/live-alerts" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/live-alerts') ? styles.navItemActive : ''}`}
            >
              <AlertTriangle size={18} /> Alerts
            </Link>
            <Link 
              href="/saarthiadmin/festivals" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/festivals') ? styles.navItemActive : ''}`}
            >
              <Calendar size={18} /> Festivals
            </Link>
          </div>

          <div className={styles.navGroup}>
            <p className={styles.navLabel}>Analysis</p>
            <Link 
              href="/saarthiadmin/feedback" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/feedback') ? styles.navItemActive : ''}`}
            >
              <MessageSquare size={18} /> Feedback
            </Link>
            <Link 
              href="/saarthiadmin/analytics" 
              className={`${styles.navItem} ${isActive('/saarthiadmin/analytics') ? styles.navItemActive : ''}`}
            >
              <BarChart2 size={18} /> Analytics
            </Link>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link 
            href="/saarthiadmin/settings" 
            className={`${styles.navItem} ${isActive('/saarthiadmin/settings') ? styles.navItemActive : ''}`}
          >
            <Settings size={18} /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button 
              className={styles.menuBtn} 
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle Sidebar Menu"
            >
              <Menu size={22} />
            </button>
            <div className={styles.headerTitle}>
              <h2>Admin Portal</h2>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.userAvatar}>F</div>
          </div>
        </header>
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}



