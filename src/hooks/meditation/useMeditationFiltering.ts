import { useCallback, useMemo } from 'react';
import { MeditationSession } from '@/types/meditation';

// Category mapping for filtering sessions
const CATEGORY_MAPPING = {
  'guided': ['Mindfulness', 'Loving Kindness', 'Body Scan', 'Breathing'],
  'quick': ['Focus', 'Energy'], 
  'deep': ['Stress Relief'],
  'sleep': ['Sleep']
};

export const useMeditationFiltering = (
  sessions: MeditationSession[],
  favoriteSessionIds: string[] = []
) => {
  
  const getFilteredSessions = useCallback((category: string): MeditationSession[] => {
    if (category === 'all') {
      return sessions;
    } 
    
    if (category === 'favorites') {
      return sessions.filter(s => favoriteSessionIds.includes(s.id));
    }
    
    // Use category mapping
    const mappedCategories = CATEGORY_MAPPING[category as keyof typeof CATEGORY_MAPPING] || [];
    
    if (mappedCategories.length === 0) {
      // Direct match fallback
      return sessions.filter(s => 
        s?.category?.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    return sessions.filter(s => 
      mappedCategories.includes(s?.category)
    );
  }, [sessions, favoriteSessionIds]);
  
  const getFavoriteSessions = useCallback((): MeditationSession[] => {
    return sessions.filter(s => favoriteSessionIds.includes(s.id));
  }, [sessions, favoriteSessionIds]);

  const getSessionsByCategory = useCallback((category: keyof typeof CATEGORY_MAPPING) => {
    const mappedCategories = CATEGORY_MAPPING[category];
    return sessions.filter(s => mappedCategories.includes(s?.category));
  }, [sessions]);

  const availableCategories = useMemo(() => {
    return [...new Set(sessions.map(s => s.category))];
  }, [sessions]);

  return {
    getFilteredSessions,
    getFavoriteSessions,
    getSessionsByCategory,
    availableCategories,
    categoryMapping: CATEGORY_MAPPING
  };
};