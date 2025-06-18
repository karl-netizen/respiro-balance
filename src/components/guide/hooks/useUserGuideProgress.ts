
import { useState, useEffect, useCallback } from 'react';
import { UserGuideState } from '../types';

const STORAGE_KEY = 'respiro-guide-progress';

const defaultState: UserGuideState = {
  completedTours: [],
  viewedTooltips: [],
  currentTourStep: undefined,
  userPreferences: {
    enableTooltips: true,
    tourSpeed: 'medium',
    preferredTrigger: 'auto'
  },
  lastActivity: new Date()
};

export const useUserGuideProgress = () => {
  const [state, setState] = useState<UserGuideState>(defaultState);

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedState = JSON.parse(stored);
        setState({
          ...defaultState,
          ...parsedState,
          lastActivity: new Date(parsedState.lastActivity)
        });
      } catch (error) {
        console.error('Error loading guide progress:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const markTourCompleted = useCallback((tourId: string) => {
    setState(prev => ({
      ...prev,
      completedTours: [...prev.completedTours.filter(id => id !== tourId), tourId],
      lastActivity: new Date()
    }));
  }, []);

  const markTooltipViewed = useCallback((tooltipId: string) => {
    setState(prev => ({
      ...prev,
      viewedTooltips: [...prev.viewedTooltips.filter(id => id !== tooltipId), tooltipId],
      lastActivity: new Date()
    }));
  }, []);

  const hasTourCompleted = useCallback((tourId: string): boolean => {
    return state.completedTours.includes(tourId);
  }, [state.completedTours]);

  const hasViewedTooltip = useCallback((tooltipId: string): boolean => {
    return state.viewedTooltips.includes(tooltipId);
  }, [state.viewedTooltips]);

  const updatePreferences = useCallback((preferences: Partial<UserGuideState['userPreferences']>) => {
    setState(prev => ({
      ...prev,
      userPreferences: { ...prev.userPreferences, ...preferences },
      lastActivity: new Date()
    }));
  }, []);

  const setCurrentTourStep = useCallback((stepId?: string) => {
    setState(prev => ({
      ...prev,
      currentTourStep: stepId,
      lastActivity: new Date()
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getCompletionPercentage = useCallback((totalTours: number): number => {
    return Math.round((state.completedTours.length / totalTours) * 100);
  }, [state.completedTours.length]);

  return {
    state,
    markTourCompleted,
    markTooltipViewed,
    hasTourCompleted,
    hasViewedTooltip,
    updatePreferences,
    setCurrentTourStep,
    resetProgress,
    getCompletionPercentage,
    userPreferences: state.userPreferences,
    completedTours: state.completedTours,
    viewedTooltips: state.viewedTooltips
  };
};
