import { useState, useEffect, useMemo } from 'react';
import { useRealtimeAlerts } from '@/lib/useRealtimeAlerts';
import { useTrip } from '@/components/TripContext';

export function useAlerts() {
  const { alerts } = useRealtimeAlerts();
  const { userLocation } = useTrip();
  const [activePopupAlert, setActivePopupAlert] = useState<any>(null);
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
    
    const popupAlert = alerts.find(alert => {
      if (alert.popup_type !== 'Popup' && alert.popup_type !== 'Fullscreen' && alert.severity !== 'Critical') {
        return false;
      }
      
      if (dismissedAlertIds.includes(alert.id)) {
        return false;
      }
      
      if (alert.target_location !== 'All Users') {
        if (userLocation) {
          const lat = userLocation.lat;
          const lon = userLocation.lng;
          
          if (alert.target_location === 'Tirumala') {
            const isNearTirumala = Math.abs(lat - 13.6833) < 0.08 && Math.abs(lon - 79.3500) < 0.08;
            if (!isNearTirumala) return false;
          } else if (alert.target_location === 'Tirupati') {
            const isNearTirupati = Math.abs(lat - 13.6288) < 0.08 && Math.abs(lon - 79.4192) < 0.08;
            if (!isNearTirupati) return false;
          }
        } else {
          return false;
        }
      }
      
      return true;
    });

    setActivePopupAlert(popupAlert || null);
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
    dismissAlert
  };
}
