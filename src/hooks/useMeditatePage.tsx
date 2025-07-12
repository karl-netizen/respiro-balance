
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useMeditationNavigation } from './meditation/useMeditationNavigation';
import { useMeditationFavorites } from './meditation/useMeditationFavorites';
import { useMeditationRecentlyPlayed } from './meditation/useMeditationRecentlyPlayed';

export const useMeditatePage = () => {
  const navigate = useNavigate();
  const { isPremium } = useSubscriptionContext();
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use extracted hooks
  const navigation = useMeditationNavigation();
  const favorites = useMeditationFavorites();
  const recentlyPlayed = useMeditationRecentlyPlayed();

  // Fetch meditation content from database
  useEffect(() => {
    const fetchMeditationContent = async () => {
      try {
        const { data, error } = await supabase
          .from('meditation_content')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching meditation content:', error);
          return;
        }

        // Transform database content to MeditationSession format
        const sessions: MeditationSession[] = data.map(content => ({
          id: content.id,
          title: content.title,
          category: content.category,
          difficulty: content.difficulty_level || 'Beginner',
          duration: content.duration,
          instructor: content.instructor || 'Unknown',
          description: content.description || '',
          image_url: content.thumbnail_url || '/placeholder.svg',
          tags: content.tags || [],
          premium: content.subscription_tier !== 'free',
          audio_url: content.audio_file_url,
          session_type: 'guided',
          level: content.difficulty_level || 'beginner'
        }));

        setMeditationSessions(sessions);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeditationContent();
  }, []);

  // Get all meditation sessions available in the system
  const getAllSessions = useCallback((): MeditationSession[] => {
    return meditationSessions;
  }, [meditationSessions]);

  // Get sessions for a specific category
  const getFilteredSessions = useCallback((category: string): MeditationSession[] => {
    if (category === 'all') {
      return meditationSessions;
    } else if (category === 'favorites') {
      return meditationSessions.filter(s => favorites.favoriteSessions.includes(s.id));
    } else {
      return meditationSessions.filter(s => s.category === category);
    }
  }, [meditationSessions, favorites.favoriteSessions]);
  
  const getFavoriteSessions = useCallback((): MeditationSession[] => {
    return meditationSessions.filter(s => favorites.favoriteSessions.includes(s.id));
  }, [meditationSessions, favorites.favoriteSessions]);

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
