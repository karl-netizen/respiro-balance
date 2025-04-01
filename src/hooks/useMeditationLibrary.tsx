
import { useState } from 'react';
import { MeditationSession } from '@/components/meditation/MeditationSessionCard';
import { useMeditationSessions } from './useMeditationSessions';
import { useMeditationFavorites } from './useMeditationFavorites';
import { useRecentlyPlayedSessions } from './useRecentlyPlayedSessions';
import { useMeditationRatings } from './useMeditationRatings';
import { useMeditationFilters } from './useMeditationFilters';
import { meditationSessions } from '@/data/meditationSessions';

export const useMeditationLibrary = () => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const { startSession, completeSession, isStarting } = useMeditationSessions();
  
  // Use the smaller, focused hooks
  const { favorites, isFavorite, handleToggleFavorite, getFavoriteSessions } = 
    useMeditationFavorites(meditationSessions);
  
  const { recentlyPlayed, addToRecentlyPlayed } = 
    useRecentlyPlayedSessions(meditationSessions);
  
  const { showRatingDialog, setShowRatingDialog, handleSubmitRating } = 
    useMeditationRatings();
  
  const { durationFilter, setDurationFilter, levelFilter, setLevelFilter, 
    filterSessionsByCategory: filterByCategory, resetFilters } = 
    useMeditationFilters();
  
  const handleSelectSession = async (session: MeditationSession) => {
    setSelectedSession(session);
    
    // Add to recently played
    addToRecentlyPlayed(session);
    
    // Start the session in the backend
    await startSession({ 
      sessionType: session.category, 
      duration: session.duration 
    });
  };
  
  const handleCompleteSession = async (sessionId: string) => {
    await completeSession(sessionId);
    setShowRatingDialog(true);
  };
  
  const filterSessionsByCategory = (category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    return filterByCategory(meditationSessions, category);
  };

  return {
    meditationSessions,
    selectedSession,
    setSelectedSession,
    handleSelectSession,
    handleCompleteSession,
    filterSessionsByCategory,
    isStarting,
    favorites,
    isFavorite,
    handleToggleFavorite,
    getFavoriteSessions,
    recentlyPlayed,
    showRatingDialog,
    setShowRatingDialog,
    handleSubmitRating,
    durationFilter,
    setDurationFilter,
    levelFilter,
    setLevelFilter,
    resetFilters
  };
};
