
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Play, Wifi, WifiOff } from 'lucide-react';
import { useOfflineStorage } from './offline/OfflineStorageProvider';
import { MeditationSession } from '@/types/meditation';
import { toast } from 'sonner';

interface OfflineSession {
  id: string;
  audioBlob: Blob;
  metadata: MeditationSession;
  downloadedAt: string;
  size: number;
}

interface OfflineSessionsListProps {
  onPlaySession?: (session: MeditationSession) => void;
}

export const OfflineSessionsList: React.FC<OfflineSessionsListProps> = ({
  onPlaySession
}) => {
  const [offlineSessions, setOfflineSessions] = useState<OfflineSession[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { getAllOfflineSessions, deleteOfflineSession, storageUsed, storageLimit } = useOfflineStorage();

  useEffect(() => {
    loadOfflineSessions();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineSessions = async () => {
    const sessions = await getAllOfflineSessions();
    setOfflineSessions(sessions);
  };

  const handleDeleteSession = async (sessionId: string) => {
    const success = await deleteOfflineSession(sessionId);
    if (success) {
      await loadOfflineSessions();
    }
  };

  const handlePlaySession = (session: OfflineSession) => {
    if (onPlaySession) {
      onPlaySession(session.metadata);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const storagePercentage = storageLimit > 0 ? (storageUsed / storageLimit) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Offline Mode</span>
                </>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {offlineSessions.length} sessions available offline
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: {formatFileSize(storageUsed)}</span>
              <span>Available: {formatFileSize(storageLimit - storageUsed)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(storagePercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {storagePercentage.toFixed(1)}% of device storage used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Downloaded Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Downloaded Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {offlineSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No sessions downloaded yet
              </p>
              <p className="text-sm text-muted-foreground">
                Download sessions to access them offline
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {offlineSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{session.metadata.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{session.metadata.duration} min</span>
                      <span>{formatFileSize(session.size)}</span>
                      <span>Downloaded {formatDate(session.downloadedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlaySession(session)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
