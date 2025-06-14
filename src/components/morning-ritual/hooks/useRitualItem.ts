
import { useState, useCallback } from 'react';
import { MorningRitual } from '@/context/types';
import { wasCompletedToday } from '../utils';

interface UseRitualItemProps {
  ritual: MorningRitual;
  onComplete: (ritual: MorningRitual) => void;
  onDelete: (ritual: MorningRitual) => void;
}

export const useRitualItem = ({ ritual, onComplete, onDelete }: UseRitualItemProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const isToday = true; // Simplified for now
  const isCompletedToday = wasCompletedToday(ritual.lastCompleted);

  const handleComplete = useCallback(() => {
    onComplete(ritual);
  }, [ritual, onComplete]);

  const handleDelete = useCallback(() => {
    onDelete(ritual);
  }, [ritual, onDelete]);

  return {
    editDialogOpen,
    setEditDialogOpen,
    isToday,
    isCompletedToday,
    handleComplete,
    handleDelete
  };
};
