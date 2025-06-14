
import { useCallback, useState } from 'react';
import { useUserPreferences } from '@/context';
import { MorningRitual } from '@/context/types';

interface RitualSuggestion {
  title: string;
  description: string;
  timeOfDay: string;
  duration: number;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

export const useAddSuggestion = () => {
  const { updatePreferences, preferences } = useUserPreferences();
  const [isAdding, setIsAdding] = useState(false);

  const addSuggestionAsRitual = useCallback(async (suggestion: RitualSuggestion) => {
    setIsAdding(true);
    try {
      const newRitual: MorningRitual = {
        id: `ritual_${Date.now()}`,
        title: suggestion.title,
        description: suggestion.description,
        timeOfDay: suggestion.timeOfDay,
        startTime: suggestion.timeOfDay,
        duration: suggestion.duration,
        recurrence: 'daily',
        priority: suggestion.priority,
        reminderEnabled: true,
        reminderTime: 10,
        tags: suggestion.tags || [],
        status: 'planned',
        complete: false,
        streak: 0,
        createdAt: new Date(),
        daysOfWeek: [],
        reminders: []
      };

      const updatedRituals = [...(preferences.morningRituals || []), newRitual];
      await updatePreferences({ morningRituals: updatedRituals });
    } finally {
      setIsAdding(false);
    }
  }, [updatePreferences, preferences.morningRituals]);

  const addSuggestion = addSuggestionAsRitual;

  return { addSuggestionAsRitual, addSuggestion, isAdding };
};
