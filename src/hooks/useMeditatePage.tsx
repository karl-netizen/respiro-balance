
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';
import { useSubscriptionContext } from '@/context/SubscriptionProvider';
import { meditationSessions } from '@/data/meditationSessions';
import { useMeditationNavigation } from './meditation/useMeditationNavigation';
import { useMeditationFavorites } from './meditation/useMeditationFavorites';
import { useMeditationRecentlyPlayed } from './meditation/useMeditationRecentlyPlayed';

export const useMeditatePage = () => {
  const navigate = useNavigate();
  const { isPremium } = useSubscriptionContext();
  
  // Use extracted hooks
  const navigation = useMeditationNavigation();
  const favorites = useMeditationFavorites();
  const recentlyPlayed = useMeditationRecentlyPlayed();

  // Get all meditation sessions available in the system
  const getAllSessions = useCallback((): MeditationSession[] => {
    return meditationSessions;
  }, []);

  // Get sessions for a specific category
  const getFilteredSessions = useCallback((category: string): MeditationSession[] => {
    if (category === 'all') {
      return meditationSessions;
    } else if (category === 'favorites') {
      return meditationSessions.filter(s => favorites.favoriteSessions.includes(s.id));
    } else {
      return meditationSessions.filter(s => s.category === category);
    }
  }, [favorites.favoriteSessions]);
  
  const getFavoriteSessions = useCallback((): MeditationSession[] => {
    return meditationSessions.filter(s => favorites.favoriteSessions.includes(s.id));
  }, [favorites.favoriteSessions]);

  const handleStartMeditation = useCallback((session: MeditationSession) => {
    // Check if session is premium and user doesn't have premium
    if (session.premium && !isPremium) {
      toast.error("This is a premium session", {
        description: "Upgrade your subscription to access premium content",
        action: {
          label: "Upgrade",
          onClick: () => navigate('/subscription')
        }
      });
      return;
    }
    
    // Add to recently played
    recentlyPlayed.addToRecentlyPlayed(session);
    
    // Start the session
    navigation.handleStartMeditation(session);
  }, [isPremium, navigate, recentlyPlayed, navigation]);

  return {
    ...navigation,
    ...favorites,
    ...recentlyPlayed,
    getAllSessions,
    getFilteredSessions,
    getFavoriteSessions,
    handleStartMeditation,
    isPremium
  };
};
