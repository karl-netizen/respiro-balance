
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserPreferences } from '@/context/types';
import defaultPreferences from '@/context/defaultPreferences';
import { convertToDbFormat, convertToLocalFormat } from './formatConverters';
import { addToSyncQueue, clearSyncQueue, getSyncQueue, savePreferencesToLocalStorage, getPreferencesFromLocalStorage } from './offlineSync';
import { toast } from 'sonner';

// Fetch user preferences from Supabase
export const fetchUserPreferences = async (userId?: string): Promise<UserPreferences> => {
  if (!userId) return defaultPreferences;
  
  // If not connected to Supabase, return from localStorage
  if (!isSupabaseConfigured()) {
    const localPrefs = getPreferencesFromLocalStorage();
    return localPrefs || defaultPreferences;
  }

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }

    if (!data) {
      return defaultPreferences;
    }

    const prefs = convertToLocalFormat(data);
    
    // Store in localStorage as offline backup
    savePreferencesToLocalStorage(prefs);
    
    return prefs;
  } catch (error) {
    console.error("Failed to fetch preferences from Supabase:", error);
    
    // Fall back to localStorage if available
    const localPrefs = getPreferencesFromLocalStorage();
    return localPrefs || defaultPreferences;
  }
};

// Update user preferences in Supabase
export const updateUserPreferences = async (preferences: UserPreferences, userId?: string): Promise<void> => {
  if (!userId) throw new Error('User not authenticated');
  
  // Always update localStorage
  savePreferencesToLocalStorage(preferences);
  
  // If Supabase is not configured, add to sync queue and return
  if (!isSupabaseConfigured()) {
    addToSyncQueue(preferences);
    return;
  }

  const dbRecord = convertToDbFormat(preferences, userId);
  
  try {
    // Check if record exists
    const { data: existingRecord } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from('user_preferences')
        .update(dbRecord)
        .eq('id', existingRecord.id);

      if (error) {
        console.error('Error updating user preferences:', error);
        // Add to sync queue for later
        addToSyncQueue(preferences);
        throw error;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('user_preferences')
        .insert(dbRecord);

      if (error) {
        console.error('Error creating user preferences:', error);
        // Add to sync queue for later
        addToSyncQueue(preferences);
        throw error;
      }
    }
  } catch (error) {
    console.error("Failed to update preferences in Supabase:", error);
    // Add to sync queue for later retry
    addToSyncQueue(preferences);
    throw error;
  }
};

// Process any pending offline sync items
export const processOfflineSync = async (userId?: string): Promise<void> => {
  if (!userId || !isSupabaseConfigured()) return;
  
  const queue = getSyncQueue();
  if (queue.length === 0) return;
  
  console.log(`Processing ${queue.length} offline preference updates`);
  
  let success = true;
  
  for (const item of queue) {
    try {
      await updateUserPreferences(item.preferences, userId);
    } catch (error) {
      console.error("Error processing offline sync item:", error);
      success = false;
      break;
    }
  }
  
  if (success) {
    clearSyncQueue();
    toast("Sync complete", {
      description: `Successfully synchronized ${queue.length} offline changes`
    });
  }
};
