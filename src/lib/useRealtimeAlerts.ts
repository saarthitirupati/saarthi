'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export interface LiveAlert {
  id: string;
  title: string;
  description: string;
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

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error('Failed to fetch live alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Fetch initial active alerts
    fetchAlerts();

    // 2. Poll fallback: poll every 10s to ensure offline/mock environments catch updates
    const pollInterval = setInterval(() => {
      fetchAlerts();
    }, 10000);

    // 3. Supabase Realtime channel subscription
    let subscription: any;
    try {
      subscription = supabase
        .channel('public:live_alerts')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'live_alerts' },
          (payload) => {
            const now = new Date();
            
            if (payload.eventType === 'INSERT') {
              const newAlert = payload.new as LiveAlert;
              const isPublish = newAlert.status === 'Published';
              const isNotExpired = new Date(newAlert.expiry_time) > now;
              
              if (isPublish && isNotExpired) {
                setAlerts((prev) => [newAlert, ...prev]);
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedAlert = payload.new as LiveAlert;
              const isPublish = updatedAlert.status === 'Published';
              const isNotExpired = new Date(updatedAlert.expiry_time) > now;

              setAlerts((prev) => {
                const filtered = prev.filter((a) => a.id !== updatedAlert.id);
                if (isPublish && isNotExpired) {
                  return [updatedAlert, ...filtered].sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                  );
                }
                return filtered;
              });
            } else if (payload.eventType === 'DELETE') {
              setAlerts((prev) => prev.filter((a) => a.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime Supabase subscription skipped (using API polling)', err);
    }

    return () => {
      clearInterval(pollInterval);
      if (subscription) {
        try {
          supabase.removeChannel(subscription);
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  return { alerts, refresh: fetchAlerts, loading };
}
