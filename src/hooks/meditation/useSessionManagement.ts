
import { useState, useMemo } from 'react';
import { MeditationSession, SessionProgress } from '../useEnhancedMeditationPage';

export const useSessionManagement = (sessions: MeditationSession[]) => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [progress, setProgress] = useState<Record<string, SessionProgress>>({});

  // Get recent sessions (sessions with progress)
  const recentSessions = useMemo(() => {
    return sessions.filter(session => 
      progress[session.id] && !progress[session.id].completed
    ).slice(0, 5);
  }, [sessions, progress]);

  // Get completed sessions
  const completedSessions = useMemo(() => {
    return sessions.filter(session => 
      progress[session.id]?.completed
    ).slice(0, 10);
  }, [sessions, progress]);

  // Get favorite sessions
  const favoritesList = useMemo(() => {
    return sessions.filter(session => favorites.has(session.id));
  }, [sessions, favorites]);

  // Toggle favorite status
  const toggleFavorite = (sessionId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(sessionId)) {
        newFavorites.delete(sessionId);
      } else {
        newFavorites.add(sessionId);
      }
      return newFavorites;
    });
  };

  // Handle session selection
  const handleSessionSelect = (session: MeditationSession) => {
    setSelectedSession(session);
    setCurrentTime(progress[session.id]?.progress || 0);
  };

  // Handle session completion
  const handleSessionComplete = (sessionId: string) => {
    setProgress(prev => ({
      ...prev,
      [sessionId]: {
        sessionId,
        progress: 100,
        lastPlayedAt: new Date(),
        completed: true
      }
    }));
  };

  // Handle session resume
  const handleSessionResume = (session: MeditationSession) => {
    setSelectedSession(session);
    setCurrentTime(progress[session.id]?.progress || 0);
  };

  return {
    selectedSession,
    setSelectedSession,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    favorites,
    toggleFavorite,
    viewMode,
    setViewMode,
    progress,
    setProgress,
    recentSessions,
    completedSessions,
    favoritesList,
    handleSessionSelect,
    handleSessionComplete,
    handleSessionResume
  };
};
