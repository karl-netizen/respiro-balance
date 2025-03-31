
import { useState, useEffect } from 'react';
import { Brain, Moon, Sun, Leaf, ThumbsUp, Heart, CloudMoon, CloudSun, Award, Clock, Zap, Wind, Sparkles, Music } from "lucide-react";
import { MeditationSession } from '@/components/meditation/MeditationSessionCard';
import { useMeditationSessions } from './useMeditationSessions';

export const useMeditationLibrary = () => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<MeditationSession[]>([]);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [durationFilter, setDurationFilter] = useState<[number, number]>([1, 60]);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const { startSession, completeSession, isStarting } = useMeditationSessions();
  
  // Expanded meditation sessions data with more diverse content
  const meditationSessions: MeditationSession[] = [
    {
      id: 'guided-1',
      title: 'Morning Clarity',
      description: 'Start your day with a clear mind and positive intentions.',
      duration: 10,
      category: 'guided',
      level: 'beginner',
      icon: <Sun className="h-5 w-5 text-orange-400" />
    },
    {
      id: 'guided-2',
      title: 'Midday Reset',
      description: 'Reset your mind in the middle of your day to restore focus.',
      duration: 15,
      category: 'guided',
      level: 'intermediate',
      icon: <Brain className="h-5 w-5 text-blue-400" />
    },
    {
      id: 'guided-3',
      title: 'Evening Unwinding',
      description: 'Unwind from your day and prepare for a restful night.',
      duration: 20,
      category: 'guided',
      level: 'beginner',
      icon: <Moon className="h-5 w-5 text-indigo-400" />
    },
    {
      id: 'quick-1',
      title: 'Quick Focus',
      description: 'A 3-minute focus booster for when you need a quick reset.',
      duration: 3,
      category: 'quick',
      level: 'beginner',
      icon: <ThumbsUp className="h-5 w-5 text-green-400" />
    },
    {
      id: 'quick-2',
      title: 'Breath Awareness',
      description: 'A short practice to bring mindfulness to your breathing.',
      duration: 5,
      category: 'quick',
      level: 'beginner',
      icon: <Leaf className="h-5 w-5 text-green-500" />
    },
    {
      id: 'deep-1',
      title: 'Deep Concentration',
      description: 'Develop sustained attention and focus with this deeper practice.',
      duration: 25,
      category: 'deep',
      level: 'advanced',
      icon: <Brain className="h-5 w-5 text-purple-500" />
    },
    {
      id: 'deep-2',
      title: 'Mindful Presence',
      description: 'A longer session for developing complete mindful awareness.',
      duration: 30,
      category: 'deep',
      level: 'intermediate',
      icon: <Heart className="h-5 w-5 text-pink-500" />
    },
    {
      id: 'sleep-1',
      title: 'Sleep Preparation',
      description: 'Calm your mind and prepare your body for restful sleep.',
      duration: 15,
      category: 'sleep',
      level: 'beginner',
      icon: <Moon className="h-5 w-5 text-blue-300" />
    },
    // Additional sessions
    {
      id: 'guided-4',
      title: 'Body Scan Relaxation',
      description: 'A guided journey through your body to release tension and find deep relaxation.',
      duration: 18,
      category: 'guided',
      level: 'beginner',
      icon: <Sparkles className="h-5 w-5 text-yellow-400" />
    },
    {
      id: 'guided-5',
      title: 'Gratitude Practice',
      description: 'Cultivate appreciation and positive emotions through guided gratitude meditation.',
      duration: 12,
      category: 'guided',
      level: 'beginner',
      icon: <Heart className="h-5 w-5 text-red-400" />
    },
    {
      id: 'deep-3',
      title: 'Visualization Mastery',
      description: 'Use the power of your imagination to create mental clarity and manifest your goals.',
      duration: 22,
      category: 'deep',
      level: 'intermediate',
      icon: <Brain className="h-5 w-5 text-indigo-500" />
    },
    {
      id: 'sleep-2',
      title: 'Deep Sleep Journey',
      description: 'A longer meditation designed to transition you into deep, restorative sleep.',
      duration: 45,
      category: 'sleep',
      level: 'intermediate',
      icon: <CloudMoon className="h-5 w-5 text-indigo-300" />
    },
    {
      id: 'quick-3',
      title: 'One-Minute Calm',
      description: 'An ultra-quick reset for when you need instant relief from stress or anxiety.',
      duration: 1,
      category: 'quick',
      level: 'beginner',
      icon: <Clock className="h-5 w-5 text-gray-500" />
    },
    {
      id: 'deep-4',
      title: 'Advanced Awareness',
      description: 'For experienced meditators seeking to deepen their practice and awareness.',
      duration: 40,
      category: 'deep',
      level: 'advanced',
      icon: <Award className="h-5 w-5 text-amber-500" />
    },
    {
      id: 'guided-6',
      title: 'Loving-Kindness',
      description: 'Develop compassion for yourself and others through this heart-centered practice.',
      duration: 15,
      category: 'guided',
      level: 'intermediate',
      icon: <Heart className="h-5 w-5 text-pink-400" />
    },
    {
      id: 'sleep-3',
      title: 'Bedtime Wind-Down',
      description: 'Gentle guidance to help you process your day and prepare for restorative sleep.',
      duration: 10,
      category: 'sleep',
      level: 'beginner',
      icon: <Wind className="h-5 w-5 text-blue-300" />
    }
  ];
  
  // Load favorites and recently played from localStorage on mount
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
    
    const savedRecent = localStorage.getItem('recentlyPlayedMeditations');
    if (savedRecent) {
      try {
        const recentIds = JSON.parse(savedRecent) as string[];
        const recentSessions = recentIds
          .map(id => meditationSessions.find(session => session.id === id))
          .filter((session): session is MeditationSession => session !== undefined);
        setRecentlyPlayed(recentSessions);
      } catch (error) {
        console.error('Error parsing saved recently played:', error);
        setRecentlyPlayed([]);
      }
    }
    
    // Load session ratings
    const savedRatings = localStorage.getItem('meditationRatings');
    if (savedRatings) {
      try {
        const ratings = JSON.parse(savedRatings) as Record<string, { rating: number, feedback: string }>;
        // We don't need to set state here, but we'll use this data when filtering sessions
      } catch (error) {
        console.error('Error parsing saved ratings:', error);
      }
    }
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meditationFavorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // Save recently played to localStorage whenever they change
  useEffect(() => {
    const recentIds = recentlyPlayed.map(session => session.id);
    localStorage.setItem('recentlyPlayedMeditations', JSON.stringify(recentIds));
  }, [recentlyPlayed]);
  
  const handleSelectSession = async (session: MeditationSession) => {
    setSelectedSession(session);
    
    // Add to recently played (at the beginning, limit to 4 items)
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== session.id);
      return [session, ...filtered].slice(0, 4);
    });
    
    // Start the session in the backend
    await startSession({ 
      sessionType: session.category, 
      duration: session.duration 
    });
  };
  
  const handleCompleteSession = async (sessionId: string) => {
    await completeSession(sessionId);
    setShowRatingDialog(true);
  };
  
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
    return meditationSessions.filter(session => favorites.includes(session.id));
  };
  
  const handleSubmitRating = (sessionId: string, rating: number, feedback: string) => {
    // Get existing ratings or initialize empty object
    const existingRatings = localStorage.getItem('meditationRatings');
    const ratings = existingRatings ? JSON.parse(existingRatings) : {};
    
    // Add or update rating for this session
    ratings[sessionId] = { rating, feedback, timestamp: new Date().toISOString() };
    
    // Save back to localStorage
    localStorage.setItem('meditationRatings', JSON.stringify(ratings));
    
    // Close the rating dialog
    setShowRatingDialog(false);
    
    // Reset selected session
    setSelectedSession(null);
  };
  
  const filterSessionsByCategory = (category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    return meditationSessions
      .filter(session => session.category === category)
      .filter(session => {
        // Apply duration filter
        const meetsMinDuration = session.duration >= durationFilter[0];
        const meetsMaxDuration = session.duration <= durationFilter[1];
        
        // Apply level filter if set
        const meetsLevelFilter = levelFilter === null || session.level === levelFilter;
        
        return meetsMinDuration && meetsMaxDuration && meetsLevelFilter;
      });
  };
  
  const resetFilters = () => {
    setDurationFilter([1, 60]);
    setLevelFilter(null);
  };

  return {
    meditationSessions,
    selectedSession,
    setSelectedSession,
    handleSelectSession,
    handleCompleteSession,
    filterSessionsByCategory,
    isStarting,
    favorites,
    isFavorite,
    handleToggleFavorite,
    getFavoriteSessions,
    recentlyPlayed,
    showRatingDialog,
    setShowRatingDialog,
    handleSubmitRating,
    durationFilter,
    setDurationFilter,
    levelFilter,
    setLevelFilter,
    resetFilters
  };
};
