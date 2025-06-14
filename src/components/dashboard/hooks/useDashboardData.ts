
import { useState, useEffect, useMemo } from 'react';
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
  
  // Initialize real-time sync
  useRealTimeSync({
    enableBiometricSync: true,
    enableSessionSync: true,
    enableProgressSync: true,
    enableSocialSync: true,
    syncInterval: 30000
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getWelcomeMessage = () => {
    const hour = currentTime.getHours();
    const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

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

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
  };

  return {
    user,
    currentPeriod,
    currentMood,
    meditationStats,
    currentStreak: stableStats.currentStreak,
    weeklyGoal: stableStats.weeklyGoal,
    weeklyProgress: stableStats.weeklyProgress,
    progressPercentage: stableStats.progressPercentage,
    welcomeMessage: getWelcomeMessage(),
    handleMoodSelect
  };
};
