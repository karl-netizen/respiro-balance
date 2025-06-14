import { useCallback } from 'react';
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

  const addSuggestionAsRitual = useCallback(async (suggestion: RitualSuggestion) => {
    const newRitual: MorningRitual = {
      id: `ritual_${Date.now()}`,
      title: suggestion.title,
      description: suggestion.description,
      timeOfDay: suggestion.timeOfDay,
      duration: suggestion.duration,
      recurrence: 'daily',
      priority: suggestion.priority,
      reminderEnabled: true,
      reminderTime: 10,
      tags: suggestion.tags || [],
      status: 'planned',
      streak: 0,
      createdAt: new Date(),
      completionHistory: []
    };

    const updatedRituals = [...(preferences.morningRituals || []), newRitual];
    await updatePreferences({ morningRituals: updatedRituals });
  }, [updatePreferences, preferences.morningRituals]);

  return { addSuggestionAsRitual };
};
