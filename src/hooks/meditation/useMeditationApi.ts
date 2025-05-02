
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MeditationSession } from '@/types/meditation';
import { useState } from 'react';
import { toast } from 'sonner';

export function useMeditationApi(userId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch recent meditation sessions
  const fetchRecentSessions = async (): Promise<MeditationSession[]> => {
    if (!userId || !isSupabaseConfigured()) {
      console.log("Returning demo data for meditation sessions");
      return getDemoSessions();
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching meditation sessions:', error);
        setError(new Error(error.message));
        toast.error("Could not load meditation sessions");
        return getDemoSessions();
      }

      return data as MeditationSession[];
    } catch (err) {
      console.error('Failed to fetch sessions from Supabase:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading sessions';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return getDemoSessions();
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new meditation session
  const createSession = async (newSession: Omit<MeditationSession, 'id'>): Promise<string> => {
    if (!userId || !isSupabaseConfigured()) {
      console.log("Using demo mode for creating session");
      // Return a fake ID in demo mode
      return `demo-${Date.now()}`;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert(newSession)
        .select()
        .single();

      if (error) {
        console.error('Error creating meditation session:', error);
        setError(new Error(error.message));
        toast.error("Could not create meditation session");
        throw error;
      }

      return data.id;
    } catch (err) {
      console.error('Failed to create session in Supabase:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error creating session';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a meditation session
  const completeSession = async (sessionId: string): Promise<void> => {
    if (!userId || !isSupabaseConfigured() || sessionId.startsWith('demo-')) {
      console.log("Using demo mode for completing session");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('meditation_sessions')
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error completing meditation session:', error);
        setError(new Error(error.message));
        toast.error("Could not complete meditation session");
        throw error;
      }
    } catch (err) {
      console.error('Failed to complete session in Supabase:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error completing session';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single session by ID
  const getSession = async (sessionId: string): Promise<MeditationSession | null> => {
    if (!userId || !isSupabaseConfigured() || sessionId.startsWith('demo-')) {
      console.log("Using demo mode for getting session details");
      const demoSessions = getDemoSessions();
      return demoSessions[0] || null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching session:', error);
        setError(new Error(error.message));
        toast.error("Could not load session details");
        return null;
      }

      return data as MeditationSession;
    } catch (err) {
      console.error('Failed to fetch session from Supabase:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading session';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get demo sessions for testing/development
  const getDemoSessions = (): MeditationSession[] => {
    return [
      {
        id: 'demo-1',
        user_id: userId || 'demo-user',
        session_type: 'guided',
        title: 'Demo Mindfulness Session',
        duration: 10,
        started_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        completed_at: new Date(Date.now() - 3540000).toISOString(), // 59 minutes ago
        completed: true,
        rating: 5,
        category: 'mindfulness',
        difficulty: 'beginner',
        favorite: true,
        image_url: '/images/meditation/mindfulness.jpg',
        instructor: 'Sara Johnson',
        level: 'beginner',
        description: 'A gentle introduction to mindfulness meditation',
        tags: ['mindfulness', 'beginner', 'stress']
      },
      {
        id: 'demo-2',
        user_id: userId || 'demo-user',
        session_type: 'unguided',
        title: 'Focus Timer',
        duration: 15,
        started_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        completed: true,
        completed_at: new Date(Date.now() - 86400000 + 900000).toISOString(),
        category: 'focus',
        difficulty: 'intermediate',
        favorite: false,
        instructor: 'Self-guided',
        level: 'intermediate',
        description: 'Simple focus timer with bells',
        tags: ['focus', 'silence']
      }
    ];
  };

  return {
    fetchRecentSessions,
    createSession,
    completeSession,
    getSession,
    isLoading,
    error
  };
}
