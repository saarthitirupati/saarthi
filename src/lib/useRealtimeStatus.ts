'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { TirumalaStatus } from './adminDb';

function deserializeStatus(data: any) {
  if (!data) return data;
  const configItem = data.darshans?.find((d: any) => d.name === 'SSD_CONFIG');
  if (configItem) {
    try {
      const config = JSON.parse(configItem.waitTime);
      Object.assign(data, config);
    } catch (e) {
      console.error('Error parsing SSD_CONFIG:', e);
    }
    data.darshans = data.darshans.filter((d: any) => d.name !== 'SSD_CONFIG');
  }
  return data;
}

export function useRealtimeStatus(initialStatus: TirumalaStatus | null = null) {
  const [status, setStatus] = useState<TirumalaStatus | null>(initialStatus);
  const [loading, setLoading] = useState(!initialStatus);

  const fetchStatus = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tirumala_status')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (!error && data) {
      setStatus(deserializeStatus(data) as TirumalaStatus);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!initialStatus) {
      fetchStatus();
    }

    // 2. Subscribe to realtime changes
    const subscription = supabase
      .channel('public:tirumala_status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tirumala_status', filter: 'id=eq.1' },
        (payload) => {
          setStatus(deserializeStatus(payload.new) as TirumalaStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [initialStatus]);

  return { status, loading, refresh: fetchStatus };
}
