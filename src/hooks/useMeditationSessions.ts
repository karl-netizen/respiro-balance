
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { MeditationSession as SupabaseMeditationSession } from '@/types/supabase';
import { useAuth } from './useAuth';

interface StartSessionParams {
  sessionType: string;
  duration: number;
}

export function useMeditationSessions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch recent meditation sessions
  const fetchRecentSessions = async (): Promise<SupabaseMeditationSession[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('meditation_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching meditation sessions:', error);
      throw error;
    }

    return data as SupabaseMeditationSession[];
  };

  // Start a new meditation session
  const startSession = async (params: StartSessionParams): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const newSession = {
      user_id: user.id,
      session_type: params.sessionType,
      duration: params.duration,
      started_at: new Date().toISOString(),
      completed: false,
    };

    const { data, error } = await supabase
      .from('meditation_sessions')
      .insert(newSession)
      .select()
      .single();

    if (error) {
      console.error('Error starting meditation session:', error);
      throw error;
    }

    return data.id;
  };

  // Complete a meditation session
  const completeSession = async (sessionId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('meditation_sessions')
      .update({ completed: true })
      .eq('id', sessionId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error completing meditation session:', error);
      throw error;
    }
  };

  // React Query hooks
  const sessionsQuery = useQuery({
    queryKey: ['meditationSessions', user?.id],
    queryFn: fetchRecentSessions,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const startSessionMutation = useMutation({
    mutationFn: startSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditationSessions', user?.id] });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: completeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditationSessions', user?.id] });
    },
  });

  return {
    sessions: sessionsQuery.data || [],
    isLoading: sessionsQuery.isLoading,
    isError: sessionsQuery.isError,
    error: sessionsQuery.error,
    startSession: startSessionMutation.mutate,
    completeSession: completeSessionMutation.mutate,
    isStarting: startSessionMutation.isPending,
    isCompleting: completeSessionMutation.isPending,
  };
}
