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

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const hasName = localStorage.getItem('saarthi_user_name');
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
      {!isAdmin && !showSplash && <DesktopHeader />}
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
          paddingBottom: showBottomNav ? 'calc(110px + env(safe-area-inset-bottom, 16px))' : (pathname === '/onboarding' ? '0px' : '24px')
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

  // Unregister any stale service workers to prevent cached Next.js chunks errors
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        let unregisteredAny = false;
        const promises = registrations.map((registration) =>
          registration.unregister().then((success) => {
            if (success) unregisteredAny = true;
          })
        );
        Promise.all(promises).then(() => {
          if (unregisteredAny) {
            console.log('Unregistered stale service workers to fix cache issues.');
            window.location.reload();
          }
        });
      });
    }
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


