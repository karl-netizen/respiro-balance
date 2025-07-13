
import { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import defaultPreferences from '../defaultPreferences';
import { isSupabaseConfigured } from '@/integrations/supabase/client';
import { useCleanupEffect } from '@/hooks/useCleanupEffect';

export const usePreferencesSync = (
  user: any,
  supabasePreferences: UserPreferences,
  updateSupabasePreferences: (preferences: UserPreferences) => void,
  isLoading: boolean
) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [initialized, setInitialized] = useState(false);

  // Use cleanup effect for proper memory management
  useCleanupEffect(() => {
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
            const parsedPrefs = JSON.parse(savedPreferences);
            
            // Ensure all required arrays exist
            const sanitizedPrefs = {
              ...defaultPreferences,
              ...parsedPrefs,
              connectedDevices: parsedPrefs.connectedDevices || [],
              metricsOfInterest: parsedPrefs.metricsOfInterest || defaultPreferences.metricsOfInterest,
              focusChallenges: parsedPrefs.focusChallenges || defaultPreferences.focusChallenges,
              workDays: parsedPrefs.workDays || defaultPreferences.workDays,
              meditationGoals: parsedPrefs.meditationGoals || defaultPreferences.meditationGoals,
            };
            
            setPreferences(sanitizedPrefs);
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
    
    // Return cleanup function
    return () => {
      setInitialized(false);
    };
  }, [user, supabasePreferences, isLoading, initialized]);

  // Save preferences with proper cleanup
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prevPreferences => {
      const updatedPreferences = {
        ...prevPreferences,
        ...newPreferences,
      };
      
      // Save to localStorage as backup
      try {
        localStorage.setItem("userPreferences", JSON.stringify(updatedPreferences));
      } catch (error) {
        console.error("Error saving preferences to localStorage:", error);
      }
      
      // If Supabase is configured and we have a user, also save there
      if (isSupabaseConfigured() && user) {
        try {
          updateSupabasePreferences(updatedPreferences);
        } catch (error) {
          console.error("Error saving preferences to Supabase:", error);
        }
      }
      
      return updatedPreferences;
    });
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    
    try {
      localStorage.removeItem("userPreferences");
    } catch (error) {
      console.error("Error removing preferences from localStorage:", error);
    }
    
    // If Supabase is configured and we have a user, also reset there
    if (isSupabaseConfigured() && user) {
      try {
        updateSupabasePreferences(defaultPreferences);
      } catch (error) {
        console.error("Error resetting preferences in Supabase:", error);
      }
    }
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    initialized
  };
};
