
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Trash2, Pause, Play, Check } from 'lucide-react';
import { useOfflineStorage } from './OfflineStorageProvider';
import { MeditationSession } from '@/types/meditation';
import { toast } from 'sonner';

interface DownloadItem {
  session: MeditationSession;
  status: 'pending' | 'downloading' | 'completed' | 'error' | 'paused';
  progress: number;
  error?: string;
}

interface OfflineDownloadManagerProps {
  sessions: MeditationSession[];
}

export const OfflineDownloadManager: React.FC<OfflineDownloadManagerProps> = ({ sessions }) => {
  const [downloadQueue, setDownloadQueue] = useState<DownloadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadedSessions, setDownloadedSessions] = useState<Set<string>>(new Set());
  const { 
    isSupported, 
    storageUsed, 
    storageLimit, 
    downloadSession, 
    deleteOfflineSession,
    getAllOfflineSessions
  } = useOfflineStorage();

  useEffect(() => {
    loadDownloadedSessions();
  }, []);

  useEffect(() => {
    if (!isProcessing && downloadQueue.some(item => item.status === 'pending')) {
      processNextDownload();
    }
  }, [downloadQueue, isProcessing]);

  const loadDownloadedSessions = async () => {
    const offlineSessions = await getAllOfflineSessions();
    const sessionIds = new Set(offlineSessions.map(session => session.id));
    setDownloadedSessions(sessionIds);
  };

  const addToDownloadQueue = (session: MeditationSession) => {
    if (downloadedSessions.has(session.id)) {
      toast.info('Session already downloaded');
      return;
    }

    if (downloadQueue.some(item => item.session.id === session.id)) {
      toast.info('Session already in download queue');
      return;
    }

    const newItem: DownloadItem = {
      session,
      status: 'pending',
      progress: 0
    };

    setDownloadQueue(prev => [...prev, newItem]);
    toast.success(`Added "${session.title}" to download queue`);
  };

  const removeFromQueue = (sessionId: string) => {
    setDownloadQueue(prev => prev.filter(item => item.session.id !== sessionId));
  };

  const pauseDownload = (sessionId: string) => {
    setDownloadQueue(prev => 
      prev.map(item => 
        item.session.id === sessionId 
          ? { ...item, status: 'paused' as const }
          : item
      )
    );
  };

  const resumeDownload = (sessionId: string) => {
    setDownloadQueue(prev => 
      prev.map(item => 
        item.session.id === sessionId 
          ? { ...item, status: 'pending' as const }
          : item
      )
    );
  };

  const processNextDownload = async () => {
    const nextItem = downloadQueue.find(item => item.status === 'pending');
    if (!nextItem || isProcessing) return;

    setIsProcessing(true);
    
    // Update status to downloading
    setDownloadQueue(prev => 
      prev.map(item => 
        item.session.id === nextItem.session.id 
          ? { ...item, status: 'downloading' as const }
          : item
      )
    );

    try {
      // Simulate download progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setDownloadQueue(prev => 
          prev.map(item => 
            item.session.id === nextItem.session.id 
              ? { ...item, progress }
              : item
          )
        );
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Actually download the session
      const success = await downloadSession(
        nextItem.session.id,
        nextItem.session.audio_url || '',
        nextItem.session
      );

      if (success) {
        setDownloadQueue(prev => 
          prev.map(item => 
            item.session.id === nextItem.session.id 
              ? { ...item, status: 'completed' as const, progress: 100 }
              : item
          )
        );
        
        setDownloadedSessions(prev => new Set([...prev, nextItem.session.id]));
        
        // Remove completed item after a short delay
        setTimeout(() => {
          removeFromQueue(nextItem.session.id);
        }, 2000);
      } else {
        setDownloadQueue(prev => 
          prev.map(item => 
            item.session.id === nextItem.session.id 
              ? { ...item, status: 'error' as const, error: 'Download failed' }
              : item
          )
        );
      }
    } catch (error) {
      setDownloadQueue(prev => 
        prev.map(item => 
          item.session.id === nextItem.session.id 
            ? { ...item, status: 'error' as const, error: 'Download failed' }
            : item
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteOfflineSession = async (sessionId: string) => {
    const success = await deleteOfflineSession(sessionId);
    if (success) {
      setDownloadedSessions(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }
  };

  const formatStorageSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const storagePercentage = storageLimit > 0 ? (storageUsed / storageLimit) * 100 : 0;

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Offline Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Offline downloads are not supported on this device.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Storage Usage
            <span className="text-sm font-normal">
              {formatStorageSize(storageUsed)} / {formatStorageSize(storageLimit)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={storagePercentage} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {downloadedSessions.size} sessions downloaded
          </p>
        </CardContent>
      </Card>

      {/* Available Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Available for Download</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sessions.map(session => (
              <div key={session.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <h4 className="font-medium">{session.title}</h4>
                  <p className="text-sm text-muted-foreground">{session.duration} min</p>
                </div>
                <div className="flex items-center space-x-2">
                  {downloadedSessions.has(session.id) ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOfflineSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToDownloadQueue(session)}
                      disabled={downloadQueue.some(item => item.session.id === session.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Queue */}
      {downloadQueue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Download Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {downloadQueue.map(item => (
                <div key={item.session.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{item.session.title}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.status}
                        {item.error && ` - ${item.error}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.status === 'downloading' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => pauseDownload(item.session.id)}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {item.status === 'paused' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resumeDownload(item.session.id)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromQueue(item.session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {(item.status === 'downloading' || item.status === 'completed') && (
                    <Progress value={item.progress} className="w-full" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
