import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';
import { useSubscription } from '@/components/subscription/SubscriptionProvider';
import { useMeditationNavigation } from './useMeditationNavigation';
import { useMeditationRecentlyPlayed } from './useMeditationRecentlyPlayed';

export const useMeditationActions = () => {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const navigation = useMeditationNavigation();
  const recentlyPlayed = useMeditationRecentlyPlayed();

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

  const handleSessionSelect = useCallback((session: MeditationSession) => {
    navigation.handleSelectSession(session);
  }, [navigation]);

  const handleSessionPlayback = useCallback((session: MeditationSession) => {
    // For immediate playback without checks
    recentlyPlayed.addToRecentlyPlayed(session);
    navigation.handleStartMeditation(session);
  }, [recentlyPlayed, navigation]);

  return {
    handleStartMeditation,
    handleSessionSelect,
    handleSessionPlayback,
    isPremium,
    ...navigation,
    ...recentlyPlayed
  };
};