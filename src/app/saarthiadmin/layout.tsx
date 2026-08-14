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

  const getPageTitle = (path: string) => {
    if (path === '/saarthiadmin') return 'Operational Dashboard';
    if (path.startsWith('/saarthiadmin/growth')) return 'Growth Hub & QR Campaigns';
    if (path.startsWith('/saarthiadmin/places')) return 'Places Directory & Editor';
    if (path.startsWith('/saarthiadmin/ssd-tokens')) return 'SSD Token Release Control';
    if (path.startsWith('/saarthiadmin/live-alerts')) return 'Live Pilgrim Advisories';
    if (path.startsWith('/saarthiadmin/live')) return 'Live Status Operations';
    if (path.startsWith('/saarthiadmin/decision-engine')) return 'Decision Engine Simulator';
    if (path.startsWith('/saarthiadmin/fuel')) return 'Fuel & Transport Tariffs';
    if (path.startsWith('/saarthiadmin/festivals')) return 'Festivals & Sacred Calendar';
    if (path.startsWith('/saarthiadmin/feedback')) return 'Pilgrim Feedback & Reports';
    if (path.startsWith('/saarthiadmin/analytics')) return 'Telemetry & Analytics';
    if (path.startsWith('/saarthiadmin/settings')) return 'System & Database Settings';
    return 'Admin Control Panel';
  };

  const isActive = (path: string) => {
    if (path === '/saarthiadmin') return pathname === '/saarthiadmin';
    return pathname.startsWith(path);
  };

  const isLoginPage = pathname === '/saarthiadmin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
      window.location.href = '/saarthiadmin/login';
    } catch (e) {
      console.error(e);
    }
  };

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
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{getPageTitle(pathname)}</h2>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Link 
              href="/" 
              target="_blank"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#0E6B72',
                backgroundColor: '#F0FDFA',
                border: '1px solid #CCFBF1',
                padding: '6px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View Public App ↗
            </Link>
            <button
              onClick={handleLogout}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#DC2626',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </header>
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}



