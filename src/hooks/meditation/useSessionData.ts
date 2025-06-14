
import { useState, useMemo } from 'react';
import { MeditationSession, FilterState } from '../useEnhancedMeditationPage';

export const useSessionData = () => {
  const [sortBy, setSortBy] = useState<'title' | 'duration' | 'difficulty' | 'rating'>('title');
  const [searchTerm, setSearchTerm] = useState('');
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
      completionCount: 1250,
      session_type: 'guided',
      level: 'beginner'
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
      completionCount: 980,
      session_type: 'guided',
      level: 'intermediate'
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
      completionCount: 750,
      session_type: 'guided',
      level: 'beginner'
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
      completionCount: 620,
      session_type: 'guided',
      level: 'advanced'
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
      completionCount: 1100,
      session_type: 'guided',
      level: 'beginner'
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

  return {
    sessions,
    filteredSessions,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchTerm,
    setSearchTerm
  };
};
