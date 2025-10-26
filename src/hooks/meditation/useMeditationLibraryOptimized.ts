import { useState, useMemo, useCallback } from 'react';
import { useTransformedMeditationSessions } from './useMeditationQuery';
import { useMeditationFiltersOptimized } from './useMeditationFiltersOptimized';
import { useMeditationFavorites } from '../useMeditationFavorites';

export const useMeditationLibraryOptimized = () => {
  const { sessions, userPreferences, isLoading, error } = useTransformedMeditationSessions();
  const { favorites, isFavorite, toggleFavorite, removeFavorites, getFavoriteSessions } = useMeditationFavorites();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const filterOptions = useMemo(() => ({
    searchTerm,
    selectedCategory,
    selectedDuration,
    showFavoritesOnly
  }), [searchTerm, selectedCategory, selectedDuration, showFavoritesOnly]);
  
  const {
    filteredSessions,
    getSessionsByCategory,
    getRecentSessions
  } = useMeditationFiltersOptimized(sessions, filterOptions);

  // Memoized favorite sessions
  const favoriteSessions = useMemo(() => {
    return getFavoriteSessions(sessions);
  }, [sessions, getFavoriteSessions]);

  // Optimized category getters with memoization
  const getSessionsForCategory = useCallback((category: string) => {
    return sessions.filter(session => session.category === category);
  }, [sessions]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDuration('');
    setShowFavoritesOnly(false);
  }, []);

  return {
    // Data
    sessions: filteredSessions,
    allSessions: sessions,
    favorites,
    favoriteSessions,
    userPreferences,
    
    // Loading states
    isLoading,
    error,
    
    // Filter state
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedDuration,
    setSelectedDuration,
    showFavoritesOnly,
    setShowFavoritesOnly,
    
    // Actions
    isFavorite,
    toggleFavorite,
    removeFavorites,
    clearFilters,
    
    // Optimized getters
    getSessionsByCategory,
    getSessionsForCategory,
    getRecentSessions,
  };
};