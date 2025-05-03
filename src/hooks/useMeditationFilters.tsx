
import { useState } from 'react';
import { MeditationSession } from '@/types/meditation';

export const useMeditationFilters = () => {
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  
  const filterSessionsByCategory = (sessions: MeditationSession[], category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    return sessions
      .filter(session => session.category === category)
      .filter(session => {
        // Apply duration filter
        if (durationFilter === null) return true;
        
        if (durationFilter === 5) {
          return session.duration <= 5;
        } else if (durationFilter === 10) {
          return session.duration > 5 && session.duration <= 10;
        } else if (durationFilter === 15) {
          return session.duration > 10 && session.duration <= 15;
        } else if (durationFilter === 30) {
          return session.duration > 15 && session.duration <= 30;
        } else {
          return session.duration > 30;
        }
      })
      .filter(session => {
        // Apply level filter if set
        return levelFilter === null || session.level === levelFilter;
      });
  };
  
  const resetFilters = () => {
    setDurationFilter(null);
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
