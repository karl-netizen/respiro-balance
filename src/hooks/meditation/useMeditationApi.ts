
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MeditationSession } from '@/types/meditation';
import { useState } from 'react';

export function useMeditationApi(userId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch recent meditation sessions
  const fetchRecentSessions = async (): Promise<MeditationSession[]> => {
    if (!userId || !isSupabaseConfigured()) return [];

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
        throw error;
      }

      return data as MeditationSession[];
    } catch (err) {
      console.error('Failed to fetch sessions from Supabase:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new meditation session
  const createSession = async (newSession: Omit<MeditationSession, 'id'>): Promise<string> => {
    if (!userId || !isSupabaseConfigured()) {
      throw new Error('Cannot create session: User not authenticated or Supabase not configured');
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
        throw error;
      }

      return data.id;
    } catch (err) {
      console.error('Failed to create session in Supabase:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a meditation session
  const completeSession = async (sessionId: string): Promise<void> => {
    if (!userId || !isSupabaseConfigured()) {
      throw new Error('Cannot complete session: User not authenticated or Supabase not configured');
    }

    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase
        .from('meditation_sessions')
        .update({ completed: true })
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error completing meditation session:', error);
        setError(new Error(error.message));
        throw error;
      }
    } catch (err) {
      console.error('Failed to complete session in Supabase:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single session by ID
  const getSession = async (sessionId: string): Promise<MeditationSession | null> => {
    if (!userId || !isSupabaseConfigured()) return null;

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
        throw error;
      }

      return data as MeditationSession;
    } catch (err) {
      console.error('Failed to fetch session from Supabase:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
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
