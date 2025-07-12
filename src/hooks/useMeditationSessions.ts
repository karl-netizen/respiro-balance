import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface MeditationSession {
  id: string;
  user_id: string;
  duration: number;
  started_at: string;
  completed: boolean;
  completed_at?: string;
  rating?: number;
  session_type: string;
  title?: string;
  category?: string;
  difficulty?: string;
  image_url?: string;
  instructor?: string;
  level?: string;
  description?: string;
  tags?: string[];
  feedback?: string;
  favorite?: boolean;
  created_at: string;
}

export interface SessionProgress {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  averageRating: number;
  favoriteSessions: MeditationSession[];
  recentSessions: MeditationSession[];
}

export const useMeditationSessions = () => {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [progress, setProgress] = useState<SessionProgress>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
    averageRating: 0,
    favoriteSessions: [],
    recentSessions: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load sessions when user changes
  useEffect(() => {
    if (user?.id) {
      loadSessions();
    } else {
      setSessions([]);
      setProgress({
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        averageRating: 0,
        favoriteSessions: [],
        recentSessions: []
      });
    }
  }, [user?.id]);

  const loadSessions = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: sessionsError } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        throw sessionsError;
      }

      setSessions(data || []);
      calculateProgress(data || []);
    } catch (error) {
      console.error('Error loading meditation sessions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (sessionData: MeditationSession[]) => {
    const completedSessions = sessionData.filter(s => s.completed);
    const totalMinutes = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    const completionRate = sessionData.length > 0 ? (completedSessions.length / sessionData.length) * 100 : 0;
    
    const ratedSessions = completedSessions.filter(s => s.rating);
    const averageRating = ratedSessions.length > 0 
      ? ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length 
      : 0;

    const favoriteSessions = sessionData.filter(s => s.favorite);
    const recentSessions = sessionData.slice(0, 10);

    // Calculate streak (simplified - consecutive days with completed sessions)
    const currentStreak = calculateCurrentStreak(completedSessions);
    const longestStreak = calculateLongestStreak(completedSessions);

    setProgress({
      totalSessions: completedSessions.length,
      totalMinutes,
      currentStreak,
      longestStreak,
      completionRate,
      averageRating,
      favoriteSessions,
      recentSessions
    });
  };

  const calculateCurrentStreak = (sessions: MeditationSession[]): number => {
    if (sessions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    const sortedSessions = sessions.sort((a, b) => new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime());
    
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].completed_at || sortedSessions[i].created_at);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = (sessions: MeditationSession[]): number => {
    if (sessions.length === 0) return 0;

    const dates = sessions
      .map(s => {
        const date = new Date(s.completed_at || s.created_at);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => b - a);

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const daysDiff = (dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24);
      
      if (daysDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  };

  const createSession = async (sessionData: Partial<MeditationSession>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);

      const newSession = {
        user_id: user.id,
        duration: sessionData.duration || 0,
        session_type: sessionData.session_type || 'meditation',
        title: sessionData.title,
        category: sessionData.category,
        difficulty: sessionData.difficulty,
        image_url: sessionData.image_url,
        instructor: sessionData.instructor,
        level: sessionData.level,
        description: sessionData.description,
        tags: sessionData.tags || [],
        started_at: new Date().toISOString(),
        completed: false
      };

      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert(newSession)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await loadSessions();
      return data;
    } catch (error) {
      console.error('Error creating meditation session:', error);
      setError(error instanceof Error ? error.message : 'Failed to create session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeSession = async (sessionId: string, rating?: number, feedback?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const updates: any = {
        completed: true,
        completed_at: new Date().toISOString()
      };

      if (rating !== undefined) {
        updates.rating = rating;
      }

      if (feedback) {
        updates.feedback = feedback;
      }

      const { error } = await supabase
        .from('meditation_sessions')
        .update(updates)
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      await loadSessions();
    } catch (error) {
      console.error('Error completing meditation session:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (sessionId: string, favorite: boolean) => {
    try {
      const { error } = await supabase
        .from('meditation_sessions')
        .update({ favorite })
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      await loadSessions();
    } catch (error) {
      console.error('Error updating favorite status:', error);
      throw error;
    }
  };

  const updateRating = async (sessionId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('meditation_sessions')
        .update({ rating })
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      await loadSessions();
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('meditation_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      await loadSessions();
    } catch (error) {
      console.error('Error deleting meditation session:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sessions,
    progress,
    isLoading,
    error,
    createSession,
    completeSession,
    toggleFavorite,
    updateRating,
    deleteSession,
    loadSessions
  };
};