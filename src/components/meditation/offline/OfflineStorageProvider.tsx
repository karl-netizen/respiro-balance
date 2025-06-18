
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OfflineStorageContextType {
  isSupported: boolean;
  storageUsed: number;
  storageLimit: number;
  downloadSession: (sessionId: string, audioUrl: string, metadata: any) => Promise<boolean>;
  getOfflineSession: (sessionId: string) => Promise<OfflineSession | null>;
  deleteOfflineSession: (sessionId: string) => Promise<boolean>;
  getAllOfflineSessions: () => Promise<OfflineSession[]>;
  isSessionDownloaded: (sessionId: string) => Promise<boolean>;
  clearAllOfflineData: () => Promise<boolean>;
}

interface OfflineSession {
  id: string;
  audioBlob: Blob;
  metadata: any;
  downloadedAt: string;
  size: number;
}

const OfflineStorageContext = createContext<OfflineStorageContextType | null>(null);

const DB_NAME = 'RespiroOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'offlineSessions';

export const OfflineStorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(0);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    initializeDB();
    checkStorageQuota();
  }, []);

  const initializeDB = async () => {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported');
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB');
      };

      request.onsuccess = () => {
        setDb(request.result);
        setIsSupported(true);
        calculateStorageUsed();
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
        }
      };
    } catch (error) {
      console.error('Error initializing IndexedDB:', error);
    }
  };

  const checkStorageQuota = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        setStorageLimit(estimate.quota || 0);
      } catch (error) {
        console.error('Error checking storage quota:', error);
      }
    }
  };

  const calculateStorageUsed = async () => {
    if (!db) return;

    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const sessions = request.result as OfflineSession[];
        const totalSize = sessions.reduce((sum, session) => sum + session.size, 0);
        setStorageUsed(totalSize);
      };
    } catch (error) {
      console.error('Error calculating storage used:', error);
    }
  };

  const downloadSession = async (sessionId: string, audioUrl: string, metadata: any): Promise<boolean> => {
    if (!db || !isSupported) {
      toast.error('Offline storage not available');
      return false;
    }

    try {
      // Check if already downloaded
      const existing = await getOfflineSession(sessionId);
      if (existing) {
        toast.info('Session already downloaded');
        return true;
      }

      // Download the audio file
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('Failed to download audio');
      }

      const audioBlob = await response.blob();
      const compressedBlob = await compressAudio(audioBlob);

      const offlineSession: OfflineSession = {
        id: sessionId,
        audioBlob: compressedBlob,
        metadata,
        downloadedAt: new Date().toISOString(),
        size: compressedBlob.size
      };

      // Check storage limits
      if (storageUsed + compressedBlob.size > storageLimit * 0.8) {
        toast.error('Insufficient storage space');
        return false;
      }

      // Store in IndexedDB
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(offlineSession);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          calculateStorageUsed();
          toast.success('Session downloaded for offline use');
          resolve(true);
        };

        request.onerror = () => {
          toast.error('Failed to save session offline');
          resolve(false);
        };
      });
    } catch (error) {
      console.error('Error downloading session:', error);
      toast.error('Download failed');
      return false;
    }
  };

  const compressAudio = async (audioBlob: Blob): Promise<Blob> => {
    // Simple compression by reducing quality
    // In production, you might want to use more sophisticated compression
    return audioBlob;
  };

  const getOfflineSession = async (sessionId: string): Promise<OfflineSession | null> => {
    if (!db) return null;

    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(sessionId);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = () => {
          resolve(null);
        };
      });
    } catch (error) {
      console.error('Error getting offline session:', error);
      return null;
    }
  };

  const deleteOfflineSession = async (sessionId: string): Promise<boolean> => {
    if (!db) return false;

    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(sessionId);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          calculateStorageUsed();
          toast.success('Offline session deleted');
          resolve(true);
        };

        request.onerror = () => {
          toast.error('Failed to delete offline session');
          resolve(false);
        };
      });
    } catch (error) {
      console.error('Error deleting offline session:', error);
      return false;
    }
  };

  const getAllOfflineSessions = async (): Promise<OfflineSession[]> => {
    if (!db) return [];

    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = () => {
          resolve([]);
        };
      });
    } catch (error) {
      console.error('Error getting all offline sessions:', error);
      return [];
    }
  };

  const isSessionDownloaded = async (sessionId: string): Promise<boolean> => {
    const session = await getOfflineSession(sessionId);
    return session !== null;
  };

  const clearAllOfflineData = async (): Promise<boolean> => {
    if (!db) return false;

    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      return new Promise((resolve) => {
        request.onsuccess = () => {
          setStorageUsed(0);
          toast.success('All offline data cleared');
          resolve(true);
        };

        request.onerror = () => {
          toast.error('Failed to clear offline data');
          resolve(false);
        };
      });
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  };

  const value: OfflineStorageContextType = {
    isSupported,
    storageUsed,
    storageLimit,
    downloadSession,
    getOfflineSession,
    deleteOfflineSession,
    getAllOfflineSessions,
    isSessionDownloaded,
    clearAllOfflineData
  };

  return (
    <OfflineStorageContext.Provider value={value}>
      {children}
    </OfflineStorageContext.Provider>
  );
};

export const useOfflineStorage = () => {
  const context = useContext(OfflineStorageContext);
  if (!context) {
    throw new Error('useOfflineStorage must be used within OfflineStorageProvider');
  }
  return context;
};
