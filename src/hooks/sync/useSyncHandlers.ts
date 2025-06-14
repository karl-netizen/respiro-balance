
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useSyncHandlers = () => {
  const handleBiometricUpdate = useCallback((payload: any) => {
    console.log('New biometric data:', payload);
    
    const data = payload.new as any;
    if (data.stress_score > 70) {
      toast.warning('High stress detected', {
        description: 'Consider taking a breathing break',
        action: {
          label: 'Start Breathing',
          onClick: () => window.location.href = '/breathing?type=stress-relief'
        }
      });
    }
  }, []);

  const handleSessionUpdate = useCallback((payload: any) => {
    console.log('Session updated:', payload);
    
    const session = payload.new as any;
    if (session.completed) {
      toast.success('Session completed!', {
        description: 'Your progress has been updated',
        action: {
          label: 'View Progress',
          onClick: () => window.location.href = '/progress'
        }
      });
    }
  }, []);

  const handleSessionStart = useCallback((payload: any) => {
    console.log('New session started:', payload);
  }, []);

  return {
    handleBiometricUpdate,
    handleSessionUpdate,
    handleSessionStart
  };
};
