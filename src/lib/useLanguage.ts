'use client';

import { useState, useEffect } from 'react';

export type AppLang = 'en' | 'te';

/**
 * Reads the saved language from localStorage ('saarthi_user_language').
 * Returns 'en' by default. Re-renders once on mount if Telugu is saved.
 */
export function useLanguage(): AppLang {
  const [lang, setLang] = useState<AppLang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('saarthi_user_language');
    if (saved === 'te') setLang('te');
  }, []);

  return lang;
}
