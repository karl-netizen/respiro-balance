import { useOfflineStorage } from './useOfflineStorage';
import { useMeditationApi } from './useMeditationApi';
import { MeditationSession } from '@/types/meditation';
import { User } from '@/hooks/useAuth';

export function useOfflineSync(
  userId: string | undefined,
  updateUsage: (minutes: number) => void,
  onSyncComplete: () => void
) {
  const { queueSessionForSync, getPendingSyncs, clearPendingSyncs } = useOfflineStorage();
  const api = useMeditationApi(userId);
  
  // Process any pending offline syncs
  const processOfflineSync = async (): Promise<void> => {
    if (!userId) return;
    
    const pendingSyncs = getPendingSyncs();
    if (!pendingSyncs.length) return;
    
    for (const sync of pendingSyncs) {
      try {
        if (sync.type === 'createSession') {
          const sessionData = sync.data;
          await api.createSession(sessionData);
          
          // If the session was completed, update usage
          if (sessionData.completed && sessionData.duration) {
            updateUsage(sessionData.duration);
          }
        } else if (sync.type === 'completeSession') {
          await api.completeSession(sync.data.sessionId);
          
          // Update usage for completed session
          if (sync.data.duration) {
            updateUsage(sync.data.duration);
          }
        }
      } catch (error) {
        console.error('Failed to sync offline data:', error);
        // Keep the sync in the queue if it fails
        // In a more advanced implementation, we might want to limit retries
        return;
      }
    }
    
    // Clear pending syncs if all were successful
    clearPendingSyncs();
    
    // Notify that sync is complete
    onSyncComplete();
  };
  
  // Handle starting a session while offline
  const handleOfflineSessionStart = (
    newSession: Omit<MeditationSession, "id">, 
    user: User
  ): string => {
    // Create temporary ID
    const offlineId = `offline-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Queue for sync
    queueSessionForSync({
      ...newSession,
      id: offlineId
    });
    
    return offlineId;
  };
  
  // Handle completing a session while offline
  const handleOfflineSessionComplete = async (
    sessionId: string, 
    user: User
  ): Promise<void> => {
    // If it's an offline ID, update the queued session
    if (sessionId.startsWith('offline-')) {
      const pendingSyncs = getPendingSyncs();
      const updatedSyncs = pendingSyncs.map(sync => {
        if (sync.type === 'createSession' && sync.data.id === sessionId) {
          return {
            ...sync,
            data: {
              ...sync.data,
              completed: true,
              completed_at: new Date().toISOString()
            }
          };
        }
        return sync;
      });
      localStorage.setItem('pendingMeditationSyncs', JSON.stringify(updatedSyncs));
    } else {
      // It's a real session ID from the database, queue completion
      queueSessionForSync({
        type: 'completeSession',
        data: {
          sessionId,
          completed: true,
          completed_at: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return {
    processOfflineSync,
    handleOfflineSessionStart,
    handleOfflineSessionComplete
  };
}
