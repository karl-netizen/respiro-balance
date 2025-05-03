
import { useState } from 'react';
import { MeditationSession } from '@/types/meditation';
import { useMeditationSessions } from './useMeditationSessions';
import { useMeditationFavorites } from './useMeditationFavorites';
import { useRecentlyPlayedSessions } from './useRecentlyPlayedSessions';
import { useMeditationRatings } from './useMeditationRatings';
import { useMeditationFilters } from './useMeditationFilters';
import { useMeditationAudio } from './useMeditationAudio';
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
  
  const { durationFilter, setDurationFilter,
    filterSessionsByCategory: filterByCategory, resetFilters } = 
    useMeditationFilters();
    
  // Integrate audio with meditation sessions
  const { sessionsWithAudio, audioEnabled, audioFiles } = useMeditationAudio(meditationSessions);
  
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
    // Use sessions with audio if available
    const sessionsToFilter = audioEnabled ? sessionsWithAudio : meditationSessions;
    return filterByCategory(sessionsToFilter, category);
  };
  
  const getSessionWithAudio = (sessionId: string): MeditationSession | undefined => {
    return sessionsWithAudio.find(session => session.id === sessionId);
  };

  return {
    meditationSessions: audioEnabled ? sessionsWithAudio : meditationSessions,
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
    resetFilters,
    audioEnabled,
    audioFiles,
    getSessionWithAudio
  };
};
