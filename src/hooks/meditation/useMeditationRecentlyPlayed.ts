
import { useState, useEffect } from 'react';
import { MeditationSession } from '@/types/meditation';

export const useMeditationRecentlyPlayed = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<MeditationSession[]>([]);
  
  // Load recently played from localStorage on mount
  useEffect(() => {
    const savedRecent = localStorage.getItem('meditation-recently-played');
    if (savedRecent) {
      try {
        const recentSessions = JSON.parse(savedRecent);
        setRecentlyPlayed(recentSessions);
      } catch (error) {
        console.error('Error parsing saved recently played:', error);
        setRecentlyPlayed([]);
      }
    }
  }, []);
  
  // Save recently played to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meditation-recently-played', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);
  
  const addToRecentlyPlayed = (session: MeditationSession) => {
    setRecentlyPlayed(prev => {
      // Remove if already exists
      const filtered = prev.filter(s => s.id !== session.id);
      // Add to beginning and limit to 4 items
      return [session, ...filtered].slice(0, 4);
    });
  };
  
  const getRecentSessions = () => {
    return recentlyPlayed;
  };
  
  return {
    recentlyPlayed,
    addToRecentlyPlayed,
    getRecentSessions
  };
};
