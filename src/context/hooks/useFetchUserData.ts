
import { useState, useEffect } from 'react';
import { UserPreferencesData } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  preferences: UserPreferencesData;
  subscriptionTier: string;
  role: string;
}

export const useFetchUserData = (userId?: string) => {
  const [userData, setUserData] = useState<UserData>({
    preferences: {
      theme: 'light',
      preferred_session_duration: 10,
      work_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      meditation_experience: 'beginner',
      stress_level: 'moderate',
      work_environment: 'office',
      work_start_time: '09:00',
      work_end_time: '17:00',
      lunch_break: true,
      lunch_time: '13:00',
      morning_exercise: false,
      exercise_time: '07:00',
      bed_time: '22:00',
      has_completed_onboarding: false,
    },
    subscriptionTier: 'free',
    role: 'user',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch user preferences
        const { data: prefsData, error: prefsError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (prefsError) {
          console.error('Error fetching user preferences:', prefsError);
          throw prefsError;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('subscription_tier, role')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          throw profileError;
        }

        // Update state with fetched data
        setUserData({
          preferences: prefsData || userData.preferences,
          subscriptionTier: profile?.subscription_tier || 'free',
          role: profile?.role || 'user',
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const updateUserPreferences = async (updates: Partial<UserPreferencesData>) => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({ ...userData.preferences, ...updates, user_id: userId })
        .select()
        .single();

      if (error) {
        console.error('Error updating user preferences:', error);
        throw error;
      }

      // Update local state with the new preferences
      setUserData(prev => ({
        ...prev,
        preferences: data
      }));

      return data;
    } catch (err) {
      console.error('Error in updateUserPreferences:', err);
      return null;
    }
  };

  return {
    preferences: userData.preferences,
    subscriptionTier: userData.subscriptionTier,
    role: userData.role,
    isLoading,
    error,
    updateUserPreferences,
  };
};
