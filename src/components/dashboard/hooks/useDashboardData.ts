
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { useTimeAwareness } from '@/hooks/useTimeAwareness';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';

export const useDashboardData = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { progress: meditationStats, isLoading: sessionsLoading } = useMeditationSessions();
  const { subscriptionData, isLoading: subscriptionLoading } = useSubscriptionStatus();
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

  // Calculate loading state - use individual loading states
  const isLoading = sessionsLoading || subscriptionLoading;

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
    // Use real meditation session data
    const currentStreak = meditationStats?.currentStreak || 0;
    const weeklyGoal = preferences?.preferred_session_duration ? preferences.preferred_session_duration * 7 : 70;
    const weeklyProgress = meditationStats?.totalMinutes || 0;
    const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

    return {
      currentStreak,
      weeklyGoal,
      weeklyProgress,
      progressPercentage,
      totalSessions: meditationStats?.totalSessions || 0,
      averageRating: meditationStats?.averageRating || 0,
      completionRate: meditationStats?.completionRate || 0,
      longestStreak: meditationStats?.longestStreak || 0
    };
  }, [
    meditationStats?.currentStreak,
    meditationStats?.totalMinutes,
    meditationStats?.totalSessions,
    meditationStats?.averageRating,
    meditationStats?.completionRate,
    meditationStats?.longestStreak,
    preferences?.preferred_session_duration
  ]);

  // Enhanced meditation stats with real data
  const enhancedMeditationStats = useMemo(() => ({
    ...meditationStats,
    weeklyMinutes: stableStats.weeklyProgress,
    streak: stableStats.currentStreak,
    totalSessions: stableStats.totalSessions,
    averageRating: stableStats.averageRating,
    completionRate: stableStats.completionRate,
    longestStreak: stableStats.longestStreak,
    subscriptionTier: subscriptionData.subscription_tier,
    hasAccess: subscriptionData.subscribed
  }), [meditationStats, stableStats, subscriptionData]);

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleMoodSelect = useCallback((mood: string) => {
    console.log('handleMoodSelect called with:', mood);
    // This function is now just for compatibility, actual mood state is managed in Dashboard
  }, []);

  return useMemo(() => ({
    user,
    currentPeriod,
    meditationStats: enhancedMeditationStats,
    currentStreak: stableStats.currentStreak,
    weeklyGoal: stableStats.weeklyGoal,
    weeklyProgress: stableStats.weeklyProgress,
    progressPercentage: stableStats.progressPercentage,
    welcomeMessage,
    userName,
    handleMoodSelect,
    isLoading,
    subscriptionData,
    preferences
  }), [
    user,
    currentPeriod,
    enhancedMeditationStats,
    stableStats.currentStreak,
    stableStats.weeklyGoal,
    stableStats.weeklyProgress,
    stableStats.progressPercentage,
    welcomeMessage,
    userName,
    handleMoodSelect,
    isLoading,
    subscriptionData,
    preferences
  ]);
};
