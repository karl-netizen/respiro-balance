
import { useState, useEffect } from 'react';
import { MeditationSession } from '@/components/meditation/MeditationSessionCard';

export const useRecentlyPlayedSessions = (allSessions: MeditationSession[]) => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<MeditationSession[]>([]);
  
  // Load recently played from localStorage on mount
  useEffect(() => {
    const savedRecent = localStorage.getItem('recentlyPlayedMeditations');
    if (savedRecent) {
      try {
        const recentIds = JSON.parse(savedRecent) as string[];
        const recentSessions = recentIds
          .map(id => allSessions.find(session => session.id === id))
          .filter((session): session is MeditationSession => session !== undefined);
        setRecentlyPlayed(recentSessions);
      } catch (error) {
        console.error('Error parsing saved recently played:', error);
        setRecentlyPlayed([]);
      }
    }
  }, [allSessions]);
  
  // Save recently played to localStorage whenever they change
  useEffect(() => {
    const recentIds = recentlyPlayed.map(session => session.id);
    localStorage.setItem('recentlyPlayedMeditations', JSON.stringify(recentIds));
  }, [recentlyPlayed]);
  
  const addToRecentlyPlayed = (session: MeditationSession) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== session.id);
      return [session, ...filtered].slice(0, 4);
    });
  };
  
  return {
    recentlyPlayed,
    addToRecentlyPlayed
  };
};
