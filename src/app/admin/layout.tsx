'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminLayout.module.css';
import { Home, MapPin, Activity, Settings, BarChart2, Calendar, MessageSquare, AlertTriangle, Ticket } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Saarthi</span>
            <span className={styles.logoBadge}>ADMIN</span>
          </div>
        </div>

        <nav className={styles.navMenu}>
          <div className={styles.navGroup}>
            <p className={styles.navLabel}>Core Modules</p>
            <Link 
              href="/admin" 
              className={`${styles.navItem} ${isActive('/admin') ? styles.navItemActive : ''}`}
            >
              <Home size={18} /> Dashboard
            </Link>
            <Link 
              href="/admin/places" 
              className={`${styles.navItem} ${isActive('/admin/places') ? styles.navItemActive : ''}`}
            >
              <MapPin size={18} /> Places
            </Link>
            <Link 
              href="/admin/ssd-tokens" 
              className={`${styles.navItem} ${isActive('/admin/ssd-tokens') ? styles.navItemActive : ''}`}
            >
              <Ticket size={18} /> SSD Tokens
            </Link>
            <Link 
              href="/admin/live" 
              className={`${styles.navItem} ${isActive('/admin/live') ? styles.navItemActive : ''}`}
            >
              <Activity size={18} /> Live Updates
            </Link>
          </div>

          <div className={styles.navGroup}>
            <p className={styles.navLabel}>Intelligence</p>
            <Link 
              href="/admin/live-alerts" 
              className={`${styles.navItem} ${isActive('/admin/live-alerts') ? styles.navItemActive : ''}`}
            >
              <AlertTriangle size={18} /> Alerts
            </Link>
            <Link 
              href="/admin/festivals" 
              className={`${styles.navItem} ${isActive('/admin/festivals') ? styles.navItemActive : ''}`}
            >
              <Calendar size={18} /> Festivals
            </Link>
          </div>

          <div className={styles.navGroup}>
            <p className={styles.navLabel}>Analysis</p>
            <Link 
              href="/admin/feedback" 
              className={`${styles.navItem} ${isActive('/admin/feedback') ? styles.navItemActive : ''}`}
            >
              <MessageSquare size={18} /> Feedback
            </Link>
            <Link 
              href="/admin/analytics" 
              className={`${styles.navItem} ${isActive('/admin/analytics') ? styles.navItemActive : ''}`}
            >
              <BarChart2 size={18} /> Analytics
            </Link>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link 
            href="/admin/settings" 
            className={`${styles.navItem} ${isActive('/admin/settings') ? styles.navItemActive : ''}`}
          >
            <Settings size={18} /> Settings
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <div className={styles.headerTitle}>
            <h2>Admin Portal</h2>
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
