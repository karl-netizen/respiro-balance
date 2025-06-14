
import { useState, useCallback } from 'react';
import { MorningRitual } from '@/context/types';
import { useUserPreferences } from '@/context';
import { useNotifications } from '@/context/NotificationsProvider';

export const useRitualTimeline = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { addStreakAchievementNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const rituals = preferences.morningRituals || [];

  const completeRitual = useCallback(async (ritual: MorningRitual) => {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const updatedRitual = {
        ...ritual,
        status: 'completed' as const,
        lastCompleted: now,
        streak: (ritual.streak || 0) + 1
      };

      const updatedRituals = rituals.map(r => 
        r.id === ritual.id ? updatedRitual : r
      );

      await updatePreferences({ morningRituals: updatedRituals });

      if (updatedRitual.streak > (ritual.streak || 0)) {
        addStreakAchievementNotification(updatedRitual);
      }
    } finally {
      setIsLoading(false);
    }
  }, [rituals, updatePreferences, addStreakAchievementNotification]);

  const deleteRitual = useCallback(async (ritual: MorningRitual) => {
    setIsLoading(true);
    try {
      const updatedRituals = rituals.filter(r => r.id !== ritual.id);
      await updatePreferences({ morningRituals: updatedRituals });
    } finally {
      setIsLoading(false);
    }
  }, [rituals, updatePreferences]);

  const updateRitual = useCallback(async (updatedRitual: MorningRitual) => {
    setIsLoading(true);
    try {
      const updatedRituals = rituals.map(r => 
        r.id === updatedRitual.id ? updatedRitual : r
      );
      await updatePreferences({ morningRituals: updatedRituals });
    } finally {
      setIsLoading(false);
    }
  }, [rituals, updatePreferences]);

  return {
    rituals,
    isLoading,
    completeRitual,
    deleteRitual,
    updateRitual
  };
};
