
import { useState, useEffect, useCallback } from 'react';
import { RitualSuggestion, RitualSuggestionsState } from './types';
import { generateId } from '@/lib/utils';

// Default suggestions as examples
const defaultSuggestions: RitualSuggestion[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start your day with a 10-minute meditation',
    timeOfDay: 'Morning',
    duration: 10,
    tags: ['meditation', 'mindfulness'],
    priority: 'high',
    recurrence: 'daily',
  },
  {
    id: '2',
    title: 'Gratitude Journaling',
    description: 'Write down 3 things you are grateful for',
    timeOfDay: 'Morning',
    duration: 5,
    tags: ['journaling', 'gratitude'],
    priority: 'medium',
    recurrence: 'daily',
  },
  {
    id: '3',
    title: 'Stretch Routine',
    description: 'A quick stretching session to wake up your body',
    timeOfDay: 'Morning',
    duration: 7,
    tags: ['exercise', 'flexibility'],
    priority: 'medium',
    recurrence: 'daily',
  },
];

export function useRitualSuggestions() {
  // State for suggestions
  const [state, setState] = useState<RitualSuggestionsState>({
    suggestions: defaultSuggestions,
    isLoading: false,
    error: null,
  });

  // Function to refresh suggestions
  const refreshSuggestions = useCallback(async () => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      // In a real app, you would fetch from an API
      // For now, we'll simulate a delay and return random suggestions
      await new Promise(resolve => setTimeout(resolve, 800));

      const refreshedSuggestions: RitualSuggestion[] = [
        ...defaultSuggestions.slice(0, 2),
        {
          id: generateId(),
          title: 'Morning Walk',
          description: 'A brisk 15-minute walk to start the day',
          timeOfDay: 'Morning',
          duration: 15,
          tags: ['exercise', 'outdoors'],
          priority: 'medium',
          recurrence: 'daily',
        },
        {
          id: generateId(),
          title: 'Reading Session',
          description: 'Read a few pages from a book',
          timeOfDay: 'Morning',
          duration: 10,
          tags: ['learning', 'mindfulness'],
          priority: 'low',
          recurrence: 'daily',
        },
      ];

      setState({
        suggestions: refreshedSuggestions,
        isLoading: false,
        error: null,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error refreshing suggestions:', error);
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to refresh suggestions'),
      }));
      return Promise.reject(error);
    }
  }, []);

  // Initial load of suggestions
  useEffect(() => {
    // We already have default suggestions, so no need to load initially
  }, []);

  return {
    suggestions: state.suggestions,
    isLoading: state.isLoading,
    error: state.error,
    refreshSuggestions,
  };
}
