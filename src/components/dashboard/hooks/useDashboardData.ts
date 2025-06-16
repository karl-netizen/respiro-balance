
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { useMeditationStats } from '@/components/progress/useMeditationStats';
import { useTimeAwareness } from '@/hooks/useTimeAwareness';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';

export const useDashboardData = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { meditationStats } = useMeditationStats();
  const { currentPeriod } = useTimeAwareness();
  
  // Initialize real-time sync with memoized config
  const syncConfig = useMemo(() => ({
    enableBiometricSync: true,
    enableSessionSync: true,
    enableProgressSync: true,
    enableSocialSync: true,
    syncInterval: 30000
  }), []);
  
  useRealTimeSync(syncConfig);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Memoize user name calculation
  const userName = useMemo(() => {
    if (!user) return 'there';
    
    const metadata = user.user_metadata;
    
    if (metadata?.full_name) {
      return metadata.full_name.split(' ')[0];
    }
    
    if (metadata?.first_name) {
      return metadata.first_name;
    }
    
    if (metadata?.name) {
      return metadata.name.split(' ')[0];
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'there';
  }, [user?.user_metadata, user?.email]);

  // Memoize welcome message calculation
  const welcomeMessage = useMemo(() => {
    const hour = currentTime.getHours();
    
    if (hour < 12) return `Good morning, ${userName}!`;
    if (hour < 17) return `Good afternoon, ${userName}!`;
    return `Good evening, ${userName}!`;
  }, [currentTime, userName]);

  // Memoize the calculated stats to prevent constant re-renders
  const stableStats = useMemo(() => {
    const currentStreak = meditationStats?.currentStreak || meditationStats?.streak || 0;
    const weeklyGoal = preferences?.preferred_session_duration ? preferences.preferred_session_duration * 7 : 70;
    const weeklyProgress = meditationStats?.weeklyMinutes || meditationStats?.weeklyCompleted || 0;
    const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

    return {
      currentStreak,
      weeklyGoal,
      weeklyProgress,
      progressPercentage
    };
  }, [
    meditationStats?.currentStreak,
    meditationStats?.streak,
    meditationStats?.weeklyMinutes,
    meditationStats?.weeklyCompleted,
    preferences?.preferred_session_duration
  ]);

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleMoodSelect = useCallback((mood: string) => {
    console.log('handleMoodSelect called with:', mood);
    // This function is now just for compatibility, actual mood state is managed in Dashboard
  }, []);

  return useMemo(() => ({
    user,
    currentPeriod,
    meditationStats,
    currentStreak: stableStats.currentStreak,
    weeklyGoal: stableStats.weeklyGoal,
    weeklyProgress: stableStats.weeklyProgress,
    progressPercentage: stableStats.progressPercentage,
    welcomeMessage,
    userName,
    handleMoodSelect
  }), [
    user,
    currentPeriod,
    meditationStats,
    stableStats.currentStreak,
    stableStats.weeklyGoal,
    stableStats.weeklyProgress,
    stableStats.progressPercentage,
    welcomeMessage,
    userName,
    handleMoodSelect
  ]);
};
