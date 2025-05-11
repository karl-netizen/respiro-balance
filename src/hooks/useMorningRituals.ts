
import { useState, useEffect, useCallback } from 'react';
import { MorningRitual } from '@/context/types';

export function useMorningRituals() {
  const [rituals, setRituals] = useState<MorningRitual[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load rituals from localStorage
  useEffect(() => {
    const loadRituals = () => {
      const savedRituals = localStorage.getItem('morningRituals');
      setRituals(savedRituals ? JSON.parse(savedRituals) : []);
      setIsLoading(false);
    };
    
    loadRituals();
  }, []);

  // Save rituals to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('morningRituals', JSON.stringify(rituals));
    }
  }, [rituals, isLoading]);

  // Add a new ritual
  const addRitual = useCallback((ritual: MorningRitual) => {
    setRituals(prev => [...prev, ritual]);
  }, []);

  // Update an existing ritual
  const updateRitual = useCallback((updatedRitual: MorningRitual) => {
    setRituals(prev => 
      prev.map(ritual => 
        ritual.id === updatedRitual.id ? updatedRitual : ritual
      )
    );
  }, []);

  // Delete a ritual
  const deleteRitual = useCallback((id: string) => {
    setRituals(prev => prev.filter(ritual => ritual.id !== id));
  }, []);

  return {
    rituals,
    isLoading,
    addRitual,
    updateRitual,
    deleteRitual
  };
}
