
import { useState, useEffect } from 'react';
import { MeditationSession } from '@/types/meditation';

export const useMeditationFavorites = (allSessions: MeditationSession[]) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('meditationFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing saved favorites:', error);
        setFavorites([]);
      }
    }
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meditationFavorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const handleToggleFavorite = (session: MeditationSession) => {
    setFavorites(prev => {
      if (prev.includes(session.id)) {
        return prev.filter(id => id !== session.id);
      } else {
        return [...prev, session.id];
      }
    });
  };
  
  const isFavorite = (sessionId: string) => {
    return favorites.includes(sessionId);
  };
  
  const getFavoriteSessions = () => {
    return allSessions.filter(session => favorites.includes(session.id));
  };
  
  return {
    favorites,
    isFavorite,
    handleToggleFavorite,
    getFavoriteSessions
  };
};
