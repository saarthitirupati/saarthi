'use client';

import { useState, useEffect, useCallback } from 'react';

import { PlanStop, Plan, PlannerInput, TripState } from '@/types/journey';

export type { PlanStop, Plan, PlannerInput, TripState };

const initialPlannerInput: PlannerInput = {
  timeMins: 180,
  budget: 1000,
  budgetTier: 'medium',
  interests: ['nature'],
  groupType: 'family',
  travelMode: 'car'
};

let globalActiveWatchId: number | null = null;
let lastEvaluatedLocationCoords: { lat: number; lng: number } | null = null;

function triggerLocationNotificationEvaluation(coords: { lat: number; lng: number }) {
  if (typeof window === 'undefined') return;
  if (lastEvaluatedLocationCoords) {
    const dLat = Math.abs(coords.lat - lastEvaluatedLocationCoords.lat) * 111000;
    const dLng = Math.abs(coords.lng - lastEvaluatedLocationCoords.lng) * 111000 * Math.cos((coords.lat * Math.PI) / 180);
    const distMeters = Math.sqrt(dLat * dLat + dLng * dLng);
    if (distMeters < 100) return;
  }
  lastEvaluatedLocationCoords = coords;
  import('@/lib/locationNotifications').then(({ checkAndDispatchLocationNotification }) => {
    checkAndDispatchLocationNotification(coords).catch(() => {});
  }).catch(() => {});
}

