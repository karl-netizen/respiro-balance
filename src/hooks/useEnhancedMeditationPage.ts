
import { useState, useEffect, useMemo } from 'react';
import { Heart, Clock, User, Sparkles, Compass, Leaf, Mountain, Sun, Moon, Star } from 'lucide-react';

export interface FilterState {
  categories: string[];
  durations: string[];
  levels: string[];
  instructors: string[];
  searchTerm: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  instructor: string;
  duration: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  audioUrl?: string;
  imageUrl?: string;
  tags: string[];
  rating: number;
  completionCount: number;
}

export interface SessionProgress {
  sessionId: string;
  progress: number;
  lastPlayedAt: Date;
  completed: boolean;
}

export const useEnhancedMeditationPage = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'resume' | 'player'>('library');
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'difficulty' | 'rating'>('title');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [progress, setProgress] = useState<Record<string, SessionProgress>>({});

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    durations: [],
    levels: [],
    instructors: [],
    searchTerm: ''
  });

  // Mock data for meditation sessions
  const sessions: MeditationSession[] = [
    {
      id: '1',
      title: 'Morning Mindfulness',
      instructor: 'Sarah Chen',
      duration: 10,
      category: 'Mindfulness',
      difficulty: 'Beginner',
      description: 'Start your day with clarity and intention through gentle mindfulness practices.',
      tags: ['morning', 'mindfulness', 'beginner'],
      rating: 4.8,
      completionCount: 1250
    },
    {
      id: '2',
      title: 'Deep Relaxation',
      instructor: 'Marcus Johnson',
      duration: 20,
      category: 'Relaxation',
      difficulty: 'Intermediate',
      description: 'Release tension and stress with this comprehensive relaxation meditation.',
      tags: ['relaxation', 'stress-relief', 'body-scan'],
      rating: 4.9,
      completionCount: 980
    },
    {
      id: '3',
      title: 'Loving Kindness',
      instructor: 'Lisa Wong',
      duration: 15,
      category: 'Compassion',
      difficulty: 'Beginner',
      description: 'Cultivate compassion and loving-kindness for yourself and others.',
      tags: ['compassion', 'loving-kindness', 'heart'],
      rating: 4.7,
      completionCount: 750
    },
    {
      id: '4',
      title: 'Focus & Concentration',
      instructor: 'David Kim',
      duration: 25,
      category: 'Focus',
      difficulty: 'Advanced',
      description: 'Sharpen your mental focus and concentration with advanced techniques.',
      tags: ['focus', 'concentration', 'advanced'],
      rating: 4.6,
      completionCount: 620
    },
    {
      id: '5',
      title: 'Sleep Preparation',
      instructor: 'Emma Taylor',
      duration: 30,
      category: 'Sleep',
      difficulty: 'Beginner',
      description: 'Prepare your mind and body for restful, rejuvenating sleep.',
      tags: ['sleep', 'bedtime', 'relaxation'],
      rating: 4.8,
      completionCount: 1100
    }
  ];

  // Filter sessions based on current filters
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(session.category)) {
        return false;
      }
      
      // Duration filter
      if (filters.durations.length > 0) {
        const durationCategory = session.duration <= 10 ? 'Short (≤10 min)' :
                               session.duration <= 20 ? 'Medium (11-20 min)' :
                               'Long (>20 min)';
        if (!filters.durations.includes(durationCategory)) {
          return false;
        }
      }
      
      // Level filter
      if (filters.levels.length > 0 && !filters.levels.includes(session.difficulty)) {
        return false;
      }
      
      // Instructor filter
      if (filters.instructors.length > 0 && !filters.instructors.includes(session.instructor)) {
        return false;
      }
      
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return session.title.toLowerCase().includes(searchLower) ||
               session.description.toLowerCase().includes(searchLower) ||
               session.tags.some(tag => tag.toLowerCase().includes(searchLower));
      }
      
      return true;
    });
  }, [sessions, filters, searchTerm]);

  // Get recent sessions (sessions with progress)
  const recentSessions = useMemo(() => {
    return sessions.filter(session => 
      progress[session.id] && !progress[session.id].completed
    ).slice(0, 5);
  }, [sessions, progress]);

  // Get completed sessions
  const completedSessions = useMemo(() => {
    return sessions.filter(session => 
      progress[session.id]?.completed
    ).slice(0, 10);
  }, [sessions, progress]);

  // Get favorite sessions
  const favoritesList = useMemo(() => {
    return sessions.filter(session => favorites.has(session.id));
  }, [sessions, favorites]);

  // Toggle favorite status
  const toggleFavorite = (sessionId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(sessionId)) {
        newFavorites.delete(sessionId);
      } else {
        newFavorites.add(sessionId);
      }
      return newFavorites;
    });
  };

  // Handle session selection
  const handleSessionSelect = (session: MeditationSession) => {
    setSelectedSession(session);
    setActiveTab('player');
    setCurrentTime(progress[session.id]?.progress || 0);
  };

  // Handle session completion
  const handleSessionComplete = (sessionId: string) => {
    setProgress(prev => ({
      ...prev,
      [sessionId]: {
        sessionId,
        progress: 100,
        lastPlayedAt: new Date(),
        completed: true
      }
    }));
  };

  // Handle session resume
  const handleSessionResume = (session: MeditationSession) => {
    setSelectedSession(session);
    setActiveTab('player');
    setCurrentTime(progress[session.id]?.progress || 0);
  };

  // Utility functions
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    return 'text-gray-400';
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (category) {
      case 'Mindfulness': return <Compass {...iconProps} />;
      case 'Relaxation': return <Leaf {...iconProps} />;
      case 'Focus': return <Star {...iconProps} />;
      case 'Sleep': return <Moon {...iconProps} />;
      case 'Compassion': return <Heart {...iconProps} />;
      case 'Energy': return <Sun {...iconProps} />;
      case 'Anxiety': return <Mountain {...iconProps} />;
      case 'Stress': return <Sparkles {...iconProps} />;
      default: return <Compass {...iconProps} />;
    }
  };

  return {
    activeTab,
    setActiveTab,
    selectedSession,
    setSelectedSession,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    sessions,
    filteredSessions,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchTerm,
    setSearchTerm,
    favorites,
    toggleFavorite,
    viewMode,
    setViewMode,
    progress,
    setProgress,
    recentSessions,
    completedSessions,
    favoritesList,
    handleSessionSelect,
    handleSessionComplete,
    handleSessionResume,
    formatTime,
    getProgressColor,
    getDifficultyColor,
    getCategoryIcon
  };
};
