
export const useMeditationApi = (userId?: string) => {
  const fetchRecentSessions = async () => {
    // Mock implementation for demo
    return [];
  };

  const createSession = async (session: any): Promise<string> => {
    // Mock implementation for demo
    return `session-${Date.now()}`;
  };

  const getSession = async (sessionId: string) => {
    // Mock implementation for demo
    return null;
  };

  const completeSession = async (sessionId: string) => {
    // Mock implementation for demo
    return;
  };

  return {
    fetchRecentSessions,
    createSession,
    getSession,
    completeSession
  };
};
