
export const useOfflineStorage = () => {
  const getOfflineSessions = () => {
    const stored = localStorage.getItem('offline-sessions');
    return stored ? JSON.parse(stored) : [];
  };

  const saveOfflineSessions = (sessions: any[]) => {
    localStorage.setItem('offline-sessions', JSON.stringify(sessions));
  };

  return {
    getOfflineSessions,
    saveOfflineSessions
  };
};
