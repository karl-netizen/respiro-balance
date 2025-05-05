
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { meditationSessions } from '@/data/meditationSessions';

// Custom hook for session storage
const useSessionStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useMeditatePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Using session storage for persistence
  const [favoriteSessions, setFavoriteSessions] = useSessionStorage<string[]>('favoriteSessions', []);
  const [recentlyPlayed, setRecentlyPlayed] = useSessionStorage<string[]>('recentlyPlayedSessions', []);
  
  const { isPremium } = useSubscriptionContext();
  
  // Get tab from URL or default to 'guided'
  const initialTab = searchParams.get('tab') || 'guided';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Sync activeTab with URL parameter on component mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    } else if (!tabParam && activeTab !== 'guided') {
      // If no tab in URL but we have an active tab, set it in URL
      setSearchParams({ tab: activeTab });
    }
  }, [searchParams, activeTab, setSearchParams]);
  
  // Check for session ID in URL on component mount
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId) {
      const session = meditationSessions.find(s => s.id === sessionId);
      if (session) {
        handleSelectSession(session);
      }
    }
  }, [searchParams]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };
  
  const handleSelectSession = (session: MeditationSession) => {
    // Set in local state first to ensure immediate UI update
    setSelectedSession(session);
    // Use setTimeout to ensure state update completes
    setTimeout(() => {
      setDialogOpen(true);
    }, 0);
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
    // Fix the type error by using session.id in the state update function
    setRecentlyPlayed((prev: string[]) => {
      // Remove if already exists (to move it to the front)
      const filtered = prev.filter(id => id !== session.id);
      // Add to front and limit to 5
      return [session.id, ...filtered].slice(0, 5);
    });
  };

  // Get all meditation sessions available in the system
  const getAllSessions = useCallback((): MeditationSession[] => {
    return meditationSessions;
  }, []);

  // Get sessions for a specific category - returns all sessions for the given category
  const getFilteredSessions = useCallback((category: string): MeditationSession[] => {
    if (category === 'all') {
      return meditationSessions;
    } else if (category === 'favorites') {
      return meditationSessions.filter(s => favoriteSessions.includes(s.id));
    } else {
      return meditationSessions.filter(s => s.category === category);
    }
  }, [favoriteSessions]);
  
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
          onClick: () => navigate('/subscription')
        }
      });
      return;
    }
    
    // Add to recently played
    addToRecentlyPlayed(session);
    
    // Close the dialog
    setDialogOpen(false);
    
    // Direct to meditation session page
    navigate(`/meditate/session/${session.id}`);
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
    getAllSessions,
    getFilteredSessions,
    getRecentSessions,
    getFavoriteSessions,
    isPremium
  };
};
