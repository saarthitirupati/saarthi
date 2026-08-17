'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { safeFetchJson } from './safeFetch';

export interface LiveAlert {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: 'Emergency' | 'High Priority' | 'Advisory' | 'Information';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  popup_type: 'Banner' | 'Popup' | 'Fullscreen';
  cta: 'Open Queue' | 'Open Essentials' | 'Open Maps' | 'Open Parking' | 'None';
  status: 'Draft' | 'Published' | 'Expired' | 'Archived';
  target_location: 'All Users' | 'Tirumala' | 'Tirupati' | 'Alipiri' | 'Nearby';
  start_time: string;
  expiry_time: string;
  created_at: string;
  updated_at: string;
}

export function useRealtimeAlerts() {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await safeFetchJson<LiveAlert[]>('/api/v1/alerts?t=' + Date.now());
      if (Array.isArray(data)) {
        setAlerts(prev => {
          if (prev.length === data.length && prev.every((p, i) => p.id === data[i].id && p.updated_at === data[i].updated_at)) {
            return prev;
          }
          return data;
        });
      }
    } catch (err) {
      console.error('Failed to fetch live alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Fetch initial active alerts
    fetchAlerts();

    // 2. Poll fallback every 6 seconds to ensure immediate update across tabs/devices
    const pollInterval = setInterval(() => {
      fetchAlerts();
    }, 6000);

    // 3. Instant local & cross-tab admin event listeners
    const handleCustomEvent = () => fetchAlerts();
    window.addEventListener('saarthi:live_update', handleCustomEvent);

    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel('saarthi_admin_channel');
      broadcastChannel.onmessage = (msg) => {
        if (msg.data?.type === 'LIVE_UPDATE') {
          fetchAlerts();
        }
      };
    } catch (e) {}

    // 4. Supabase Realtime channel subscription with unique identifier
    const channelName = `public:live_alerts_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    let subscription: any;
    try {
      subscription = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'live_alerts' },
          () => {
            fetchAlerts();
          }
        )
        .subscribe();
    } catch (err) {
      // Silent fallback: 6s API polling is already active
    }

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('saarthi:live_update', handleCustomEvent);
      if (broadcastChannel) {
        try { broadcastChannel.close(); } catch (e) {}
      }
      if (subscription) {
        try {
          supabase.removeChannel(subscription);
        } catch (e) {}
      }
    };
  }, [fetchAlerts]);

  return { alerts, refresh: fetchAlerts, loading };
}
