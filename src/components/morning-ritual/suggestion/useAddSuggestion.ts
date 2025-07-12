
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
        user_id: '',
        title: suggestion.title,
        description: suggestion.description,
        timeOfDay: suggestion.timeOfDay,
        start_time: suggestion.timeOfDay,
        duration: suggestion.duration,
        recurrence: 'daily',
        priority: suggestion.priority,
        reminder_enabled: true,
        reminder_time: 10,
        tags: suggestion.tags || [],
        status: 'planned',
        complete: false,
        streak: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date(),
        days_of_week: [],
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
