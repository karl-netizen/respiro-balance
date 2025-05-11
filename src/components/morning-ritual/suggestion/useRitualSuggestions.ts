
import { useState, useEffect, useCallback } from 'react';
import { RitualSuggestion } from './types';
import { useUserPreferences } from '@/context';
import { generateId } from '@/lib/utils';

export function useRitualSuggestions() {
  const { preferences } = useUserPreferences();
  const [suggestions, setSuggestions] = useState<RitualSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateSuggestions = useCallback(() => {
    // Generate suggestions based on user preferences
    const baseActivities = [
      'Meditation',
      'Journaling',
      'Reading',
      'Exercise',
      'Stretching',
      'Planning',
      'Gratitude practice'
    ];
    
    // Personalize suggestions based on user preferences
    const personalizedActivities = [];
    
    // Add stress reduction activities if user has high stress
    if (preferences.stressLevel === 'high' || preferences.stressLevel === 'very_high') {
      personalizedActivities.push(
        'Deep breathing',
        'Progressive muscle relaxation',
        'Mindfulness meditation'
      );
    }
    
    // Add exercise activities if user likes morning exercise
    if (preferences.morningExercise) {
      personalizedActivities.push(
        'Morning yoga',
        'Quick HIIT workout',
        'Light stretching routine'
      );
    }
    
    // Combine and deduplicate activities
    const allActivities = [...new Set([...baseActivities, ...personalizedActivities])];
    
    // Generate structured suggestions
    const newSuggestions: RitualSuggestion[] = allActivities.map(activity => {
      const durationMap: Record<string, number> = {
        'Meditation': 10,
        'Journaling': 15,
        'Reading': 20,
        'Exercise': 30,
        'Stretching': 10,
        'Planning': 15,
        'Gratitude practice': 5,
        'Deep breathing': 5,
        'Progressive muscle relaxation': 10,
        'Mindfulness meditation': 15,
        'Morning yoga': 20,
        'Quick HIIT workout': 15,
        'Light stretching routine': 10
      };
      
      const descriptionMap: Record<string, string> = {
        'Meditation': 'Start your day centered and focused',
        'Journaling': 'Reflect on your thoughts and set intentions',
        'Reading': 'Feed your mind with inspiring content',
        'Exercise': 'Energize your body and mind',
        'Stretching': 'Improve flexibility and wake up your body',
        'Planning': 'Set goals and priorities for the day',
        'Gratitude practice': 'Begin with thankfulness and positive energy',
        'Deep breathing': 'Calm your nervous system before the day begins',
        'Progressive muscle relaxation': 'Release tension and promote calm',
        'Mindfulness meditation': 'Train your focus and reduce anxiety',
        'Morning yoga': 'Connect body and mind with gentle movements',
        'Quick HIIT workout': 'Boost metabolism and energy quickly',
        'Light stretching routine': 'Wake up your body gently'
      };
      
      const tagOptions = [
        'wellness', 'productivity', 'mindfulness', 'health', 
        'creativity', 'energy', 'focus', 'calm', 'growth'
      ];
      
      // Generate 1-3 random tags
      const numTags = 1 + Math.floor(Math.random() * 3);
      const shuffledTags = [...tagOptions].sort(() => 0.5 - Math.random());
      const tags = shuffledTags.slice(0, numTags);
      
      // Generate appropriate time of day
      const timeOptions = [
        'Early morning',
        'Before breakfast',
        'After waking up',
        'First thing in the morning'
      ];
      const timeOfDay = timeOptions[Math.floor(Math.random() * timeOptions.length)];
      
      return {
        id: generateId(),
        title: activity,
        description: descriptionMap[activity] || `Add ${activity.toLowerCase()} to your morning routine`,
        timeOfDay,
        duration: durationMap[activity] || 15,
        tags,
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        recurrence: Math.random() > 0.6 ? 'daily' : Math.random() > 0.3 ? 'weekdays' : 'custom'
      };
    });
    
    return newSuggestions;
  }, [preferences]);

  const refreshSuggestions = useCallback(() => {
    setIsLoading(true);
    
    try {
      // Simulate API call with setTimeout
      setTimeout(() => {
        const newSuggestions = generateSuggestions();
        setSuggestions(newSuggestions);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate suggestions'));
      setIsLoading(false);
    }
  }, [generateSuggestions]);

  useEffect(() => {
    refreshSuggestions();
  }, []);

  return {
    suggestions,
    refreshSuggestions,
    isLoading,
    error
  };
}
