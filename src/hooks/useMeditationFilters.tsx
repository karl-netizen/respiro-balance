
import { useState } from 'react';
import { MeditationSession } from '@/types/meditation';

export const useMeditationFilters = () => {
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  
  const applyFilters = (sessions: MeditationSession[]) => {
    let filteredSessions = [...sessions];
    
    // Apply duration filter if set
    if (durationFilter !== null) {
      filteredSessions = filteredSessions.filter(session => {
        switch (durationFilter) {
          case 5:
            return session.duration < 5; // Less than 5 minutes
          case 10:
            return session.duration >= 5 && session.duration < 10; // 5-10 minutes
          case 15:
            return session.duration >= 10 && session.duration < 15; // 10-15 minutes
          case 30:
            return session.duration >= 15 && session.duration <= 30; // 15-30 minutes
          case 60:
            return session.duration > 30; // Greater than 30 minutes
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
  
  const filterSessionsByCategory = (sessions: MeditationSession[], category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    // First filter by category
    const categoryFilteredSessions = sessions.filter(session => session.category === category);
    
    // Then apply duration and level filters
    return applyFilters(categoryFilteredSessions);
  };
  
  // This function filters all sessions without restricting by category
  const filterAllSessions = (sessions: MeditationSession[]) => {
    return applyFilters(sessions);
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
    filterAllSessions,
    resetFilters
  };
};
