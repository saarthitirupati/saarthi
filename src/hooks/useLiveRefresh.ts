'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function useLiveRefresh(table: string) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    const channel = supabase.channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table },
        (payload) => {
          console.log(`Live update received for ${table}:`, payload);
          if (mounted) {
            router.refresh();
          }
        }
      )
      .subscribe((status, err) => {
        if (mounted) {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`Supabase Realtime error on ${table}:`, err);
            setIsConnected(false);
          }
        }
      });

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [table, router]);

  return { isConnected };
}
