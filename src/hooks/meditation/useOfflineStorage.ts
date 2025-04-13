
import { MeditationSession } from '@/types/meditation';

// Local storage keys
export const OFFLINE_SESSIONS_KEY = 'offline_meditation_sessions';
export const SESSION_SYNC_QUEUE_KEY = 'meditation_session_sync_queue';

export interface SyncQueueItem {
  operation: 'start' | 'complete';
  data: any;
  timestamp: string;
}

export function useOfflineStorage() {
  // Offline sessions storage helpers
  const getOfflineSessions = (): MeditationSession[] => {
    const sessions = localStorage.getItem(OFFLINE_SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  };

  const saveOfflineSessions = (sessions: MeditationSession[]) => {
    localStorage.setItem(OFFLINE_SESSIONS_KEY, JSON.stringify(sessions));
  };

  // Sync queue helpers
  const getSyncQueue = (): SyncQueueItem[] => {
    const queue = localStorage.getItem(SESSION_SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  };

  const addToSyncQueue = (operation: 'start' | 'complete', data: any) => {
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
  
  return {
    getOfflineSessions,
    saveOfflineSessions,
    getSyncQueue,
    addToSyncQueue,
    clearSyncQueue
  };
}
