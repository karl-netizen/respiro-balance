
import { useState, useEffect } from 'react';
import { TimeAwarenessService, TimePeriod, RecommendationData } from '@/services/TimeAwarenessService';
import { useUserPreferences } from '@/context';

export const useTimeAwareness = () => {
  const { preferences } = useUserPreferences();
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>('morning');
  const [recommendations, setRecommendations] = useState<RecommendationData>({
    meditation: { title: '', duration: 10 },
    breathing: { title: '', duration: 3 },
    activity: { title: '', duration: 10 }
  });
  const [mostFrequentMood, setMostFrequentMood] = useState<string | null>(null);

  const updateTimePeriod = () => {
    const newPeriod = TimeAwarenessService.getCurrentTimePeriod();
    setCurrentPeriod(newPeriod);
    
    const newRecommendations = TimeAwarenessService.getTimeBasedRecommendations(preferences);
    setRecommendations(newRecommendations);
    
    const frequentMood = TimeAwarenessService.getMostFrequentMoodForCurrentTimePeriod();
    setMostFrequentMood(frequentMood);
  };

  const recordMood = (mood: string) => {
    TimeAwarenessService.recordMood(mood);
    // Update most frequent mood after recording
    const frequentMood = TimeAwarenessService.getMostFrequentMoodForCurrentTimePeriod();
    setMostFrequentMood(frequentMood);
  };

  const getGreeting = (userName: string = '') => {
    return TimeAwarenessService.getTimeBasedGreeting(userName);
  };

  useEffect(() => {
    updateTimePeriod();
    
    // Update every hour
    const interval = setInterval(updateTimePeriod, 3600000);
    
    return () => clearInterval(interval);
  }, [preferences]);

  return {
    timePeriod: currentPeriod,
    currentPeriod,
    recommendations,
    recordMood,
    getGreeting,
    updateTimePeriod,
    mostFrequentMood
  };
};
