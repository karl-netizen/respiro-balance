
import { MeditationSession } from '@/types/meditation';

export function useOfflineStorage() {
  // Load sessions from localStorage
  const getOfflineSessions = (): MeditationSession[] => {
    try {
      const storedSessions = localStorage.getItem('offlineMeditationSessions');
      return storedSessions ? JSON.parse(storedSessions) : [];
    } catch (error) {
      console.error('Failed to load offline sessions:', error);
      return [];
    }
  };
  
  // Save sessions to localStorage
  const saveOfflineSessions = (sessions: MeditationSession[]): void => {
    try {
      localStorage.setItem('offlineMeditationSessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save offline sessions:', error);
    }
  };
  
  // Queue a session to be synced later
  const queueSessionForSync = (session: Partial<MeditationSession>): void => {
    try {
      const pendingSyncs = getPendingSyncs();
      pendingSyncs.push({
        type: 'createSession',
        data: session,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pendingMeditationSyncs', JSON.stringify(pendingSyncs));
    } catch (error) {
      console.error('Failed to queue session for sync:', error);
    }
  };
  
  // Get pending syncs from localStorage
  const getPendingSyncs = (): Array<{
    type: string;
    data: any;
    timestamp: string;
  }> => {
    try {
      const pendingSyncs = localStorage.getItem('pendingMeditationSyncs');
      return pendingSyncs ? JSON.parse(pendingSyncs) : [];
    } catch (error) {
      console.error('Failed to get pending syncs:', error);
      return [];
    }
  };
  
  // Clear pending syncs from localStorage
  const clearPendingSyncs = (): void => {
    localStorage.removeItem('pendingMeditationSyncs');
  };
  
  return {
    getOfflineSessions,
    saveOfflineSessions,
    queueSessionForSync,
    getPendingSyncs,
    clearPendingSyncs
  };
}
