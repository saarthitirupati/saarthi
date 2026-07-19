'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, MapPin, PlusCircle, BarChart3, LogOut, Map, Database, Activity,
  Menu, X, BookOpen, HelpCircle, Calendar, Bookmark, Zap, Coins, Send, Cpu, AlertCircle
} from 'lucide-react';
import styles from './admin.module.css';

const NAV = [
  { href: '/admin',             icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/places',      icon: MapPin,          label: 'Places' },
  { href: '/admin/live-status', icon: Activity,        label: 'Live Status' },
  { href: '/admin/live-alerts', icon: AlertCircle,     label: 'Alerts' },
  { href: '/admin/festivals',   icon: Calendar,        label: 'Festivals' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRole, setActiveRole] = useState('CEO');

  useEffect(() => {
    const saved = localStorage.getItem('saarthi_admin_role');
    if (saved) {
      setActiveRole(saved);
    }
  }, []);

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
          {/* Executive Role Switcher Dropdown */}
          <div style={{ marginBottom: 12, padding: '0 4px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
              Select Active Role
            </label>
            <select
              value={activeRole}
              onChange={(e) => {
                const val = e.target.value;
                setActiveRole(val);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('saarthi_admin_role', val);
                }
              }}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '6px 8px',
                color: '#F1F5F9',
                fontSize: '12px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="CEO" style={{ background: '#0F172A', color: '#F1F5F9' }}>Chief Executive Officer (CEO)</option>
              <option value="Chairman" style={{ background: '#0F172A', color: '#F1F5F9' }}>Chairman of the Board</option>
              <option value="President" style={{ background: '#0F172A', color: '#F1F5F9' }}>President</option>
              <option value="VicePresident" style={{ background: '#0F172A', color: '#F1F5F9' }}>Vice President (VP)</option>
              <option value="Founder" style={{ background: '#0F172A', color: '#F1F5F9' }}>Founder & Managing Director</option>
              <option value="HRAdmin" style={{ background: '#0F172A', color: '#F1F5F9' }}>HR & Administration Head</option>
            </select>
          </div>

          {/* Dynamic Profile Badge */}
          {(() => {
            const rolesMap: Record<string, { name: string; title: string; email: string; avatar: string }> = {
              CEO: { name: 'Sunil Thatra', title: 'CEO & Founder', email: 'sunil@jeevapath.in', avatar: 'ST' },
              Chairman: { name: 'Dr. R. Prasad', title: 'Chairman', email: 'prasad@jeevapath.in', avatar: 'RP' },
              President: { name: 'M. S. Moorthy', title: 'President', email: 'moorthy@jeevapath.in', avatar: 'MM' },
              VicePresident: { name: 'A. K. Shastri', title: 'Vice President', email: 'shastri@jeevapath.in', avatar: 'AS' },
              Founder: { name: 'K. R. Murthy', title: 'Co-Founder & MD', email: 'murthy@jeevapath.in', avatar: 'KM' },
              HRAdmin: { name: 'V. S. Latha', title: 'HR & Admin Head', email: 'latha@jeevapath.in', avatar: 'VL' }
            };
            const activeProfile = rolesMap[activeRole] || rolesMap.CEO;
            return (
              <div className={styles.adminBadge}>
                <div className={styles.adminAvatar}>{activeProfile.avatar}</div>
                <div>
                  <p className={styles.adminName}>{activeProfile.name}</p>
                  <p className={styles.adminEmail} style={{ color: '#E9801D', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', marginTop: '1px' }}>
                    {activeProfile.title}
                  </p>
                  <p className={styles.adminEmail} style={{ opacity: 0.8 }}>{activeProfile.email}</p>
                </div>
              </div>
            );
          })()}

          <button onClick={logout} className={styles.logoutBtn} style={{ marginTop: 8 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
