
import { UserPreferences } from '@/context/types';

/**
 * Utility functions for handling offline preferences synchronization
 */

// Get the offline sync queue from localStorage
export const getSyncQueue = () => {
  const queue = localStorage.getItem('preferenceSyncQueue');
  return queue ? JSON.parse(queue) : [];
};

// Add preferences to the offline sync queue
export const addToSyncQueue = (preferences: UserPreferences) => {
  const queue = getSyncQueue();
  queue.push({
    preferences,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('preferenceSyncQueue', JSON.stringify(queue));
};

// Clear the offline sync queue
export const clearSyncQueue = () => {
  localStorage.removeItem('preferenceSyncQueue');
};

// Save preferences to localStorage
export const savePreferencesToLocalStorage = (preferences: UserPreferences) => {
  localStorage.setItem("userPreferences", JSON.stringify(preferences));
};

// Get preferences from localStorage
export const getPreferencesFromLocalStorage = (): UserPreferences | null => {
  const localPrefs = localStorage.getItem("userPreferences");
  if (localPrefs) {
    try {
      return JSON.parse(localPrefs);
    } catch (e) {
      console.error("Error parsing saved preferences:", e);
      return null;
    }
  }
  return null;
};
