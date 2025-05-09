
import { useState, useEffect } from 'react';
import { TimeAwarenessService, TimePeriod } from '@/services/TimeAwarenessService';
import { useUserPreferences } from '@/context';

export function useTimeAwareness() {
  const { preferences } = useUserPreferences();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimeAwarenessService.getCurrentTimePeriod());
  const [recommendations, setRecommendations] = useState(TimeAwarenessService.getTimeBasedRecommendations(preferences));
  
  // Check for time period changes
  useEffect(() => {
    // Initial check
    updateTimePeriod();
    
    // Check every minute for time period changes
    const intervalId = setInterval(() => {
      updateTimePeriod();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Update time period and recommendations when preferences change
  useEffect(() => {
    setRecommendations(TimeAwarenessService.getTimeBasedRecommendations(preferences));
  }, [preferences]);
  
  // Update time period and related data
  const updateTimePeriod = () => {
    const currentPeriod = TimeAwarenessService.getCurrentTimePeriod();
    if (currentPeriod !== timePeriod) {
      setTimePeriod(currentPeriod);
      setRecommendations(TimeAwarenessService.getTimeBasedRecommendations(preferences));
    }
  };
  
  // Record user mood
  const recordMood = (mood: string) => {
    TimeAwarenessService.recordMood(mood);
  };
  
  // Get a greeting based on time of day
  const getGreeting = (userName: string = "") => {
    return TimeAwarenessService.getTimeBasedGreeting(userName);
  };
  
  return {
    timePeriod,
    recommendations,
    recordMood,
    getGreeting,
    updateTimePeriod,
    mostFrequentMood: TimeAwarenessService.getMostFrequentMoodForCurrentTimePeriod()
  };
}
