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
      let activeWatchId: number | null = null;
      let permStatus: PermissionStatus | null = null;

      const triggerLocationDetection = async () => {
        const { detectCoordinates, watchCoordinates, getIPLocation, TIRUPATI_CENTER, resolveLocationName, syncLocationToServiceWorker } = await import('@/lib/location');

        detectCoordinates(
          (coords, source, isApproximate, accuracyMeters) => {
            const region = resolveLocationName(coords.lat, coords.lng);
            syncLocationToServiceWorker(coords, region);
            setState(prev => ({
              ...prev,
              userLocation: coords,
              locationPermission: source === 'gps' ? 'granted' : (prev.locationPermission === 'denied' ? 'denied' : 'default'),
              locationSource: source,
              locationAccuracyMeters: accuracyMeters,
              locationName: region
            }));

            if (source === 'ip') {
              getIPLocation().then(({ city }) => {
                if (city) {
                  const refined = resolveLocationName(coords.lat, coords.lng, city);
                  setState(prev => ({ ...prev, locationName: refined }));
                  syncLocationToServiceWorker(coords, refined);
                }
              }).catch(() => {});
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

        // Real-time GPS tracking as the pilgrim moves
        if (activeWatchId !== null && navigator.geolocation) {
          navigator.geolocation.clearWatch(activeWatchId);
        }
        activeWatchId = watchCoordinates((coords, accuracyMeters) => {
          const region = resolveLocationName(coords.lat, coords.lng);
          syncLocationToServiceWorker(coords, region);
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
                setState(prev => ({ ...prev, locationPermission: 'denied', locationSource: 'fallback' }));
              } else {
                setState(prev => ({ ...prev, locationPermission: 'default' }));
              }
            };
            permStatus.addEventListener('change', handlePermChange);
          }
        } catch {}

        if (!isManual && !isBrowserDenied) {
          await triggerLocationDetection();
        } else if (!loadedState.userLocation) {
          const { TIRUPATI_CENTER } = await import('@/lib/location');
          setState(prev => ({ ...prev, userLocation: TIRUPATI_CENTER, locationPermission: isBrowserDenied ? 'denied' : prev.locationPermission }));
        }
      };

      const timer = setTimeout(checkPermissionAndDetect, 250);

      return () => {
        clearTimeout(timer);
        if (activeWatchId !== null && navigator.geolocation) {
          navigator.geolocation.clearWatch(activeWatchId);
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
        import('@/lib/location').then(({ syncLocationToServiceWorker }) => {
          syncLocationToServiceWorker(userLocation);
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
    if (typeof window === 'undefined') return false;
    try {
      const { detectCoordinates, resolveLocationName, syncLocationToServiceWorker, watchCoordinates } = await import('@/lib/location');
      return new Promise<boolean>((resolve) => {
        detectCoordinates(
          (coords, source, isApproximate, accuracyMeters) => {
            const region = resolveLocationName(coords.lat, coords.lng);
            syncLocationToServiceWorker(coords, region);
            const isGps = source === 'gps';
            setState(prev => ({
              ...prev,
              userLocation: coords,
              locationPermission: isGps ? 'granted' : 'denied',
              locationSource: source,
              locationAccuracyMeters: accuracyMeters,
              locationName: region
            }));
            if (isGps && navigator.geolocation) {
              watchCoordinates((c, acc) => {
                const reg = resolveLocationName(c.lat, c.lng);
                syncLocationToServiceWorker(c, reg);
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
            } else {
              resolve(false);
            }
          },
          () => {
            setState(prev => ({
              ...prev,
              locationPermission: 'denied'
            }));
            resolve(false);
          }
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
