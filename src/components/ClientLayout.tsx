'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import SplashScreen from '@/components/Splash/Splash';
import SideMenu from '@/components/SideMenu/SideMenu';
import BottomNav from '@/components/BottomNav/BottomNav';
import { TripProvider, useTrip } from '@/components/TripContext';
import LocationPrompt from '@/components/LocationPrompt/LocationPrompt';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import GoogleTranslate from '@/components/GoogleTranslate';
import { DesktopHeader } from '@/components/DesktopHeader';
import { ActiveAlerts } from '@/components/home/ActiveAlerts';
import { useAlerts } from '@/hooks/useAlerts';

import { syncExistingPushSubscription } from '@/lib/pushClient';

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
  usePageAnalytics();
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith('/saarthiadmin');
  const isStudio = pathname?.startsWith('/studio');
  const { locationPermission, isInitialized } = useTrip();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const alertsHook = useAlerts();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isApp = window.matchMedia('(display-mode: standalone)').matches;
    const obKey = isApp ? 'hasSeenOnboarding_app' : 'hasSeenOnboarding';
    const hasSeenOnboarding = localStorage.getItem(obKey);
    const hasName = localStorage.getItem(isApp ? 'saarthi_user_name_app' : 'saarthi_user_name');
    setNeedsOnboarding(!hasSeenOnboarding || !hasName);
  }, [pathname]);

  useEffect(() => {
    const isExcluded = pathname === '/onboarding' || pathname === '/splash' || isAdmin || isStudio;
    if (isInitialized && !showSplash && !isExcluded && needsOnboarding === true) {
      router.push('/onboarding');
    }
  }, [isInitialized, showSplash, pathname, router, needsOnboarding]);

  useEffect(() => {
    const handleToggle = () => setIsMenuOpen(!isMenuOpen);
    window.addEventListener('toggle-side-menu', handleToggle);
    return () => window.removeEventListener('toggle-side-menu', handleToggle);
  }, [setIsMenuOpen, isMenuOpen]);

  const isExcluded = pathname === '/onboarding' || pathname === '/splash' || isAdmin || isStudio;
  const isCheckingOrNeedsOnboarding = !isExcluded && (needsOnboarding === true);
  const showLocationPrompt = isInitialized && !showSplash && !isAdmin && pathname === '/' && locationPermission === 'default';
  const showBottomNav = !showSplash && !showLocationPrompt && !isAdmin && (['/', '/explore', '/saved', '/profile', '/essentials'].includes(pathname) || pathname?.startsWith('/essentials/'));
  const hideContent = !isAdmin && (showSplash || showLocationPrompt || isCheckingOrNeedsOnboarding);

  return (
    <>
      {showSplash && !isAdmin && <SplashScreen onFinish={handleSplashFinish} />}
      {showLocationPrompt && <LocationPrompt />}
      {!isAdmin && !showSplash && !isExcluded && <DesktopHeader />}
      {!isAdmin && !showSplash && !isExcluded && (
        <ActiveAlerts 
          activePopupAlert={alertsHook.activePopupAlert} 
          dismissAlert={alertsHook.dismissAlert} 
        />
      )}
      <div 
        className="appContainer"
        style={{ 
          visibility: hideContent ? 'hidden' : 'visible', 
          minHeight: '100%', 
          position: 'relative',
          width: '100%',
          maxWidth: (isAdmin || pathname === '/onboarding') ? '100%' : '1440px',
          margin: '0 auto',
          background: pathname === '/onboarding' ? 'transparent' : '#FAFAF7',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {showBottomNav && <BottomNav />}
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div style={{ 
          minHeight: pathname === '/onboarding' ? '100dvh' : '100vh',
          height: pathname === '/onboarding' ? '100dvh' : 'auto',
          overflow: pathname === '/onboarding' ? 'auto' : 'visible',
          overflowX: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
          paddingBottom: showBottomNav ? 'var(--layout-padding-bottom)' : (pathname === '/onboarding' ? '0px' : '24px')
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
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === '/' || pathname === '' || pathname === '/splash';
  const [showSplash, setShowSplash] = useState<boolean>(isHome);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = pathname?.startsWith('/saarthiadmin');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isNativeApp = Boolean((window as any).SaarthiNative || (window as any).Android);
    if (isNativeApp) {
      setShowSplash(false);
      sessionStorage.setItem('splashShown', 'true');
      return;
    }
    const splashShown = sessionStorage.getItem('splashShown');
    const isHomePage = pathname === '/' || pathname === '' || pathname === '/splash';
    if (splashShown && isHomePage) {
      setShowSplash(false);
    }
  }, [pathname]);

  // Register service worker + sync push subscription if permission was already granted
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').then(() => {
      syncExistingPushSubscription();
    }).catch(() => {});
  }, []);

  // Auto-recover from stale Next.js deployment chunks without crashing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleChunkError = (event: ErrorEvent) => {
      const msg = event?.message || '';
      const isChunkError =
        msg.includes('Loading chunk') ||
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Refused to execute script');

      if (isChunkError) {
        const lastReload = sessionStorage.getItem('saarthi_chunk_reload');
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
          sessionStorage.setItem('saarthi_chunk_reload', String(now));
          window.location.reload();
        }
      }
    };

    window.addEventListener('error', handleChunkError);
    return () => window.removeEventListener('error', handleChunkError);
  }, []);



  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  // Track page views (skip admin routes)
  useEffect(() => {
    if (!isAdmin && pathname) {
      fetch('/api/v1/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'page_view', metadata: { path: pathname } }),
      }).catch(() => {});
    }
  }, [pathname, isAdmin]);

  return (
    <TripProvider>
      <GoogleTranslate />
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


