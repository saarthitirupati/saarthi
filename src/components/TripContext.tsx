'use client';

import React, { createContext, useContext } from 'react';
import { useTripStore, TripState, PlannerInput, Plan } from '@/store/useTripStore';

interface TripContextType extends TripState {
  setDays: (days: number) => void;
  toggleMantra: (mantra: string) => void;
  togglePlace: (placeId: string) => void;
  toggleVisited: (placeId: string) => void;
  addViewedPlace: (placeId: string) => void;
  clearViewedHistory: () => void;
  setPlannerInput: (input: Partial<PlannerInput>) => void;
  setGeneratedPlans: (plans: Plan[] | null, recommendations: any[] | null) => void;
  savePlan: (plan: Plan) => void;
  removePlan: (id: string) => void;
  resetTrip: () => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  setLocationPermission: (status: 'default' | 'granted' | 'denied') => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const store = useTripStore();

  return (
    <TripContext.Provider value={store}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
