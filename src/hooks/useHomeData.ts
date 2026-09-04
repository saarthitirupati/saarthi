import { useState, useEffect } from 'react';
import { useTrip } from '@/components/TripContext';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { PLACES as STATIC_PLACES } from '@/data/places';
import { HomeData } from '@/types/home';
import { useAlerts } from './useAlerts';
import { useLiveStatus } from './useLiveStatus';
import { useChecklist } from './useChecklist';
import { useFeaturedPlaces } from './useFeaturedPlaces';
import { useDailyContent } from './useDailyContent';

export function useHomeData(): HomeData {
  const [mounted, setMounted] = useState(false);
  const { userLocation, locationName, setLocationName } = useTrip();
  const [userName, setUserName] = useState("Guest");

  // Basic mounting state
  useEffect(() => {
    setMounted(true);
    const isApp = window.matchMedia('(display-mode: standalone)').matches;
    const savedName = localStorage.getItem(isApp ? 'saarthi_user_name_app' : 'saarthi_user_name') || localStorage.getItem('saarthi_user_name');
    if (savedName) setUserName(savedName);
  }, []);

  // Fetch places
  const { places, loading: placesLoading } = useRealtimePlaces(STATIC_PLACES);

  // Compose all hooks
  const alertsHook = useAlerts();
  const liveStatusHook = useLiveStatus();
  const checklistHook = useChecklist();
  const dailyContentHook = useDailyContent(places);
  const featuredPlacesHook = useFeaturedPlaces(places, liveStatusHook.liveStatus, liveStatusHook.weatherTemp);

  return {
    loading: !mounted || placesLoading,
    hero: {
      userName,
      locationName,
      weatherTemp: liveStatusHook.weatherTemp,
      liveStatus: liveStatusHook.liveStatus
    },
    alerts: {
      activePopupAlert: alertsHook.activePopupAlert,
      activeAlertsCount: alertsHook.activeAlertsCount,
      dismissAlert: alertsHook.dismissAlert
    },
    status: {
      liveStatus: liveStatusHook.liveStatus,
      formattedWaitTime: liveStatusHook.formattedWaitTime,
      activeAlertsCount: alertsHook.activeAlertsCount
    },
    checklist: {
      stats: checklistHook.stats,
      items: checklistHook.items,
      state: checklistHook.state,
      toggleItem: checklistHook.toggleItem
    },
    daily: {
      dailyContent: dailyContentHook.dailyContent,
      todayStory: dailyContentHook.todayStory,
      todayFestival: dailyContentHook.todayFestival,
      templeOfTheDay: dailyContentHook.templeOfTheDay,
      decisionContext: dailyContentHook.decisionContext
    },
    places: {
      featuredPlace: featuredPlacesHook.featuredPlace,
      featuredPlaceDistance: featuredPlacesHook.featuredPlaceDistance,
      allPlaces: places
    }
  };
}
