import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage, setAppLanguage } from '@/lib/useLanguage';
import { 
  Sun, Bell, Navigation, 
  Home, Layers, Compass, Calendar, Languages
} from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import { useTrip } from '@/components/TripContext';
import styles from './DesktopHeader.module.css';
import { useAlerts } from '@/hooks/useAlerts';
import { LocationPickerModal, LocationPill } from '@/components/common/LocationPickerModal';

interface DesktopHeaderProps {
  weather?: string;
  temperature?: string;
}

export function DesktopHeader({ weather, temperature }: DesktopHeaderProps) {
  const displayWeather = weather && temperature ? `${temperature} · ${weather}` : '☀ 24°C · Sunny';
  const { activeAlertsCount } = useAlerts();
  const { locationName } = useTrip();
  const pathname = usePathname();
  const lang = useLanguage();

  const [selectedLocation, setSelectedLocation] = useState<string>(locationName || 'Tirupati');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saarthi_user_region');
      if (saved) setSelectedLocation(saved);
      else if (locationName) setSelectedLocation(locationName);
    }
  }, [locationName]);

  const navLinks = [
    { href: '/', label: lang === 'te' ? 'హోమ్' : 'Home', icon: Home },
    { href: '/route', label: lang === 'te' ? 'యాత్రా మార్గం' : 'Live Route & GPS', icon: Navigation },
    { href: '/offline-maps', label: lang === 'te' ? 'ఆఫ్‌లైన్ మ్యాప్‌లు' : 'Offline Maps', icon: Compass },
    { href: '/essentials', label: lang === 'te' ? 'అవసరాలు' : 'Essentials', icon: Layers },
    { href: '/explore', label: lang === 'te' ? 'అన్వేషించు' : 'Explore', icon: Compass },
    { href: '/festivals', label: lang === 'te' ? 'ఉత్సవాలు' : 'Festivals', icon: Calendar },
  ];

  return (
    <header className={styles.desktopHeaderContainer}>
      <div className={styles.innerHeader}>
        <div className={styles.leftBrand}>
          <Link href="/" className={styles.logoWrapper}>
            <Logo size={36} />
            <span className={styles.brandName}>Saarthi Guide</span>
          </Link>
          <LocationPill 
            locationName={selectedLocation} 
            onClick={() => setIsLocationModalOpen(true)} 
          />
        </div>

        {/* ── DESKTOP NAVIGATION MENU ── */}
        <nav className={styles.centerNav}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={16} className={isActive ? styles.activeNavIcon : styles.navIcon} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.rightMeta}>
          <div className={styles.weatherBadge}>
            <Sun size={15} />
            <span>{displayWeather}</span>
          </div>

          <button
            type="button"
            onClick={() => setAppLanguage(lang === 'en' ? 'te' : 'en')}
            aria-label={lang === 'en' ? 'Switch to Telugu' : 'Switch to English'}
            title={lang === 'en' ? 'తెలుగులోకి మార్చండి' : 'Switch to English'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 11px',
              borderRadius: '9999px',
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#0F5132',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Languages size={14} color="#0F5132" strokeWidth={2} />
            <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          <Link href="/alerts" className={styles.notifButton} aria-label="Notifications">
            <Bell size={18} />
            {activeAlertsCount > 0 && (
              <span className={styles.notifBadge}>
                {activeAlertsCount > 9 ? '9+' : activeAlertsCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* DYNAMIC REGION / STARTING LOCATION SELECTOR MODAL */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocationName={selectedLocation}
        onSelectLocation={(name) => setSelectedLocation(name)}
      />
    </header>
  );
}

