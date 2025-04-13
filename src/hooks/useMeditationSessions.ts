
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, demoAuth, isSupabaseConfigured } from '@/lib/supabase';
import { MeditationSession as SupabaseMeditationSession } from '@/types/supabase';
import { useAuth } from './useAuth';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { toast } from 'sonner';

interface StartSessionParams {
  sessionType: string;
  duration: number;
}

// Local storage keys
const OFFLINE_SESSIONS_KEY = 'offline_meditation_sessions';
const SESSION_SYNC_QUEUE_KEY = 'meditation_session_sync_queue';

export function useMeditationSessions() {
  const { user } = useAuth();
  const { updateUsage, hasExceededUsageLimit } = useSubscriptionContext();
  const queryClient = useQueryClient();

  // Offline sync helpers
  const getOfflineSessions = () => {
    const sessions = localStorage.getItem(OFFLINE_SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  };

  const saveOfflineSessions = (sessions: any[]) => {
    localStorage.setItem(OFFLINE_SESSIONS_KEY, JSON.stringify(sessions));
  };

  const getSyncQueue = () => {
    const queue = localStorage.getItem(SESSION_SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  };

  const addToSyncQueue = (operation: string, data: any) => {
    const queue = getSyncQueue();
    queue.push({
      operation,
      data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(SESSION_SYNC_QUEUE_KEY, JSON.stringify(queue));
  };

  const clearSyncQueue = () => {
    localStorage.removeItem(SESSION_SYNC_QUEUE_KEY);
  };

  // Process offline sync
  const processOfflineSync = async () => {
    if (!user || !isSupabaseConfigured()) return;
    
    const queue = getSyncQueue();
    if (queue.length === 0) return;
    
    console.log(`Processing ${queue.length} offline meditation session operations`);
    
    let successCount = 0;
    
    for (const item of queue) {
      try {
        if (item.operation === 'start') {
          await supabase
            .from('meditation_sessions')
            .insert(item.data);
          successCount++;
        } else if (item.operation === 'complete') {
          // For complete operations, first check if the session exists in Supabase
          const { data: existingSession } = await supabase
            .from('meditation_sessions')
            .select('id, duration')
            .eq('id', item.data.id)
            .single();
            
          if (existingSession) {
            // Update existing session
            await supabase
              .from('meditation_sessions')
              .update({ completed: true })
              .eq('id', item.data.id);
              
            // Update usage minutes
            updateUsage(existingSession.duration);
          } else {
            // Session doesn't exist in Supabase yet, create it as completed
            await supabase
              .from('meditation_sessions')
              .insert({
                ...item.data,
                completed: true
              });
              
            // Update usage minutes if duration is available
            if (item.data.duration) {
              updateUsage(item.data.duration);
            }
          }
          successCount++;
        }
      } catch (error) {
        console.error(`Error processing offline sync item (${item.operation}):`, error);
      }
    }
    
    if (successCount > 0) {
      clearSyncQueue();
      if (successCount === queue.length) {
        toast("Sync complete", {
          description: `Successfully synchronized ${successCount} meditation sessions`
        });
      } else {
        toast("Partial sync complete", {
          description: `Synchronized ${successCount} of ${queue.length} meditation sessions`
        });
      }
      
      // Clear offline sessions that have been synced
      saveOfflineSessions([]);
      
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['meditationSessions', user.id] });
    }
  };

  // Fetch recent meditation sessions
  const fetchRecentSessions = async (): Promise<SupabaseMeditationSession[]> => {
    if (!user) return [];
    
    // If not connected to Supabase, return from localStorage
    if (!isSupabaseConfigured()) {
      return getOfflineSessions();
    }

    try {
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
      
      // Store sessions in localStorage as backup
      saveOfflineSessions(data || []);
      
      // Process any pending offline changes
      await processOfflineSync();

      return data as SupabaseMeditationSession[];
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

    const newSession = {
      user_id: user.id,
      session_type: params.sessionType,
      duration: params.duration,
      started_at: new Date().toISOString(),
      completed: false,
    };
    
    // If not connected to Supabase, save to localStorage
    if (!isSupabaseConfigured()) {
      // Generate a client-side ID
      const sessionId = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Add session to offline store
      const offlineSessions = getOfflineSessions();
      const sessionWithId = { ...newSession, id: sessionId };
      offlineSessions.unshift(sessionWithId);
      saveOfflineSessions(offlineSessions);
      
      // Add to sync queue
      addToSyncQueue('start', newSession);
      
      return sessionId;
    }

    try {
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
    } catch (error) {
      console.error('Failed to start session in Supabase:', error);
      
      // Fall back to offline mode
      const sessionId = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Add session to offline store
      const offlineSessions = getOfflineSessions();
      const sessionWithId = { ...newSession, id: sessionId };
      offlineSessions.unshift(sessionWithId);
      saveOfflineSessions(offlineSessions);
      
      // Add to sync queue
      addToSyncQueue('start', newSession);
      
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
      // Update offline session
      const offlineSessions = getOfflineSessions();
      const sessionToUpdate = offlineSessions.find(session => session.id === sessionId);
      
      if (sessionToUpdate) {
        // Update session in offline storage
        const updatedSessions = offlineSessions.map(session => {
          if (session.id === sessionId) {
            return { ...session, completed: true };
          }
          return session;
        });
        saveOfflineSessions(updatedSessions);
        
        // Add to sync queue
        addToSyncQueue('complete', { 
          id: sessionId, 
          user_id: user.id,
          duration: sessionToUpdate.duration 
        });
        
        // Update usage tracking
        try {
          updateUsage(sessionToUpdate.duration);
        } catch (error) {
          console.error('Error updating usage in offline mode:', error);
        }
      }
      
      // Refresh local data
      queryClient.invalidateQueries({ queryKey: ['meditationSessions', user.id] });
      return;
    }

    try {
      // First get the session to get its duration
      const { data: sessionData, error: sessionError } = await supabase
        .from('meditation_sessions')
        .select('duration')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();
        
      if (sessionError) {
        console.error('Error fetching session for completion:', sessionError);
        throw sessionError;
      }
      
      // Update the session to completed
      const { error } = await supabase
        .from('meditation_sessions')
        .update({ completed: true })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error completing meditation session:', error);
        throw error;
      }
      
      // Update usage tracking
      try {
        updateUsage(sessionData.duration);
      } catch (error) {
        console.error('Error updating usage after session completion:', error);
      }
      
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['meditationSessions', user.id] });
      queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
    } catch (error) {
      console.error('Failed to complete session in Supabase:', error);
      
      // Fall back to offline mode for completion
      const offlineSessions = getOfflineSessions();
      const sessionToUpdate = offlineSessions.find(session => session.id === sessionId);
      
      if (sessionToUpdate) {
        // Update session in offline storage
        const updatedSessions = offlineSessions.map(session => {
          if (session.id === sessionId) {
            return { ...session, completed: true };
          }
          return session;
        });
        saveOfflineSessions(updatedSessions);
        
        // Add to sync queue
        addToSyncQueue('complete', { 
          id: sessionId, 
          user_id: user.id,
          duration: sessionToUpdate.duration 
        });
        
        // Try to update usage
        try {
          updateUsage(sessionToUpdate.duration);
        } catch (e) {
          console.error('Error updating usage in offline fallback:', e);
        }
      }
      
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
