'use client';

import { useState, useEffect } from 'react';

export type AppLang = 'en' | 'te';

/**
 * Persists the chosen language and reloads the page to cleanly update
 * all UI components, translations, and Google Translate widget state.
 */
export function setAppLanguage(newLang: AppLang) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('saarthi_user_language', newLang);
    if (newLang === 'en') {
      // Clear google translate cookie when returning to English
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    }
    window.dispatchEvent(new CustomEvent('saarthi_language_change', { detail: newLang }));
    window.location.reload();
  } catch (err) {
    console.error('Failed to save language preference:', err);
  }
}

/**
 * Reads the saved language from localStorage ('saarthi_user_language').
 * Returns 'en' by default. Re-renders once on mount if Telugu is saved.
 */
export function useLanguage(): AppLang {
  const [lang, setLang] = useState<AppLang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('saarthi_user_language');
    if (saved === 'te') {
      setLang('te');
      document.documentElement.lang = 'te';
    } else if (saved === 'en') {
      setLang('en');
      document.documentElement.lang = 'en';
    }

    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<AppLang>;
      if (customEvent?.detail === 'te' || customEvent?.detail === 'en') {
        setLang(customEvent.detail);
        document.documentElement.lang = customEvent.detail;
      }
    };

    window.addEventListener('saarthi_language_change', handleLanguageChange);
    return () => {
      window.removeEventListener('saarthi_language_change', handleLanguageChange);
    };
  }, []);

  return lang;
}
