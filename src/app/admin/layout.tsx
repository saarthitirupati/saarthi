'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, MapPin, PlusCircle, BarChart3, LogOut, Map, Database, Activity,
  Menu, X, BookOpen, HelpCircle, Calendar, Bookmark, Zap
} from 'lucide-react';
import styles from './admin.module.css';

const NAV = [
  { href: '/admin',         icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/places',  icon: MapPin,           label: 'All Places' },
  { href: '/admin/stories', icon: BookOpen,         label: 'Stories' },
  { href: '/admin/quizzes', icon: HelpCircle,       label: 'Quizzes' },
  { href: '/admin/festivals', icon: Calendar,       label: 'Festivals' },
  { href: '/admin/encyclopedia', icon: Bookmark,    label: 'Encyclopedia' },
  { href: '/admin/live-status', icon: Activity,     label: 'Live Status' },
  { href: '/admin/traffic', icon: BarChart3,        label: 'Traffic' },
  { href: '/admin/telemetry', icon: Zap,            label: 'Telemetry' },
  { href: '/studio',        icon: Database,         label: 'Sanity Studio' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className={styles.shell}>
      {/* Mobile Top Header */}
      <header className={styles.mobileHeader}>
        <button onClick={() => setSidebarOpen(true)} className={styles.menuToggle} aria-label="Open Sidebar Menu">
          <Menu size={20} />
        </button>
        <div className={styles.mobileBrand}>
          <Map size={18} className={styles.brandIcon} />
          <span className={styles.mobileBrandName}>Saarthi</span>
        </div>
      </header>

      {/* Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Map size={22} className={styles.brandIcon} />
            <div>
              <span className={styles.brandName}>Saarthi</span>
              <span className={styles.brandSub}>Admin Panel</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className={styles.closeSidebarBtn} aria-label="Close Sidebar Menu">
            <X size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navItem} ${pathname === href ? styles.navActive : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminBadge}>
            <div className={styles.adminAvatar}>A</div>
            <div>
              <p className={styles.adminName}>Admin</p>
              <p className={styles.adminEmail}>admin@jeevapath.in</p>
            </div>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
