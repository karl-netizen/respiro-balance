
import { useCallback } from 'react';
import { MeditationSession } from '@/types/meditation';
import { meditationSessions } from '@/data/meditationSessions';
import { useSessionStorage } from './useSessionStorage';

export const useMeditationRecentlyPlayed = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useSessionStorage<string[]>('recentlyPlayedSessions', []);
  
  const addToRecentlyPlayed = useCallback((session: MeditationSession) => {
    setRecentlyPlayed((prev: string[]) => {
      const filtered = prev.filter(id => id !== session.id);
      return [session.id, ...filtered].slice(0, 5);
    });
  }, [setRecentlyPlayed]);

  const getRecentSessions = useCallback((): MeditationSession[] => {
    return recentlyPlayed
      .map(id => meditationSessions.find(s => s.id === id))
      .filter(s => s !== undefined) as MeditationSession[];
  }, [recentlyPlayed]);

  return {
    recentlyPlayed,
    addToRecentlyPlayed,
    getRecentSessions
  };
};
