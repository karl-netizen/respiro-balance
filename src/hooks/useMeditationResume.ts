
import { useState, useEffect } from 'react';
import { MeditationSession } from '@/types/meditation';

interface SessionProgress {
  sessionId: string;
  currentTime: number;
  totalDuration: number;
  lastPlayed: Date;
  completed: boolean;
}

export const useMeditationResume = () => {
  const [sessionProgress, setSessionProgress] = useState<Map<string, SessionProgress>>(new Map());

  // Load session progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('meditationSessionProgress');
    if (savedProgress) {
      try {
        const progressArray: SessionProgress[] = JSON.parse(savedProgress);
        const progressMap = new Map(progressArray.map(p => [p.sessionId, p]));
        setSessionProgress(progressMap);
      } catch (error) {
        console.error('Error loading session progress:', error);
      }
    }
  }, []);

  // Save session progress to localStorage whenever it changes
  useEffect(() => {
    const progressArray = Array.from(sessionProgress.values());
    localStorage.setItem('meditationSessionProgress', JSON.stringify(progressArray));
  }, [sessionProgress]);

  const saveProgress = (
    sessionId: string,
    currentTime: number,
    totalDuration: number,
    completed: boolean = false
  ) => {
    const progress: SessionProgress = {
      sessionId,
      currentTime,
      totalDuration,
      lastPlayed: new Date(),
      completed
    };

    setSessionProgress(prev => new Map(prev.set(sessionId, progress)));
  };

  const getProgress = (sessionId: string): SessionProgress | null => {
    return sessionProgress.get(sessionId) || null;
  };

  const getResumeTime = (sessionId: string): number => {
    const progress = getProgress(sessionId);
    if (!progress || progress.completed) return 0;
    
    // Don't resume if less than 30 seconds or more than 90% complete
    const progressPercentage = (progress.currentTime / progress.totalDuration) * 100;
    if (progress.currentTime < 30 || progressPercentage > 90) return 0;
    
    return progress.currentTime;
  };

  const canResume = (sessionId: string): boolean => {
    return getResumeTime(sessionId) > 0;
  };

  const markCompleted = (sessionId: string) => {
    const progress = getProgress(sessionId);
    if (progress) {
      saveProgress(sessionId, progress.totalDuration, progress.totalDuration, true);
    }
  };

  const clearProgress = (sessionId: string) => {
    setSessionProgress(prev => {
      const newMap = new Map(prev);
      newMap.delete(sessionId);
      return newMap;
    });
  };

  const getIncompleteSessions = (sessions: MeditationSession[]): MeditationSession[] => {
    return sessions.filter(session => {
      const progress = getProgress(session.id);
      return progress && !progress.completed && canResume(session.id);
    });
  };

  const getProgressPercentage = (sessionId: string): number => {
    const progress = getProgress(sessionId);
    if (!progress) return 0;
    return Math.round((progress.currentTime / progress.totalDuration) * 100);
  };

  // Clean up old progress (older than 30 days)
  const cleanupOldProgress = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setSessionProgress(prev => {
      const newMap = new Map();
      prev.forEach((progress, sessionId) => {
        if (progress.lastPlayed > thirtyDaysAgo) {
          newMap.set(sessionId, progress);
        }
      });
      return newMap;
    });
  };

  // Auto-cleanup on mount
  useEffect(() => {
    cleanupOldProgress();
  }, []);

  return {
    saveProgress,
    getProgress,
    getResumeTime,
    canResume,
    markCompleted,
    clearProgress,
    getIncompleteSessions,
    getProgressPercentage,
    cleanupOldProgress
  };
};
