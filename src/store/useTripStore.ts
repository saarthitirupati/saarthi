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

    // Refresh coordinates dynamically on mount — always resolve to EXACT location
    if (typeof window !== 'undefined') {
      const permission = saved ? loadedState.locationPermission : 'default';
      if (permission !== 'denied') {
        import('@/lib/location').then(({ detectCoordinates, watchCoordinates, TIRUPATI_CENTER }) => {
          detectCoordinates(
            (coords, source, isApproximate, accuracyMeters) => {
              setState(prev => ({
                ...prev,
                userLocation: coords,
                locationPermission: 'granted',
                locationSource: source,
                locationAccuracyMeters: accuracyMeters
              }));
            },
            () => {
              // All detection failed — default to Tirupati Center so the app always has a location
              setState(prev => ({
                ...prev,
                userLocation: prev.userLocation || TIRUPATI_CENTER,
                locationPermission: 'denied'
              }));
            }
          );

          // Watch real-time GPS hardware updates
          watchCoordinates((coords) => {
            setState(prev => ({ ...prev, userLocation: coords, locationPermission: 'granted' }));
          });
        }).catch(() => {});
      } else if (!loadedState.userLocation) {
        // Permission was denied before and no cached location — set Tirupati Center
        import('@/lib/location').then(({ TIRUPATI_CENTER }) => {
          setState(prev => ({ ...prev, userLocation: TIRUPATI_CENTER }));
        }).catch(() => {});
      }
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

  const setUserLocation = useCallback((userLocation: { lat: number; lng: number } | null) => {
    setState(prev => {
      if (prev.userLocation?.lat === userLocation?.lat && prev.userLocation?.lng === userLocation?.lng) {
        return prev;
      }
      return { ...prev, userLocation };
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
