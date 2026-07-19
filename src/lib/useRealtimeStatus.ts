'use client';

import { useEffect, useState } from 'react';
import { TirumalaStatus } from './statusDb';

export function useRealtimeStatus(initialStatus: TirumalaStatus | null = null) {
  const [status, setStatus] = useState<TirumalaStatus | null>(initialStatus);
  const [loading, setLoading] = useState(!initialStatus);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/v1/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data as TirumalaStatus);
      }
    } catch (e) {
      console.error('Failed to fetch live status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(fetchStatus, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { status, loading, refresh: fetchStatus };
}

