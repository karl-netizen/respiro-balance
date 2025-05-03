
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { meditationSessions } from '@/data/meditationSessions';

export const useMeditatePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteSessions, setFavoriteSessions] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const { isPremium } = useSubscriptionContext();
  
  // Get tab from URL or default to 'guided'
  const initialTab = searchParams.get('tab') || 'guided';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };
  
  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteSessions');
    if (storedFavorites) {
      setFavoriteSessions(JSON.parse(storedFavorites));
    }
    
    const storedRecent = localStorage.getItem('recentlyPlayedSessions');
    if (storedRecent) {
      setRecentlyPlayed(JSON.parse(storedRecent));
    }
  }, []);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favoriteSessions', JSON.stringify(favoriteSessions));
  }, [favoriteSessions]);
  
  useEffect(() => {
    localStorage.setItem('recentlyPlayedSessions', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);
  
  const handleSelectSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };
  
  const handleToggleFavorite = (session: MeditationSession) => {
    if (favoriteSessions.includes(session.id)) {
      setFavoriteSessions(favoriteSessions.filter(id => id !== session.id));
      toast.info(`Removed "${session.title}" from favorites`);
    } else {
      setFavoriteSessions([...favoriteSessions, session.id]);
      toast.success(`Added "${session.title}" to favorites`);
    }
  };
  
  const isFavorite = (sessionId: string): boolean => {
    return favoriteSessions.includes(sessionId);
  };
  
  const addToRecentlyPlayed = (session: MeditationSession) => {
    setRecentlyPlayed(prev => {
      // Remove if already exists (to move it to the front)
      const filtered = prev.filter(id => id !== session.id);
      // Add to front and limit to 5
      return [session.id, ...filtered].slice(0, 5);
    });
  };

  // Get sessions for a specific category - updated to handle all sessions
  const getFilteredSessions = useCallback((category: string): MeditationSession[] => {
    return meditationSessions.filter(s => s.category === category);
  }, []);
  
  const getRecentSessions = useCallback((): MeditationSession[] => {
    return recentlyPlayed
      .map(id => meditationSessions.find(s => s.id === id))
      .filter(s => s !== undefined) as MeditationSession[];
  }, [recentlyPlayed]);
  
  const getFavoriteSessions = useCallback((): MeditationSession[] => {
    return meditationSessions.filter(s => favoriteSessions.includes(s.id));
  }, [favoriteSessions]);

  const handleStartMeditation = (session: MeditationSession) => {
    // Check if session is premium and user doesn't have premium
    if (session.premium && !isPremium) {
      // Show premium upsell instead of starting session
      toast.error("This is a premium session", {
        description: "Upgrade your subscription to access premium content",
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = '/subscription'
        }
      });
      return;
    }
    
    // Add to recently played
    addToRecentlyPlayed(session);
    
    // Direct to meditation session page
    window.location.href = `/meditate/session/${session.id}`;
  };

  return {
    activeTab,
    handleTabChange,
    selectedSession,
    setSelectedSession,
    dialogOpen,
    setDialogOpen,
    isFavorite,
    handleToggleFavorite,
    handleSelectSession,
    handleStartMeditation,
    getFilteredSessions,
    getRecentSessions,
    getFavoriteSessions,
    isPremium
  };
};
