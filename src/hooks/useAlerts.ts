import { useState, useEffect, useMemo } from 'react';
import { useRealtimeAlerts, LiveAlert } from '@/lib/useRealtimeAlerts';
import { useTrip } from '@/components/TripContext';

export function useAlerts() {
  const { alerts, loading } = useRealtimeAlerts();
  const { userLocation } = useTrip();
  const [activePopupAlert, setActivePopupAlert] = useState<LiveAlert | null>(null);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = JSON.parse(localStorage.getItem('saarthi_dismissed_alerts') || '[]');
      setDismissedAlertIds(dismissed);
    }
  }, []);

  useEffect(() => {
    if (!alerts || alerts.length === 0) {
      setActivePopupAlert(null);
      return;
    }
    
    // Pick the most recent active alert that hasn't been dismissed by this user
    const alertToShow = alerts.find(alert => {
      if (dismissedAlertIds.includes(alert.id)) {
        return false;
      }
      
      // Location targeting check (if user location is present and specified)
      if (alert.target_location && alert.target_location !== 'All Users' && userLocation) {
        const lat = userLocation.lat;
        const lon = userLocation.lng;
        
        if (alert.target_location === 'Tirumala') {
          const isNearTirumala = Math.abs(lat - 13.6833) < 0.1 && Math.abs(lon - 79.3500) < 0.1;
          if (!isNearTirumala) return false;
        } else if (alert.target_location === 'Tirupati') {
          const isNearTirupati = Math.abs(lat - 13.6288) < 0.1 && Math.abs(lon - 79.4192) < 0.1;
          if (!isNearTirupati) return false;
        }
      }
      
      return true;
    });

    setActivePopupAlert(alertToShow || null);
  }, [alerts, userLocation, dismissedAlertIds]);

  const activeAlertsCount = useMemo(() => {
    if (!alerts) return 0;
    return alerts.filter(a => !dismissedAlertIds.includes(a.id)).length;
  }, [alerts, dismissedAlertIds]);

  const dismissAlert = (id: string) => {
    const updated = [...dismissedAlertIds, id];
    localStorage.setItem('saarthi_dismissed_alerts', JSON.stringify(updated));
    setDismissedAlertIds(updated);
    if (activePopupAlert && activePopupAlert.id === id) {
      setActivePopupAlert(null);
    }
  };

  return {
    alerts,
    activePopupAlert,
    dismissedAlertIds,
    activeAlertsCount,
    dismissAlert,
    loading
  };
}
