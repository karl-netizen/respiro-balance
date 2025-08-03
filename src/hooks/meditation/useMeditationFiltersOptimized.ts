import { useMemo, useCallback } from 'react';
import { MeditationSession } from '@/types/meditation';

interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  selectedDuration: string;
  showFavoritesOnly: boolean;
}

export const useMeditationFiltersOptimized = (
  sessions: MeditationSession[],
  filters: FilterOptions
) => {
  const filteredSessions = useMemo(() => {
    if (!sessions?.length) return [];
    
    return sessions.filter(session => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          session.title.toLowerCase().includes(searchLower) ||
          session.description.toLowerCase().includes(searchLower) ||
          session.instructor?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // Category filter
      if (filters.selectedCategory && session.category !== filters.selectedCategory) {
        return false;
      }
      
      // Duration filter
      if (filters.selectedDuration) {
        const duration = session.duration;
        switch (filters.selectedDuration) {
          case 'short':
            if (duration > 10) return false;
            break;
          case 'medium':
            if (duration <= 10 || duration > 20) return false;
            break;
          case 'long':
            if (duration <= 20) return false;
            break;
        }
      }
      
      // Favorites filter
      if (filters.showFavoritesOnly && !session.favorite) {
        return false;
      }
      
      return true;
    });
  }, [sessions, filters]);
  
  const getSessionsByCategory = useCallback((category: string) => {
    return sessions.filter(session => session.category === category);
  }, [sessions]);
  
  const getFavoriteSessions = useCallback(() => {
    return sessions.filter(session => session.favorite);
  }, [sessions]);
  
  const getRecentSessions = useCallback(() => {
    return sessions
      .filter(session => session.started_at)
      .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      .slice(0, 5);
  }, [sessions]);
  
  return {
    filteredSessions,
    getSessionsByCategory,
    getFavoriteSessions,
    getRecentSessions
  };
};