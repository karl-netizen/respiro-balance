
import { useState, useCallback, useMemo } from 'react';
import { MorningRitual } from '@/context/types';
import { useUserPreferences } from '@/context';
import { useNotifications } from '@/context/NotificationsProvider';
import { RitualFilters } from '../types';

export const useRitualTimeline = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { addStreakAchievementNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<RitualFilters>({
    status: 'all',
    priority: 'all',
    tags: [],
    timeRange: 'all'
  });

  const rituals = preferences.morningRituals || [];

  const availableTags = useMemo(() => {
    const allTags = rituals.flatMap(ritual => ritual.tags || []);
    return Array.from(new Set(allTags));
  }, [rituals]);

  const sortedRituals = useMemo(() => {
    return [...rituals].sort((a, b) => {
      const timeA = a.timeOfDay.split(':').map(Number);
      const timeB = b.timeOfDay.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
  }, [rituals]);

  const handleFilterChange = useCallback((newFilters: Partial<RitualFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: 'all',
      priority: 'all',
      tags: [],
      timeRange: 'all'
    });
  }, []);

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
    sortedRituals,
    filters,
    availableTags,
    isLoading,
    completeRitual,
    deleteRitual,
    updateRitual,
    handleFilterChange,
    resetFilters
  };
};
