import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Sun, Bell, ChevronDown, Navigation, X } from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import { detectCoordinates } from '@/lib/location';
import styles from './DesktopHeader.module.css';

interface DesktopHeaderProps {
  weather?: string;
  temperature?: string;
  lastUpdated?: string;
}

export function DesktopHeader({ weather, temperature, lastUpdated }: DesktopHeaderProps) {
  const displayWeather = weather && temperature ? `${temperature} · ${weather}` : '☀ 24°C · Sunny';
  const displayUpdated = lastUpdated || 'Updated 2m ago';

  const [selectedLocation, setSelectedLocation] = useState<string>('Tirupati');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saarthi_user_region');
      if (saved) setSelectedLocation(saved);
    }
  }, []);

  const handleAutoDetectLocation = () => {
    setIsLocating(true);
    detectCoordinates(
      (coords) => {
        setIsLocating(false);
        const isTirumala = coords.lat > 13.66;
        const region = isTirumala ? 'Tirumala' : 'Tirupati';
        setSelectedLocation(region);
        if (typeof window !== 'undefined') localStorage.setItem('saarthi_user_region', region);
        setIsLocationModalOpen(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  return (
    <header className={styles.desktopHeaderContainer}>
      <div className={styles.innerHeader}>
        <div className={styles.leftBrand}>
          <Link href="/" className={styles.logoWrapper}>
            <Logo size={36} />
            <span className={styles.brandName}>Saarthi</span>
          </Link>
          <div 
            className={styles.locationBadge} 
            title="Current Region"
            onClick={() => setIsLocationModalOpen(true)}
            style={{ cursor: 'pointer' }}
          >
            <MapPin size={14} style={{ color: '#0F5132' }} />
            <span>{selectedLocation}</span>
            <ChevronDown size={14} style={{ color: '#64748B' }} />
          </div>
        </div>

        <div className={styles.rightMeta}>
          <div className={styles.weatherBadge}>
            <Sun size={15} />
            <span>{displayWeather}</span>
          </div>

          <div className={styles.updatedBadge}>
            <div className={styles.updatedDot} />
            <span>{displayUpdated}</span>
          </div>

          <Link href="/alerts" className={styles.notifButton} aria-label="Notifications">
            <Bell size={18} />
          </Link>
        </div>
      </div>

      {/* DYNAMIC REGION SELECTOR MODAL */}
      {isLocationModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '380px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#0F5132" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Select Active Region</h3>
              </div>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <button
              onClick={handleAutoDetectLocation}
              disabled={isLocating}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '16px',
                background: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                color: '#047857',
                fontWeight: 800,
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginBottom: '14px',
                transition: 'all 0.2s'
              }}
            >
              <Navigation size={16} className={isLocating ? 'animate-spin' : ''} />
              <span>{isLocating ? 'Acquiring GPS...' : 'Auto-Detect Live GPS Location'}</span>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'Tirupati', label: 'Tirupati City & Foothills', sub: 'Alipiri, Railway Station, Bus Stand' },
                { id: 'Tirumala', label: 'Tirumala Hill', sub: 'Sanctum, Mada Streets, Ghat Top' },
                { id: 'Renigunta', label: 'Renigunta & Suburbs', sub: 'Airport, Railway Junction' }
              ].map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => {
                    setSelectedLocation(reg.id);
                    if (typeof window !== 'undefined') localStorage.setItem('saarthi_user_region', reg.id);
                    setIsLocationModalOpen(false);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: selectedLocation === reg.id ? '2px solid #0F5132' : '1px solid #E2E8F0',
                    background: selectedLocation === reg.id ? '#F0FDF4' : '#FAFAFA',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{reg.label}</p>
                    <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>{reg.sub}</p>
                  </div>
                  {selectedLocation === reg.id && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#0F5132', color: '#FFFFFF', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
