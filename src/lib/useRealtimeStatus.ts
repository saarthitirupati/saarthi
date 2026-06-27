'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { TirumalaStatus } from './adminDb';

export function useRealtimeStatus(initialStatus: TirumalaStatus | null = null) {
  const [status, setStatus] = useState<TirumalaStatus | null>(initialStatus);
  const [loading, setLoading] = useState(!initialStatus);

  useEffect(() => {
    // 1. Fetch initial status
    const fetchStatus = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tirumala_status')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (!error && data) {
        setStatus(data as TirumalaStatus);
      }
      setLoading(false);
    };

    if (!initialStatus) fetchStatus();

    // 2. Subscribe to realtime changes
    const subscription = supabase
      .channel('public:tirumala_status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tirumala_status', filter: 'id=eq.1' },
        (payload) => {
          setStatus(payload.new as TirumalaStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [initialStatus]);

  return { status, loading };
}
