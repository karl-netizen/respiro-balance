
import { useCallback } from 'react';
import { unifiedDataCoordinator, SessionData, WellnessScore } from '@/services/UnifiedDataCoordinator';
import { useAuth } from '@/hooks/useAuth';

export const useUnifiedDataCoordinator = () => {
  const { user } = useAuth();

  const onSessionComplete = useCallback(async (sessionData: Omit<SessionData, 'userId'>) => {
    if (!user) return;
    
    const fullSessionData: SessionData = {
      ...sessionData,
      userId: user.id
    };
    
    await unifiedDataCoordinator.onSessionComplete(fullSessionData);
  }, [user]);

  const syncProgress = useCallback(async () => {
    if (!user) return;
    await unifiedDataCoordinator.syncCrossModuleProgress(user.id);
  }, [user]);

  const getWellnessScore = useCallback(async (): Promise<WellnessScore | null> => {
    if (!user) return null;
    return await unifiedDataCoordinator.calculateOverallWellnessScore(user.id);
  }, [user]);

  return {
    onSessionComplete,
    syncProgress,
    getWellnessScore
  };
};
