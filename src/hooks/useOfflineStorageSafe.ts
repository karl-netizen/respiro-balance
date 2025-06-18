
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
      downloadSession: async (sessionId: string, audioUrl: string, metadata: any) => false,
      getOfflineSession: async (sessionId: string) => null,
      deleteOfflineSession: async (sessionId: string) => false,
      getAllOfflineSessions: async () => [],
      isSessionDownloaded: async (sessionId: string) => false,
      clearAllOfflineData: async () => false,
      isAvailable: false
    };
  }
};
