'use client';

import { useEffect, useState } from 'react';
import { TirumalaStatus } from './statusDb';

// Utility helper to notify all open browser tabs and components of admin updates
export function notifyRealtimeUpdate() {
  if (typeof window !== 'undefined') {
    // 1. Dispatch custom event locally in current window
    window.dispatchEvent(new CustomEvent('saarthi:live_update'));

    // 2. Broadcast across cross-tab BroadcastChannel
    try {
      const channel = new BroadcastChannel('saarthi_admin_channel');
      channel.postMessage({ type: 'LIVE_UPDATE', timestamp: Date.now() });
      channel.close();
    } catch (e) {
      // BroadcastChannel fallback for older browsers
      localStorage.setItem('saarthi_last_live_update', String(Date.now()));
    }
  }
}

import { safeFetchJson } from './safeFetch';

export function useRealtimeStatus(initialStatus: TirumalaStatus | null = null) {
  const [status, setStatus] = useState<TirumalaStatus | null>(initialStatus);
  const [loading, setLoading] = useState(!initialStatus);

  const fetchStatus = async () => {
    try {
      const data = await safeFetchJson<TirumalaStatus>('/api/v1/status?t=' + Date.now());
      if (data) {
        setStatus(data);
      }
    } catch (e) {
      console.error('Failed to fetch live status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Fast 3-second polling fallback
    const interval = setInterval(fetchStatus, 3000);

    // Listener 1: Custom window event
    const handleCustomEvent = () => {
      fetchStatus();
    };
    window.addEventListener('saarthi:live_update', handleCustomEvent);

    // Listener 2: BroadcastChannel across tabs
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('saarthi_admin_channel');
      broadcastChannel.onmessage = (msg) => {
        if (msg.data?.type === 'LIVE_UPDATE') {
          fetchStatus();
        }
      };
    } catch (e) {
      // BroadcastChannel fallback
    }

    // Listener 3: LocalStorage storage event
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'saarthi_last_live_update') {
        fetchStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('saarthi:live_update', handleCustomEvent);
      window.removeEventListener('storage', handleStorageChange);
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, []);

  return { status, loading, refresh: fetchStatus };
}
