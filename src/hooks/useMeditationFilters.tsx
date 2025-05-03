
import { useState } from 'react';
import { MeditationSession } from '@/types/meditation';

export const useMeditationFilters = () => {
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  
  const filterSessionsByCategory = (sessions: MeditationSession[], category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    // First filter by category
    let filteredSessions = sessions.filter(session => session.category === category);
    
    // Apply duration filter if set
    if (durationFilter !== null) {
      filteredSessions = filteredSessions.filter(session => {
        switch (durationFilter) {
          case 5:
            return session.duration <= 5;
          case 10:
            return session.duration > 5 && session.duration <= 10;
          case 15:
            return session.duration > 10 && session.duration <= 15;
          case 30:
            return session.duration > 15 && session.duration <= 30;
          case 60:
            return session.duration > 30;
          default:
            return true;
        }
      });
    }
    
    // Apply level filter if set
    if (levelFilter !== null) {
      filteredSessions = filteredSessions.filter(session => session.level === levelFilter);
    }
    
    return filteredSessions;
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
