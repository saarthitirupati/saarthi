'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function usePageAnalytics() {
  const pathname = usePathname();
  const lastLoggedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname === lastLoggedPath.current) return;
    lastLoggedPath.current = pathname;

    // Get or create anonymous session ID
    let sessionId = '';
    try {
      sessionId = localStorage.getItem('saarthi_session_id') || '';
      if (!sessionId) {
        sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
        localStorage.setItem('saarthi_session_id', sessionId);
      }
    } catch {
      sessionId = `sess_${Date.now().toString(36)}`;
    }

    // Determine basic device type
    let deviceType = 'Mobile';
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width > 1024) deviceType = 'Desktop';
      else if (width >= 768) deviceType = 'Tablet';
    }

    const payload = JSON.stringify({
      sessionId,
      path: pathname,
      title: typeof document !== 'undefined' ? document.title : pathname,
      deviceType,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      timestamp: new Date().toISOString()
    });

    // Non-blocking beacon or fetch
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/v1/telemetry/pageview', blob);
    } else {
      fetch('/api/v1/telemetry/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  }, [pathname]);
}
