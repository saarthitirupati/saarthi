'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SplashScreen from '@/components/Splash/Splash';
import SideMenu from '@/components/SideMenu/SideMenu';
import BottomNav from '@/components/BottomNav/BottomNav';
import { TripProvider, useTrip } from '@/components/TripContext';
import LocationPrompt from '@/components/LocationPrompt/LocationPrompt';

function LayoutContent({
  children,
  showSplash,
  handleSplashFinish,
  isMenuOpen,
  setIsMenuOpen,
}: {
  children: React.ReactNode;
  showSplash: boolean;
  handleSplashFinish: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const { locationPermission, isInitialized } = useTrip();

  const showLocationPrompt = isInitialized && !showSplash && !isAdmin && pathname === '/' && locationPermission === 'default';
  const showBottomNav = !showSplash && !showLocationPrompt && !isAdmin && ['/', '/explore', '/saved', '/profile'].includes(pathname);

  return (
    <>
      {showSplash && !isAdmin && <SplashScreen onFinish={handleSplashFinish} />}
      {showLocationPrompt && <LocationPrompt />}
      <div style={{ 
        visibility: (showSplash || showLocationPrompt) && !isAdmin ? 'hidden' : 'visible', 
        height: '100%', 
        position: 'relative',
        maxWidth: isAdmin ? '100%' : '480px',
        margin: isAdmin ? 'none' : '0 auto',
        boxShadow: isAdmin ? 'none' : '0 0 32px rgba(30, 27, 24, 0.08)',
        borderLeft: isAdmin ? 'none' : '1px solid #E7E3DD',
        borderRight: isAdmin ? 'none' : '1px solid #E7E3DD',
        background: '#FAFAF7',
      }}>
        {showBottomNav && <BottomNav />}
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div style={{ 
          minHeight: '100vh',
          paddingBottom: showBottomNav ? '80px' : '0'
        }}>
          {children}
        </div>
      </div>
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (!splashShown && pathname === '/') {
      setShowSplash(true);
    }
  }, [pathname]);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  const isAdmin = pathname?.startsWith('/admin');

  // Track page views (skip admin routes)
  useEffect(() => {
    if (!isAdmin && pathname) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname }),
      }).catch(() => {});
    }
  }, [pathname, isAdmin]);

  return (
    <TripProvider>
      <LayoutContent
        showSplash={showSplash}
        handleSplashFinish={handleSplashFinish}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      >
        {children}
      </LayoutContent>
    </TripProvider>
  );
}
