'use client';

import { useState, useEffect, useCallback } from 'react';

import { PlanStop, Plan, PlannerInput, TripState } from '@/types/journey';
import { resolveLocationName } from '@/utils/location';

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

      // Check real browser permission status if supported
      const checkPermissionAndDetect = async () => {
        let isBrowserDenied = false;
        let isBrowserGranted = false;
        try {
          if (navigator.permissions && navigator.permissions.query) {
            const status = await navigator.permissions.query({ name: 'geolocation' });
            if (status.state === 'denied') isBrowserDenied = true;
            if (status.state === 'granted') isBrowserGranted = true;
          }
        } catch {}

        const shouldDetect = !isManual && !isBrowserDenied && (loadedState.locationPermission === 'granted' || isBrowserGranted);

        if (shouldDetect) {
          const { detectCoordinates, watchCoordinates, getIPLocation, TIRUPATI_CENTER, resolveLocationName, syncLocationToServiceWorker } = await import('@/lib/location');

          detectCoordinates(
            (coords, source, isApproximate, accuracyMeters) => {
              const region = resolveLocationName(coords.lat, coords.lng);
              syncLocationToServiceWorker(coords, region);
              setState(prev => ({
                ...prev,
                userLocation: coords,
                locationPermission: 'granted',
                locationSource: source,
                locationAccuracyMeters: accuracyMeters,
                locationName: region
              }));

              import('@/lib/location').then(({ reverseGeocodeCity, getIPLocation }) => {
                if (source === 'ip') {
                  getIPLocation().then(({ city }) => {
                    if (city) {
                      const refined = resolveLocationName(coords.lat, coords.lng, city);
                      setState(prev => ({ ...prev, locationName: refined }));
                      syncLocationToServiceWorker(coords, refined);
                    }
                  }).catch(() => {});
                } else {
                  reverseGeocodeCity(coords.lat, coords.lng).then(city => {
                    if (city) {
                      const refined = resolveLocationName(coords.lat, coords.lng, city);
                      setState(prev => ({ ...prev, locationName: refined }));
                      syncLocationToServiceWorker(coords, refined);
                    }
                  }).catch(() => {});
                }
              }).catch(() => {});
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
        } else if (!loadedState.userLocation) {
          const { TIRUPATI_CENTER } = await import('@/lib/location');
          setState(prev => ({ ...prev, userLocation: TIRUPATI_CENTER }));
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
      const initialResolvedName = userLocation
        ? resolveLocationName(userLocation.lat, userLocation.lng)
        : prev.locationName;

      if (userLocation) {
        import('@/lib/location').then(({ syncLocationToServiceWorker, reverseGeocodeCity }) => {
          syncLocationToServiceWorker(userLocation, initialResolvedName);
          reverseGeocodeCity(userLocation.lat, userLocation.lng).then(city => {
            if (city) {
              const refinedName = resolveLocationName(userLocation.lat, userLocation.lng, city);
              setState(p => {
                if (p.locationName !== refinedName) {
                  syncLocationToServiceWorker(userLocation, refinedName);
                  return { ...p, locationName: refinedName };
                }
                return p;
              });
            }
          }).catch(() => {});
        }).catch(() => {});
      }
      return { 
        ...prev, 
        userLocation, 
        locationSource: source,
        locationName: initialResolvedName || prev.locationName
      };
    });
  }, []);

  const setLocationPermission = useCallback((locationPermission: 'default' | 'granted' | 'denied') => {
    setState(prev => (prev.locationPermission === locationPermission ? prev : { ...prev, locationPermission }));
  }, []);

  const setLocationName = useCallback((locationName: string) => {
    setState(prev => (prev.locationName === locationName ? prev : { ...prev, locationName }));
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
    setLocationName
  };
}
