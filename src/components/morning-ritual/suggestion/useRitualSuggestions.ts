
import { useState, useEffect } from 'react';

export interface RitualSuggestion {
  id: string;
  title: string;
  description: string;
  duration: number;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RitualSuggestionsState {
  suggestions: RitualSuggestion[];
  isLoading: boolean;
  refreshSuggestions: () => void;
}

export const useRitualSuggestions = (): RitualSuggestionsState => {
  const [suggestions, setSuggestions] = useState<RitualSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const mockSuggestions: RitualSuggestion[] = [
    {
      id: '1',
      title: 'Mindful Morning',
      description: 'Start with 5 minutes of meditation followed by gratitude journaling',
      duration: 15,
      tags: ['meditation', 'gratitude'],
      difficulty: 'easy'
    },
    {
      id: '2',
      title: 'Energy Boost',
      description: 'Light stretching, breathing exercises, and positive affirmations',
      duration: 20,
      tags: ['movement', 'breathing', 'affirmations'],
      difficulty: 'medium'
    }
  ];

  const refreshSuggestions = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshSuggestions();
  }, []);

  return {
    suggestions,
    isLoading,
    refreshSuggestions
  };
};
