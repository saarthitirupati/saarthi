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
  const isCheckingOrNeedsOnboarding = !isExcluded && (needsOnboarding === null || needsOnboarding === true);
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
          height: '100%', 
          position: 'relative',
          width: '100%',
          maxWidth: isAdmin ? '100%' : '1440px',
          margin: '0 auto',
          background: '#FAFAF7',
        }}
      >
        {showBottomNav && <BottomNav />}
        <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div style={{ 
          minHeight: pathname === '/onboarding' ? '100dvh' : '100vh',
          height: pathname === '/onboarding' ? '100dvh' : 'auto',
          overflow: pathname === '/onboarding' ? 'hidden' : 'visible',
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
  const [showSplash, setShowSplash] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname?.startsWith('/saarthiadmin');

  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown');
    if (!splashShown && pathname === '/') {
      setShowSplash(true);
    }
  }, [pathname]);

  // Register service worker + subscribe to push notifications
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').then(async (reg) => {
      // Only subscribe if Notification API is available and user hasn't denied
      if (!('Notification' in window) || Notification.permission === 'denied') return;
      // Ask permission if not yet granted
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;
      }
      // Subscribe to push
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BG66lKYjVyCTBCyVvgT0qpmwpFaJ414JqzVUVNZ14KRQlcC5UdqDUOp9USQElQ2r7vO6P4fzYlX3oFRuu4oR5V8';
      if (!vapidKey) return;
      try {
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          const padding = '='.repeat((4 - (vapidKey.length % 4)) % 4);
          const base64 = (vapidKey + padding).replace(/-/g, '+').replace(/_/g, '/');
          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: outputArray,
          });
        }
        // Send subscription to our backend
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub.toJSON()),
        });
      } catch {
        // Push not supported or user declined — silent fail
      }
    }).catch(() => {});
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


