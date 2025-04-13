
import { useOfflineStorage } from './useOfflineStorage';
import { useMeditationApi } from './useMeditationApi';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MeditationSession } from '@/types/meditation';
import { toast } from 'sonner';

export function useOfflineSync(
  userId: string | undefined, 
  updateUsage: (minutes: number) => void,
  invalidateQueries: () => void
) {
  const { 
    getSyncQueue, 
    clearSyncQueue, 
    saveOfflineSessions, 
    getOfflineSessions 
  } = useOfflineStorage();
  
  const { getSession } = useMeditationApi(userId);

  // Process offline sync
  const processOfflineSync = async (): Promise<boolean> => {
    if (!userId || !isSupabaseConfigured()) return false;
    
    const queue = getSyncQueue();
    if (queue.length === 0) return false;
    
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
      invalidateQueries();
      return true;
    }
    
    return false;
  };

  // Handle offline session start
  const handleOfflineSessionStart = (
    newSession: Omit<MeditationSession, 'id'>, 
    user: { id: string }
  ): string => {
    // Generate a client-side ID
    const sessionId = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add session to offline store
    const offlineSessions = getOfflineSessions();
    const sessionWithId = { ...newSession, id: sessionId } as MeditationSession;
    offlineSessions.unshift(sessionWithId);
    saveOfflineSessions(offlineSessions);
    
    // Add to sync queue
    const { addToSyncQueue } = useOfflineStorage();
    addToSyncQueue('start', newSession);
    
    return sessionId;
  };

  // Handle offline session completion
  const handleOfflineSessionComplete = async (
    sessionId: string, 
    user: { id: string }
  ): Promise<void> => {
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
      const { addToSyncQueue } = useOfflineStorage();
      addToSyncQueue('complete', { 
        id: sessionId, 
        user_id: user.id,
        duration: sessionToUpdate.duration 
      });
      
      // Update usage tracking
      updateUsage(sessionToUpdate.duration);
    }
  };

  return {
    processOfflineSync,
    handleOfflineSessionStart,
    handleOfflineSessionComplete
  };
}
