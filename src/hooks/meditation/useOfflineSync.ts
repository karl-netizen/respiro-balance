
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MeditationSession } from '@/types/meditation';
import { useAuth } from '@/hooks/useAuth';

// Define the offline sync state interface
interface OfflineSyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  pendingSessions: MeditationSession[];
  syncErrors: string[];
}

export const useOfflineSync = () => {
  const { user } = useAuth();
  const [syncState, setSyncState] = useState<OfflineSyncState>({
    isSyncing: false,
    lastSyncTime: null,
    pendingSessions: [],
    syncErrors: []
  });

  // Load pending sessions from localStorage
  const loadPendingSessions = () => {
    try {
      const pendingSessionsStr = localStorage.getItem('pendingMeditationSessions');
      if (pendingSessionsStr) {
        const pendingSessions = JSON.parse(pendingSessionsStr) as MeditationSession[];
        setSyncState(prev => ({ ...prev, pendingSessions }));
      }
    } catch (err: any) {
      console.error('Error loading pending sessions:', err);
    }
  };

  // Save pending sessions to localStorage
  const savePendingSessions = (sessions: MeditationSession[]) => {
    try {
      localStorage.setItem('pendingMeditationSessions', JSON.stringify(sessions));
    } catch (err: any) {
      console.error('Error saving pending sessions:', err);
    }
  };

  // Add a session to the pending queue
  const addPendingSession = (session: MeditationSession) => {
    setSyncState(prev => {
      const updatedSessions = [...prev.pendingSessions, session];
      savePendingSessions(updatedSessions);
      return { ...prev, pendingSessions: updatedSessions };
    });
  };

  // Sync pending sessions with the server
  const syncPendingSessions = async () => {
    if (syncState.isSyncing || !user || syncState.pendingSessions.length === 0) {
      return;
    }

    setSyncState(prev => ({ ...prev, isSyncing: true }));
    const errors: string[] = [];

    try {
      const sessionsToSync = [...syncState.pendingSessions];
      const successfulSyncs: string[] = [];

      for (const session of sessionsToSync) {
        try {
          // Prepare the session for syncing (ensure required fields)
          const syncedSession: Partial<MeditationSession> = {
            ...session,
            user_id: user.id,
            session_type: session.session_type || 'timed',
          };

          // Remove local-only fields if any
          delete (syncedSession as any).localId;

          // Add to Supabase
          const { error } = await supabase
            .from('meditation_sessions')
            .insert([syncedSession]);

          if (error) {
            throw new Error(`Supabase error: ${error.message}`);
          }

          successfulSyncs.push(session.id);
        } catch (err: any) {
          errors.push(`Failed to sync session ${session.id}: ${err.message}`);
        }
      }

      // Remove successfully synced sessions
      if (successfulSyncs.length > 0) {
        const remainingSessions = syncState.pendingSessions.filter(
          session => !successfulSyncs.includes(session.id)
        );
        savePendingSessions(remainingSessions);
        setSyncState(prev => ({
          ...prev,
          pendingSessions: remainingSessions,
          lastSyncTime: new Date()
        }));
      }
    } catch (err: any) {
      errors.push(`General sync error: ${err.message}`);
    } finally {
      setSyncState(prev => ({ 
        ...prev, 
        isSyncing: false,
        syncErrors: [...prev.syncErrors, ...errors]
      }));
    }
  };

  // Load pending sessions on mount
  useEffect(() => {
    loadPendingSessions();
  }, []);

  // Auto-sync when user changes (becomes available)
  useEffect(() => {
    if (user && syncState.pendingSessions.length > 0) {
      syncPendingSessions();
    }
  }, [user, syncState.pendingSessions.length]);

  return {
    syncState,
    addPendingSession,
    syncPendingSessions
  };
};
