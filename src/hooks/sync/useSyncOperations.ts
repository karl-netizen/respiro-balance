
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export const useSyncOperations = () => {
  const { user } = useAuth();

  const syncSessionData = useCallback(async () => {
    if (!user || !supabase) return;
    
    try {
      const { data: sessions, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      sessionStorage.setItem('recentSessions', JSON.stringify(sessions || []));
      
    } catch (error) {
      console.error('Session sync error:', error);
    }
  }, [user]);
  
  const syncProgressData = useCallback(async () => {
    if (!user || !supabase) return;
    
    try {
      const { data: achievements, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      sessionStorage.setItem('userAchievements', JSON.stringify(achievements || []));
      
    } catch (error) {
      console.error('Progress sync error:', error);
    }
  }, [user]);
  
  const syncSocialData = useCallback(async () => {
    if (!user || !supabase) return;
    
    try {
      const { data: socialProfile, error } = await supabase
        .from('user_social_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      sessionStorage.setItem('socialProfile', JSON.stringify(socialProfile || {}));
      
    } catch (error) {
      console.error('Social sync error:', error);
    }
  }, [user]);

  return {
    syncSessionData,
    syncProgressData,
    syncSocialData
  };
};
