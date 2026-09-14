'use client';

import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/Splash/Splash';

export default function SplashPage() {
  const router = useRouter();

  const handleFinish = () => {
    const isApp = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenOnboarding = typeof window !== 'undefined' && localStorage.getItem(isApp ? 'hasSeenOnboarding_app' : 'hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      router.push('/onboarding');
    } else {
      router.push('/');
    }
  };

  return <SplashScreen onFinish={handleFinish} />;
}
