
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getUserName = () => {
    if (!user) return 'there';
    
    // Try multiple metadata fields
    const metadata = user.user_metadata;
    
    // Check for full_name first
    if (metadata?.full_name) {
      return metadata.full_name.split(' ')[0];
    }
    
    // Check for first_name
    if (metadata?.first_name) {
      return metadata.first_name;
    }
    
    // Check for name
    if (metadata?.name) {
      return metadata.name.split(' ')[0];
    }
    
    // Fallback to email username
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'there';
  };

  const getWelcomeMessage = () => {
    const hour = currentTime.getHours();
    const name = getUserName();
    
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
    console.log('handleMoodSelect called with:', mood);
    // This function is now just for compatibility, actual mood state is managed in Dashboard
  };

  return {
    user,
    currentPeriod,
    meditationStats,
    currentStreak: stableStats.currentStreak,
    weeklyGoal: stableStats.weeklyGoal,
    weeklyProgress: stableStats.weeklyProgress,
    progressPercentage: stableStats.progressPercentage,
    welcomeMessage: getWelcomeMessage(),
    userName: getUserName(),
    handleMoodSelect
  };
};
