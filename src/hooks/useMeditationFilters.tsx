
import { useState } from 'react';
import { MeditationSession } from '@/components/meditation/MeditationSessionCard';

export const useMeditationFilters = () => {
  const [durationFilter, setDurationFilter] = useState<[number, number]>([1, 60]);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  
  const filterSessionsByCategory = (sessions: MeditationSession[], category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    return sessions
      .filter(session => session.category === category)
      .filter(session => {
        // Apply duration filter
        const meetsMinDuration = session.duration >= durationFilter[0];
        const meetsMaxDuration = session.duration <= durationFilter[1];
        
        // Apply level filter if set
        const meetsLevelFilter = levelFilter === null || session.level === levelFilter;
        
        return meetsMinDuration && meetsMaxDuration && meetsLevelFilter;
      });
  };
  
  const resetFilters = () => {
    setDurationFilter([1, 60]);
    setLevelFilter(null);
  };
  
  return {
    durationFilter,
    setDurationFilter,
    levelFilter,
    setLevelFilter,
    filterSessionsByCategory,
    resetFilters
  };
};