export function useTripStore() {
  const [state, setState] = useState<TripState>({
    days: 0,
    savedMantras: [],
    savedPlaces: [],
    visitedPlaces: [],
    viewedPlaces: [],
    isInitialized: false,
    plannerInput: initialPlannerInput,
    generatedPlans: null,
    recommendations: null,
    userLocation: null,
    locationPermission: 'default',
    locationName: 'Tirupati',
    savedPlans: []
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jeevapath_trip_state');
    let loadedState = state;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        loadedState = { 
          ...state,
          ...parsed, 
          visitedPlaces: parsed.visitedPlaces || [],
          viewedPlaces: parsed.viewedPlaces || [],
          plannerInput: parsed.plannerInput || initialPlannerInput,
          generatedPlans: parsed.generatedPlans || null,
          recommendations: parsed.recommendations || null,
          userLocation: parsed.userLocation || null,
          locationPermission: parsed.locationPermission || 'default',
          locationName: parsed.locationName || 'Tirupati',
          savedPlans: parsed.savedPlans || [],
          isInitialized: true 
        };
        setState(loadedState);
      } catch {
        setState(prev => ({ ...prev, isInitialized: true }));
      }
    } else {
      setState(prev => ({ ...prev, isInitialized: true }));
    }

    // Refresh coordinates dynamically on mount (non-blocking deferral after initial UI render)
    if (typeof window !== 'undefined') {
      const isManual = loadedState.locationSource === 'manual';
      let permStatus: PermissionStatus | null = null;

      const startActiveWatcher = (
        watchCoordinatesFn: typeof import('@/lib/location').watchCoordinates,
        resolveLocationNameFn: typeof import('@/lib/location').resolveLocationName,
        syncLocationFn: typeof import('@/lib/location').syncLocationToServiceWorker
      ) => {
        if (typeof window === 'undefined' || !navigator.geolocation) return;
        if (globalActiveWatchId !== null) {
          navigator.geolocation.clearWatch(globalActiveWatchId);
          globalActiveWatchId = null;
        }
        globalActiveWatchId = watchCoordinatesFn((coords, accuracyMeters) => {
          const region = resolveLocationNameFn(coords.lat, coords.lng);
          syncLocationFn(coords, region);
          triggerLocationNotificationEvaluation(coords);
          setState(prev => ({
            ...prev,
            userLocation: coords,
            locationPermission: 'granted',
            locationSource: 'gps',
            locationAccuracyMeters: accuracyMeters,
            locationName: region
          }));
        });
      };

      const triggerLocationDetection = async () => {
        const { detectCoordinates, watchCoordinates, TIRUPATI_CENTER, resolveLocationName, syncLocationToServiceWorker } = await import('@/lib/location');

        detectCoordinates(
          (coords, source, isApproximate, accuracyMeters) => {
            const region = resolveLocationName(coords.lat, coords.lng);
            syncLocationToServiceWorker(coords, region);
            triggerLocationNotificationEvaluation(coords);
            const isGps = source === 'gps';

            setState(prev => ({
              ...prev,
              userLocation: coords,
              locationPermission: (isGps || prev.locationPermission === 'granted') ? 'granted' : (prev.locationPermission === 'denied' ? 'denied' : 'default'),
              locationSource: source,
              locationAccuracyMeters: accuracyMeters,
              locationName: region
            }));

            // Start continuous high-accuracy watcher whenever GPS is available
            if (isGps && navigator.geolocation) {
              startActiveWatcher(watchCoordinates, resolveLocationName, syncLocationToServiceWorker);
            }
          },
          (err) => {
            const isExplicitDenial = err && err.code === 1;
            setState(prev => ({
              ...prev,
              userLocation: prev.userLocation || TIRUPATI_CENTER,
              locationPermission: isExplicitDenial ? 'denied' : prev.locationPermission
            }));
          }
        );
      };

      // Check real browser permission status if supported
      const checkPermissionAndDetect = async () => {
        let isBrowserDenied = false;
        try {
          if (navigator.permissions && navigator.permissions.query) {
            permStatus = await navigator.permissions.query({ name: 'geolocation' });
            if (permStatus.state === 'denied') isBrowserDenied = true;

            // Auto-dynamically react when user toggles location in browser/device settings
            const handlePermChange = () => {
              if (!permStatus) return;
              if (permStatus.state === 'granted') {
                triggerLocationDetection();
              } else if (permStatus.state === 'denied') {
                if (globalActiveWatchId !== null && navigator.geolocation) {
                  navigator.geolocation.clearWatch(globalActiveWatchId);
                  globalActiveWatchId = null;
                }
                setState(prev => ({ ...prev, locationPermission: 'denied', locationSource: 'fallback' }));
              } else {
                setState(prev => ({ ...prev, locationPermission: 'default' }));
              }
            };
            permStatus.addEventListener('change', handlePermChange);
          }
        } catch {}

        if (permStatus?.state === 'granted') {
          setState(prev => ({ ...prev, locationPermission: 'granted' }));
          await triggerLocationDetection();
        } else if (!isManual && !isBrowserDenied) {
          await triggerLocationDetection();
        } else if (!loadedState.userLocation) {
          const { TIRUPATI_CENTER, resolveLocationName } = await import('@/lib/location');
          setState(prev => ({ 
            ...prev, 
            userLocation: TIRUPATI_CENTER, 
            locationName: prev.locationName || resolveLocationName(TIRUPATI_CENTER.lat, TIRUPATI_CENTER.lng),
            locationPermission: isBrowserDenied ? 'denied' : prev.locationPermission 
          }));
        }
      };

      const timer = setTimeout(checkPermissionAndDetect, 200);

      return () => {
        clearTimeout(timer);
        if (globalActiveWatchId !== null && navigator.geolocation) {
          navigator.geolocation.clearWatch(globalActiveWatchId);
          globalActiveWatchId = null;
        }
      };
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (state.isInitialized) {
      localStorage.setItem('jeevapath_trip_state', JSON.stringify(state));
    }
  }, [state]);

  const setDays = useCallback((days: number) => setState(prev => (prev.days === days ? prev : { ...prev, days })), []);
  
  const toggleMantra = useCallback((mantra: string) => {
    setState(prev => ({
      ...prev,
      savedMantras: prev.savedMantras.includes(mantra)
        ? prev.savedMantras.filter(m => m !== mantra)
        : [...prev.savedMantras, mantra]
    }));
  }, []);

  const togglePlace = useCallback((placeId: string) => {
    setState(prev => {
      const nextSaved = prev.savedPlaces.includes(placeId)
        ? prev.savedPlaces.filter(id => id !== placeId)
        : [...prev.savedPlaces, placeId];
      
      // Train ML recommendation weights based on updated saves
      if (typeof window !== 'undefined') {
        try {
          import('@/lib/recommendation-engine').then(m => {
            m.trainMLModel(nextSaved);
          });
        } catch (e: any) {
          console.error('Failed to run ML training step', e);
        }
      }

      return {
        ...prev,
        savedPlaces: nextSaved
      };
    });
  }, []);

  const toggleVisited = useCallback((placeId: string) => {
    setState(prev => {
      const nextVisited = prev.visitedPlaces.includes(placeId)
        ? prev.visitedPlaces.filter(id => id !== placeId)
        : [...prev.visitedPlaces, placeId];

      // Train ML recommendation weights based on visited history
      if (typeof window !== 'undefined') {
        try {
          import('@/lib/recommendation-engine').then(m => {
            // Combine saved and visited for training signals
            const combined = Array.from(new Set([...prev.savedPlaces, ...nextVisited]));
            m.trainMLModel(combined);
          });
        } catch (e: any) {
          console.error('Failed to run ML training step', e);
        }
      }

      return {
        ...prev,
        visitedPlaces: nextVisited
      };
    });
  }, []);

  const setPlannerInput = useCallback((input: Partial<PlannerInput>) => {
    setState(prev => ({
      ...prev,
      plannerInput: { ...prev.plannerInput, ...input }
    }));
  }, []);

  const setGeneratedPlans = useCallback((plans: Plan[] | null, recommendations: any[] | null = null) => {
    setState(prev => ({ ...prev, generatedPlans: plans, recommendations }));
  }, []);

  const savePlan = useCallback((plan: Plan) => {
    setState(prev => {
      const alreadySaved = prev.savedPlans.some(p => 
        p.type === plan.type && p.totalCost === plan.totalCost && p.stops.length === plan.stops.length
      );
      if (alreadySaved) return prev;

      return {
        ...prev,
        savedPlans: [
          ...prev.savedPlans, 
          { ...plan, id: `plan_${Date.now()}`, savedAt: new Date().toISOString() }
        ]
      };
    });
  }, []);

  const removePlan = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      savedPlans: prev.savedPlans.filter(p => p.id !== id)
    }));
  }, []);

  const resetTrip = useCallback(() => {
    setState({
      days: 0,
      savedMantras: [],
      savedPlaces: [],
      visitedPlaces: [],
      viewedPlaces: [],
      isInitialized: true,
      plannerInput: initialPlannerInput,
      generatedPlans: null,
      recommendations: null,
      userLocation: null,
      locationPermission: 'default',
      savedPlans: []
    });
  }, []);

  const addViewedPlace = useCallback((placeId: string) => {
    if (!placeId) return;
    setState(prev => {
      if (prev.viewedPlaces && prev.viewedPlaces[0] === placeId) {
        return prev;
      }
      const filtered = (prev.viewedPlaces || []).filter(id => id !== placeId);
      const nextViewed = [placeId, ...filtered].slice(0, 20);
      return {
        ...prev,
        viewedPlaces: nextViewed
      };
    });
  }, []);

  const clearViewedHistory = useCallback(() => {
    setState(prev => (prev.viewedPlaces.length === 0 ? prev : { ...prev, viewedPlaces: [] }));
  }, []);

  const setUserLocation = useCallback((
    userLocation: { lat: number; lng: number } | null,
    source: 'gps' | 'ip' | 'fallback' | 'manual' = 'manual'
  ) => {
    setState(prev => {
      if (
        prev.userLocation?.lat === userLocation?.lat &&
        prev.userLocation?.lng === userLocation?.lng &&
        prev.locationSource === source
      ) {
        return prev;
      }
      if (userLocation) {
        import('@/lib/location').then(({ resolveLocationName, syncLocationToServiceWorker }) => {
          const region = resolveLocationName(userLocation.lat, userLocation.lng);
          syncLocationToServiceWorker(userLocation, region);
          setState(current => ({
            ...current,
            locationName: region
          }));
        }).catch(() => {});
      }
      return { ...prev, userLocation, locationSource: source };
    });
  }, []);

  const setLocationPermission = useCallback((locationPermission: 'default' | 'granted' | 'denied') => {
    setState(prev => (prev.locationPermission === locationPermission ? prev : { ...prev, locationPermission }));
  }, []);

  const setLocationName = useCallback((locationName: string) => {
    setState(prev => (prev.locationName === locationName ? prev : { ...prev, locationName }));
  }, []);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator.geolocation) return false;
    try {
      const { resolveLocationName, syncLocationToServiceWorker, watchCoordinates } = await import('@/lib/location');
      return new Promise<boolean>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = Number(position.coords.latitude.toFixed(6));
            const lng = Number(position.coords.longitude.toFixed(6));
            const accuracy = Math.round(position.coords.accuracy || 0);
            const coords = { lat, lng };
            const region = resolveLocationName(lat, lng);
            syncLocationToServiceWorker(coords, region);
            triggerLocationNotificationEvaluation(coords);

            setState(prev => ({
              ...prev,
              userLocation: coords,
              locationPermission: 'granted',
              locationSource: 'gps',
              locationAccuracyMeters: accuracy,
              locationName: region
            }));

            // Start continuous high-accuracy watcher
            if (globalActiveWatchId !== null) {
              navigator.geolocation.clearWatch(globalActiveWatchId);
              globalActiveWatchId = null;
            }
            globalActiveWatchId = watchCoordinates((c, acc) => {
              const reg = resolveLocationName(c.lat, c.lng);
              syncLocationToServiceWorker(c, reg);
              triggerLocationNotificationEvaluation(c);
              setState(prev => ({
                ...prev,
                userLocation: c,
                locationPermission: 'granted',
                locationSource: 'gps',
                locationAccuracyMeters: acc,
                locationName: reg
              }));
            });

            resolve(true);
          },
          (err) => {
            const isExplicitDenial = err && err.code === 1;
            console.warn("[requestLocationPermission] Acquisition notice:", err);
            setState(prev => ({
              ...prev,
              locationPermission: isExplicitDenial ? 'denied' : prev.locationPermission
            }));
            resolve(false);
          },
          { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
        );
      });
    } catch {
      return false;
    }
  }, []);

  return {
    ...state,
    setDays,
    toggleMantra,
    togglePlace,
    toggleVisited,
    addViewedPlace,
    clearViewedHistory,
    setPlannerInput,
    setGeneratedPlans,
    savePlan,
    removePlan,
    resetTrip,
    setUserLocation,
    setLocationPermission,
    setLocationName,
    requestLocationPermission
  };
}
