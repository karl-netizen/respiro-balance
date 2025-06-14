
import { useState, useEffect } from 'react';
import { RitualSuggestion, RitualSuggestionsState } from './types';

export const useRitualSuggestions = () => {
  const [state, setState] = useState<RitualSuggestionsState>({
    suggestions: [],
    isLoading: true,
    error: undefined
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockSuggestions: RitualSuggestion[] = [
          {
            id: '1',
            title: 'Morning Meditation',
            description: 'Start your day with 10 minutes of mindful breathing',
            timeOfDay: '07:00',
            duration: 10,
            tags: ['meditation', 'breathing'],
            priority: 'high',
            category: 'mindfulness',
            recurrence: 'daily'
          },
          {
            id: '2',
            title: 'Gratitude Journaling',
            description: 'Write down 3 things you\'re grateful for',
            timeOfDay: '07:15',
            duration: 5,
            tags: ['journaling', 'gratitude'],
            priority: 'medium',
            category: 'reflection',
            recurrence: 'daily'
          },
          {
            id: '3',
            title: 'Morning Stretch',
            description: 'Gentle stretching to wake up your body',
            timeOfDay: '07:30',
            duration: 15,
            tags: ['exercise', 'stretching'],
            priority: 'medium',
            category: 'movement',
            recurrence: 'daily'
          }
        ];

        // Add more suggestions based on user preferences
        const additionalSuggestions: RitualSuggestion[] = [
          {
            id: '4',
            title: 'Hydration Ritual',
            description: 'Drink a glass of water with lemon',
            timeOfDay: '06:45',
            duration: 2,
            tags: ['health', 'hydration'],
            priority: 'medium',
            category: 'wellness',
            recurrence: 'daily'
          },
          {
            id: '5',
            title: 'Daily Intention Setting',
            description: 'Set your intention for the day ahead',
            timeOfDay: '07:45',
            duration: 5,
            tags: ['planning', 'intention'],
            priority: 'medium',
            category: 'mindfulness',
            recurrence: 'daily'
          },
          {
            id: '6',
            title: 'Nature Connection',
            description: 'Step outside and take 10 deep breaths',
            timeOfDay: '08:00',
            duration: 5,
            tags: ['nature', 'breathing'],
            priority: 'low',
            category: 'wellness',
            recurrence: 'daily'
          }
        ];

        const allSuggestions = [...mockSuggestions, ...additionalSuggestions];
        
        setState({
          suggestions: allSuggestions,
          isLoading: false,
          error: undefined
        });
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }));
      }
    };

    fetchSuggestions();
  }, []);

  return state;
};
