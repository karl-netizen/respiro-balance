export const useMeditationApi = (_userId?: string) => {
  const fetchRecentSessions = async (): Promise<unknown[]> => {
    // Mock implementation for demo
    return [];
  };

  const createSession = async (_session: unknown): Promise<string> => {
    // Mock implementation for demo
    return `session-${Date.now()}`;
  };

  const getSession = async (_sessionId: string): Promise<null> => {
    // Mock implementation for demo
    return null;
  };

  const completeSession = async (_sessionId: string): Promise<void> => {
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
