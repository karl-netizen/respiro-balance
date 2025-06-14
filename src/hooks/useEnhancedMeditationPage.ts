
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeditationSession, FilterState } from '@/types/meditation';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { useMeditationFavorites } from '@/hooks/useMeditationFavorites';
import { useMeditationResume } from '@/hooks/useMeditationResume';

export const useEnhancedMeditationPage = () => {
  const navigate = useNavigate();
  const { sessions, isLoading } = useMeditationSessions();
  const { favorites, toggleFavorite, removeFavorites, getFavoriteSessions } = useMeditationFavorites();
  const { 
    canResume, 
    getResumeTime, 
    getProgressPercentage, 
    markCompleted,
    getIncompleteSessions: getIncompleteSessionsHook
  } = useMeditationResume();

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    durations: [],
    levels: [],
    instructors: [],
    tags: [],
    searchTerm: ''
  });

  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get incomplete sessions for resume functionality
  const incompleteSessions = useMemo(() => {
    return getIncompleteSessionsHook(sessions);
  }, [sessions, getIncompleteSessionsHook]);

  // Get favorite sessions data
  const favoriteSessionsData = useMemo(() => {
    return getFavoriteSessions(sessions);
  }, [sessions, getFavoriteSessions]);

  // Filter sessions based on current filter state
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(session.category)) {
        return false;
      }

      // Duration filter
      if (filters.durations.length > 0) {
        const durationMatch = filters.durations.some(duration => {
          switch (duration) {
            case 'under-5':
              return session.duration < 5;
            case '5-10':
              return session.duration >= 5 && session.duration <= 10;
            case '10-15':
              return session.duration >= 10 && session.duration <= 15;
            case '15-30':
              return session.duration >= 15 && session.duration <= 30;
            case '30-plus':
              return session.duration > 30;
            default:
              return true;
          }
        });
        if (!durationMatch) return false;
      }

      // Level filter
      if (filters.levels.length > 0 && session.level && !filters.levels.includes(session.level)) {
        return false;
      }

      // Instructor filter
      if (filters.instructors.length > 0 && !filters.instructors.includes(session.instructor)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = session.tags?.some(tag => filters.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          session.title.toLowerCase().includes(searchLower) ||
          session.description.toLowerCase().includes(searchLower) ||
          session.instructor.toLowerCase().includes(searchLower) ||
          session.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [sessions, filters]);

  const hasActiveFilters = (
    filters.categories.length > 0 || 
    filters.durations.length > 0 || 
    filters.levels.length > 0 || 
    filters.instructors.length > 0 || 
    filters.tags.length > 0 || 
    filters.searchTerm
  );

  const handleSessionSelect = (session: MeditationSession) => {
    setSelectedSession(session);
    setIsPlaying(false);
  };

  const handleSessionComplete = () => {
    if (selectedSession) {
      markCompleted(selectedSession.id);
      setShowCompletionDialog(true);
      setIsPlaying(false);
    }
  };

  const handleCompletionClose = () => {
    setShowCompletionDialog(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      durations: [],
      levels: [],
      instructors: [],
      tags: [],
      searchTerm: ''
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  const handleRemoveFavorites = (sessionIds: string[]) => {
    removeFavorites(sessionIds);
  };

  return {
    // Data
    sessions,
    isLoading,
    filteredSessions,
    incompleteSessions,
    favoriteSessionsData,
    favorites,
    filters,
    selectedSession,
    showCompletionDialog,
    isPlaying,
    hasActiveFilters,
    
    // Functions
    canResume,
    getResumeTime,
    getProgressPercentage,
    toggleFavorite,
    handleSessionSelect,
    handleSessionComplete,
    handleCompletionClose,
    handlePlay,
    handlePause,
    handleFiltersChange,
    clearAllFilters,
    formatDuration,
    handleRemoveFavorites
  };
};
