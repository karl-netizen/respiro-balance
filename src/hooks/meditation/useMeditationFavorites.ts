
import { useState, useEffect } from 'react';
import { MeditationSession } from '@/types/meditation';

export const useMeditationFavorites = () => {
  const [favoriteSessions, setFavoriteSessions] = useState<string[]>([]);
  
  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('meditation-favorites');
    if (savedFavorites) {
      try {
        setFavoriteSessions(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing saved favorites:', error);
        setFavoriteSessions([]);
      }
    }
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meditation-favorites', JSON.stringify(favoriteSessions));
  }, [favoriteSessions]);
  
  const handleToggleFavorite = (session: MeditationSession) => {
    setFavoriteSessions(prev => {
      if (prev.includes(session.id)) {
        return prev.filter(id => id !== session.id);
      } else {
        return [...prev, session.id];
      }
    });
  };

  const isFavorite = (sessionId: string) => {
    return favoriteSessions.includes(sessionId);
  };
  
  return {
    favoriteSessions,
    handleToggleFavorite,
    isFavorite
  };
};
