import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { FREE_TIER_WEEKLY_LIMIT } from '@/utils/tierAccess';
import { toast } from 'sonner';

export const useSessionLimit = () => {
  const { user } = useAuth();
  const [weeklySessionCount, setWeeklySessionCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch weekly session count
  const fetchWeeklyCount = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('check_weekly_session_limit', {
        p_user_id: user.id
      });

      if (error) throw error;
      setWeeklySessionCount(data || 0);
    } catch (error) {
      console.error('Error fetching session count:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWeeklyCount();
  }, [fetchWeeklyCount]);

  // Track a new session
  const trackSession = useCallback(async (contentId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_meditation_history')
        .insert({
          user_id: user.id,
          content_id: contentId,
          played_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local count
      setWeeklySessionCount(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Error tracking session:', error);
      toast.error('Failed to track session');
      return false;
    }
  }, [user]);

  // Check if user has reached limit
  const hasReachedLimit = useCallback((userTier: string): boolean => {
    if (userTier !== 'free') return false;
    return weeklySessionCount >= FREE_TIER_WEEKLY_LIMIT;
  }, [weeklySessionCount]);

  // Get remaining sessions
  const getRemainingSessions = useCallback((userTier: string): number => {
    if (userTier !== 'free') return Infinity;
    return Math.max(0, FREE_TIER_WEEKLY_LIMIT - weeklySessionCount);
  }, [weeklySessionCount]);

  return {
    weeklySessionCount,
    isLoading,
    hasReachedLimit,
    getRemainingSessions,
    trackSession,
    refetch: fetchWeeklyCount
  };
};
