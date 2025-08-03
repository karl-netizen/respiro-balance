import { useMeditationData } from './useMeditationData';
import { useMeditationFiltering } from './useMeditationFiltering';
import { useMeditationActions } from './useMeditationActions';
import { useMeditationFavorites } from '../useMeditationFavorites';

/**
 * Composed hook that provides all meditation page functionality
 * This replaces the monolithic useMeditatePage hook
 */
export const useMeditationPageComposed = () => {
  // Data fetching
  const { 
    sessions, 
    isLoading, 
    error, 
    getAllSessions, 
    refetchSessions 
  } = useMeditationData();

  // Favorites management
  const favoritesHook = useMeditationFavorites();

  // Filtering logic - use the favorites array from the hook
  const filtering = useMeditationFiltering(sessions, favoritesHook.favorites);

  // Actions and navigation
  const actions = useMeditationActions();

  return {
    // Data
    sessions,
    isLoading,
    error,
    getAllSessions,
    refetchSessions,
    
    // Filtering
    ...filtering,
    
    // Favorites (with expected interface)
    ...favoritesHook,
    handleToggleFavorite: favoritesHook.toggleFavorite, // Alias for backward compatibility
    
    // Actions
    ...actions
  };
};