
import { useOfflineStorage } from '@/components/meditation/offline/OfflineStorageProvider';

export const useOfflineStorageSafe = () => {
  try {
    return {
      ...useOfflineStorage(),
      isAvailable: true
    };
  } catch (error) {
    // Return mock functions when provider is not available
    return {
      isSupported: false,
      storageUsed: 0,
      storageLimit: 0,
      downloadSession: async (_sessionId: string, _audioUrl: string, _metadata: any): Promise<boolean> => false,
      getOfflineSession: async (_sessionId: string): Promise<any> => null,
      deleteOfflineSession: async (_sessionId: string): Promise<boolean> => false,
      getAllOfflineSessions: async (): Promise<any[]> => [],
      isSessionDownloaded: async (_sessionId: string): Promise<boolean> => false,
      clearAllOfflineData: async () => false,
      isAvailable: false
    };
  }
};
