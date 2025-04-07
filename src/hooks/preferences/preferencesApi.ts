
import { supabase } from '@/lib/supabase';
import { UserPreferences } from '@/context/types';
import defaultPreferences from '@/context/defaultPreferences';

// Fetch user preferences from Supabase
export async function fetchUserPreferences(userId: string | undefined): Promise<UserPreferences> {
  if (!userId) {
    return defaultPreferences;
  }

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }

    return data?.preferences || defaultPreferences;
  } catch (error) {
    console.error('Error in fetchUserPreferences:', error);
    return defaultPreferences;
  }
}

// Update user preferences in Supabase
export async function updateUserPreferences(
  preferences: Partial<UserPreferences>,
  userId: string | undefined
): Promise<UserPreferences> {
  if (!userId) {
    // For demo or offline mode, just return the preferences
    return { ...defaultPreferences, ...preferences };
  }

  try {
    // First check if the user already has preferences
    const { data: existingData } = await supabase
      .from('user_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .single();

    const updatedPreferences = {
      ...(existingData?.preferences || defaultPreferences),
      ...preferences
    };

    if (existingData) {
      // Update existing preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .update({ preferences: updatedPreferences })
        .eq('user_id', userId)
        .select('preferences')
        .single();

      if (error) {
        console.error('Error updating user preferences:', error);
        throw error;
      }

      return data.preferences;
    } else {
      // Insert new preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({ 
          user_id: userId, 
          preferences: updatedPreferences 
        })
        .select('preferences')
        .single();

      if (error) {
        console.error('Error creating user preferences:', error);
        throw error;
      }

      return data.preferences;
    }
  } catch (error) {
    console.error('Error in updateUserPreferences:', error);
    // Return merged preferences even if save failed
    return { ...defaultPreferences, ...preferences } as UserPreferences;
  }
}

// Process any offline changes when back online
export async function processOfflineSync(userId: string): Promise<void> {
  // This would handle syncing any changes made while offline
  // For now, just a placeholder
  console.log('Processing offline sync for user:', userId);
  return Promise.resolve();
}
