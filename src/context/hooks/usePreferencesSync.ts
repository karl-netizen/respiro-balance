
import { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import defaultPreferences from '../defaultPreferences';
import { isSupabaseConfigured } from '@/lib/supabase';

export const usePreferencesSync = (
  user: any,
  supabasePreferences: UserPreferences,
  updateSupabasePreferences: (preferences: UserPreferences) => void,
  isLoading: boolean
) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [initialized, setInitialized] = useState(false);

  // On mount and when user or supabasePreferences changes:
  // 1. First try to load from Supabase if configured
  // 2. Otherwise, check localStorage
  // 3. Fall back to default preferences
  useEffect(() => {
    const loadPreferences = async () => {
      // If Supabase is configured and we have user and preferences
      if (isSupabaseConfigured() && user && supabasePreferences && !isLoading) {
        console.log("Loading preferences from Supabase");
        setPreferences(supabasePreferences);
        setInitialized(true);
        return;
      }
      
      // If we don't have Supabase or user, try localStorage
      const loadLocalPreferences = () => {
        console.log("Loading preferences from localStorage");
        const savedPreferences = localStorage.getItem("userPreferences");
        if (savedPreferences) {
          try {
            // Parse the saved preferences and ensure all required properties exist
            const parsedPrefs = JSON.parse(savedPreferences);
            
            // Make sure connectedDevices exists to prevent "undefined.includes()" errors
            if (!parsedPrefs.connectedDevices) {
              parsedPrefs.connectedDevices = [];
            }
            
            // Make sure metricsOfInterest exists
            if (!parsedPrefs.metricsOfInterest) {
              parsedPrefs.metricsOfInterest = defaultPreferences.metricsOfInterest;
            }
            
            // Make sure focusChallenges exists
            if (!parsedPrefs.focusChallenges) {
              parsedPrefs.focusChallenges = defaultPreferences.focusChallenges;
            }
            
            // Make sure workDays exists
            if (!parsedPrefs.workDays) {
              parsedPrefs.workDays = defaultPreferences.workDays;
            }
            
            // Make sure meditationGoals exists
            if (!parsedPrefs.meditationGoals) {
              parsedPrefs.meditationGoals = defaultPreferences.meditationGoals;
            }
            
            setPreferences(parsedPrefs);
          } catch (error) {
            console.error("Error parsing saved preferences:", error);
            setPreferences(defaultPreferences);
          }
        } else {
          setPreferences(defaultPreferences);
        }
        
        setInitialized(true);
      };
      
      loadLocalPreferences();
    };
    
    if (!initialized || user) {
      loadPreferences();
    }
  }, [user, supabasePreferences, isLoading, initialized]);

  // Save preferences - to both Supabase (if available) and localStorage
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    // Update local state
    setPreferences(prevPreferences => {
      const updatedPreferences = {
        ...prevPreferences,
        ...newPreferences,
      };
      
      // Save to localStorage as backup
      localStorage.setItem("userPreferences", JSON.stringify(updatedPreferences));
      
      // If Supabase is configured and we have a user, also save there
      if (isSupabaseConfigured() && user) {
        updateSupabasePreferences(updatedPreferences);
      }
      
      return updatedPreferences;
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem("userPreferences");
    
    // If Supabase is configured and we have a user, also reset there
    if (isSupabaseConfigured() && user) {
      updateSupabasePreferences(defaultPreferences);
    }
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    initialized
  };
};
