import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useRealtimeSupabase() {
  const [liveUpdates, setLiveUpdates] = useState<Record<string, any>>({});
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  useEffect(() => {
    // 1. Initial Fetch
    const fetchInitialData = async () => {
      // Fetch Alerts
      const { data: alertsData } = await supabase
        .from('alerts')
        .select('*')
        .eq('is_active', true);
      
      if (alertsData) {
        setActiveAlerts(alertsData);
      }

      // Fetch Live Updates
      const { data: updatesData } = await supabase
        .from('live_updates')
        .select('*');

      if (updatesData) {
        const updateMap: Record<string, any> = {};
        updatesData.forEach(row => {
          updateMap[row.place_id] = row;
        });
        setLiveUpdates(updateMap);
      }
    };

    fetchInitialData();

    // 2. Subscribe to Realtime changes
    const liveUpdatesSubscription = supabase
      .channel('public:live_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_updates' }, (payload) => {
        const newRow = payload.new;
        setLiveUpdates(prev => ({
          ...prev,
          [newRow.place_id]: newRow
        }));
      })
      .subscribe();

    const alertsSubscription = supabase
      .channel('public:alerts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, (payload) => {
        // Full refresh on any alert change to keep it simple and accurate
        fetchInitialData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(liveUpdatesSubscription);
      supabase.removeChannel(alertsSubscription);
    };
  }, []);

  return { liveUpdates, activeAlerts };
}
