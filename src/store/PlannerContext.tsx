'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type BudgetTier = 'budget' | 'medium' | 'premium' | 'custom';
export type GroupType = 'solo' | 'couple' | 'family' | 'friends' | 'elderly';
export type TravelMode = 'walk' | 'bike' | 'car' | 'cab' | 'public';
export type MoodType = 'peaceful' | 'adventurous' | 'luxury' | 'spiritual' | 'explore' | 'fun' | 'romantic' | 'learning';

export interface PlannerState {
  timeAvailable: number | null; // in minutes
  budgetTier: BudgetTier | null;
  customBudget: number | null;
  selectedInterests: string[];
}

interface PlannerContextType {
  state: PlannerState;
  setTimeAvailable: (time: number) => void;
  setBudgetTier: (tier: BudgetTier) => void;
  setCustomBudget: (amount: number) => void;
  toggleInterest: (interest: string) => void;
  resetPlanner: () => void;
}

const initialState: PlannerState = {
  timeAvailable: null,
  budgetTier: null,
  customBudget: null,
  selectedInterests: [],
};

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlannerState>(initialState);

  const setTimeAvailable = (time: number) =>
    setState((prev) => ({ ...prev, timeAvailable: time }));

  const setBudgetTier = (tier: BudgetTier) =>
    setState((prev) => ({ ...prev, budgetTier: tier }));

  const setCustomBudget = (amount: number) =>
    setState((prev) => ({ ...prev, customBudget: amount }));

  const toggleInterest = (interest: string) =>
    setState((prev) => {
      const isSelected = prev.selectedInterests.includes(interest);
      if (isSelected) {
        return { ...prev, selectedInterests: prev.selectedInterests.filter(i => i !== interest) };
      }
      if (prev.selectedInterests.length >= 5) return prev;
      return { ...prev, selectedInterests: [...prev.selectedInterests, interest] };
    });

  const resetPlanner = () => setState(initialState);

  return (
    <PlannerContext.Provider
      value={{
        state,
        setTimeAvailable,
        setBudgetTier,
        setCustomBudget,
        toggleInterest,
        resetPlanner,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
