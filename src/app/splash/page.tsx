'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const SplashScreen = dynamic(() => import('@/components/Splash/Splash'), {
  ssr: false,
});

export default function SplashPage() {
  const router = useRouter();
  const [isExisting, setIsExisting] = useState(true);
  const [userName, setUserName] = useState('');
  const [userLanguage, setUserLanguage] = useState<'en' | 'te'>('en');

  useEffect(() => {
    if (!isExisting) {
      router.prefetch('/onboarding');
    }
  }, [isExisting, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isApp = window.matchMedia('(display-mode: standalone)').matches;
    const obKey = isApp ? 'hasSeenOnboarding_app' : 'hasSeenOnboarding';
    const hasSeen = localStorage.getItem(obKey) || localStorage.getItem('hasSeenOnboarding');
    const savedName = localStorage.getItem(isApp ? 'saarthi_user_name_app' : 'saarthi_user_name') || localStorage.getItem('saarthi_user_name');
    const lang = localStorage.getItem('saarthi_user_language') as 'en' | 'te';
    if (lang === 'te' || lang === 'en') setUserLanguage(lang);

    const existing = Boolean(hasSeen && savedName);
    setIsExisting(existing);
    if (savedName) setUserName(savedName);
  }, []);

  const handleFinish = () => {
    sessionStorage.setItem('splashShown', 'true');
    localStorage.setItem('saarthi_splash_seen', 'true');
    if (!isExisting) {
      router.replace('/onboarding');
    } else {
      router.replace('/');
    }
  };

  return (
    <SplashScreen
      onFinish={handleFinish}
      mode={isExisting ? 'existing' : 'new'}
      userName={userName}
      language={userLanguage}
    />
  );
}
