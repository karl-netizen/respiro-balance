
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured } from '@/lib/supabase';
import { MeditationSession, StartSessionParams } from '@/types/meditation';
import { useAuth } from './useAuth';
import { useSubscriptionContext } from '@/context/SubscriptionProvider';
import { toast } from 'sonner';
import { useOfflineStorage } from './meditation/useOfflineStorage';
import { useMeditationApi } from './meditation/useMeditationApi';
import { useOfflineSync } from './meditation/useOfflineSync';

export function useMeditationSessions() {
  const { user } = useAuth();
  const { updateUsage, hasExceededUsageLimit } = useSubscriptionContext();
  const queryClient = useQueryClient();
  
  const { getOfflineSessions, saveOfflineSessions } = useOfflineStorage();
  const meditationApi = useMeditationApi(user?.id);
  
  const invalidateSessionQueries = () => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ['meditationSessions', user.id] });
    }
  };
  
  const offlineSync = useOfflineSync(
    user?.id, 
    updateUsage, 
    invalidateSessionQueries
  );

  // Fetch recent meditation sessions
  const fetchRecentSessions = async () => {
    if (!user) return [];
    
    // If not connected to Supabase, return from localStorage
    if (!isSupabaseConfigured()) {
      return getOfflineSessions();
    }

    try {
      const data = await meditationApi.fetchRecentSessions();
      
      // Store sessions in localStorage as backup
      saveOfflineSessions(data || []);
      
      // Process any pending offline changes
      await offlineSync.processOfflineSync();

      return data;
    } catch (error) {
      console.error('Failed to fetch sessions from Supabase:', error);
      // Fall back to localStorage
      return getOfflineSessions();
    }
  };

  // Start a new meditation session
  const startSession = async (params: StartSessionParams): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    // Check if user has reached their usage limit
    if (hasExceededUsageLimit) {
      throw new Error('You have reached your monthly meditation limit. Please upgrade to continue.');
    }

    const newSession: Omit<MeditationSession, "id"> = {
      title: `${params.sessionType.charAt(0).toUpperCase() + params.sessionType.slice(1)} Session`,
      user_id: user.id,
      session_type: params.sessionType,
      duration: params.duration,
      started_at: new Date().toISOString(),
      completed: false,
      description: "",
      category: params.sessionType,
      level: "beginner",
      instructor: "",
      tags: []
    };
    
    // If not connected to Supabase, save to localStorage
    if (!isSupabaseConfigured()) {
      const sessionId = offlineSync.handleOfflineSessionStart(newSession, user);
      return sessionId;
    }

    try {
      return await meditationApi.createSession(newSession);
    } catch (error) {
      console.error('Failed to start session in Supabase:', error);
      
      // Fall back to offline mode
      const sessionId = offlineSync.handleOfflineSessionStart(newSession, user);
      
      toast("Offline mode", {
        description: "Session started in offline mode and will sync when connection is restored"
      });
      
      return sessionId;
    }
  };

  // Complete a meditation session
  const completeSession = async (sessionId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    // If not connected to Supabase or session ID is an offline ID
    if (!isSupabaseConfigured() || sessionId.startsWith('offline-')) {
      await offlineSync.handleOfflineSessionComplete(sessionId, user);
      
      // Refresh local data
      invalidateSessionQueries();
      return;
    }

    try {
      // First get the session to get its duration
      const sessionData = await meditationApi.getSession(sessionId);
      if (!sessionData) {
        throw new Error('Session not found');
      }
      
      // Update the session to completed
      await meditationApi.completeSession(sessionId);
      
      // Update usage tracking
      try {
        updateUsage(sessionData.duration);
      } catch (error) {
        console.error('Error updating usage after session completion:', error);
      }
      
      // Refresh queries
      invalidateSessionQueries();
      queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
    } catch (error) {
      console.error('Failed to complete session in Supabase:', error);
      
      // Fall back to offline mode for completion
      await offlineSync.handleOfflineSessionComplete(sessionId, user);
      
      toast("Offline mode", {
        description: "Session completed in offline mode and will sync when connection is restored"
      });
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
