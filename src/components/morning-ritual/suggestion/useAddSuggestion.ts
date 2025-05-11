
import { useState, useCallback } from 'react';
import { RitualSuggestion } from './types';
import { MorningRitual, RitualStatus } from '@/context/types';
import { useMorningRituals } from '@/hooks/useMorningRituals';
import { generateId } from '@/lib/utils';
import { toast } from 'sonner';

export function useAddSuggestion() {
  const { addRitual } = useMorningRituals();
  const [isAdding, setIsAdding] = useState(false);

  const addSuggestion = useCallback(async (ritual: RitualSuggestion) => {
    setIsAdding(true);
    
    try {
      // Convert suggestion to morning ritual
      const newRitual: MorningRitual = {
        id: generateId(),
        title: ritual.title,
        description: ritual.description,
        timeOfDay: ritual.timeOfDay || 'Morning',
        duration: ritual.duration,
        status: "planned" as RitualStatus,
        recurrence: ritual.recurrence || 'daily',
        priority: ritual.priority || 'medium',
        streak: 0,
        tags: ritual.tags,
        createdAt: new Date().toISOString()
      };
      
      // Add to collection
      addRitual(newRitual);
      
      toast.success('Ritual added', {
        description: `"${ritual.title}" has been added to your morning rituals.`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to add ritual:', error);
      toast.error('Failed to add ritual', {
        description: 'Something went wrong. Please try again.',
      });
      return Promise.reject(error);
    } finally {
      setIsAdding(false);
    }
  }, [addRitual]);

  return { addSuggestion, isAdding };
}
