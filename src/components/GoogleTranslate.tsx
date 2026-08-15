'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Loads Google Translate Element and auto-triggers translation
 * based on the saved language in localStorage ('saarthi_user_language').
 * 
 * Hides the default Google Translate toolbar — our onboarding language
 * selector is the user-facing control.
 */
export default function GoogleTranslate() {
  const pathname = usePathname();

  useEffect(() => {
    // Tell Chrome not to offer its own "Translate page?" prompt
    if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
      const meta = document.createElement('meta');
      meta.name = 'google';
      meta.content = 'notranslate';
      document.head.appendChild(meta);
    }

    const savedLang = localStorage.getItem('saarthi_user_language');
    // Only load Google Translate if Telugu is selected
    if (savedLang !== 'te') return;

    const triggerTranslate = () => {
      const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (sel) {
        sel.value = 'te';
        sel.dispatchEvent(new Event('change'));
      }
    };

    // Prevent double-init script loading
    if (!(window as any).google || !(window as any).google.translate) {
      if (!document.getElementById('google-translate-script')) {
        (window as any).googleTranslateElementInit = () => {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'te',
              autoDisplay: false,
            },
            'google_translate_element'
          );

          const poll = setInterval(() => {
            const sel = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
            if (sel) {
              sel.value = 'te';
              sel.dispatchEvent(new Event('change'));
              clearInterval(poll);
            }
          }, 200);

          setTimeout(() => clearInterval(poll), 8000);
        };

        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    } else {
      // Script already loaded: re-trigger on route change after DOM renders
      const timer = setTimeout(triggerTranslate, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element" style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} />

      {/* Hide Google Translate toolbar and banner */}
      <style>{`
        .goog-te-banner-frame, .skiptranslate, #goog-gt-tt,
        .goog-te-balloon-frame, .goog-tooltip {
          display: none !important;
        }
        body { top: 0 !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
      `}</style>
    </>
  );
}
