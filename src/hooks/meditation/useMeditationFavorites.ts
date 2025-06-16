
import { useCallback } from 'react';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';
import { useSessionStorage } from './useSessionStorage';

export const useMeditationFavorites = () => {
  const [favoriteSessions, setFavoriteSessions] = useSessionStorage<string[]>('favoriteSessions', []);
  
  const handleToggleFavorite = useCallback((session: MeditationSession) => {
    if (favoriteSessions.includes(session.id)) {
      setFavoriteSessions(favoriteSessions.filter(id => id !== session.id));
      toast.info(`Removed "${session.title}" from favorites`);
    } else {
      setFavoriteSessions([...favoriteSessions, session.id]);
      toast.success(`Added "${session.title}" to favorites`);
    }
  }, [favoriteSessions, setFavoriteSessions]);
  
  const isFavorite = useCallback((sessionId: string): boolean => {
    return favoriteSessions.includes(sessionId);
  }, [favoriteSessions]);

  return {
    favoriteSessions,
    handleToggleFavorite,
    isFavorite
  };
};
