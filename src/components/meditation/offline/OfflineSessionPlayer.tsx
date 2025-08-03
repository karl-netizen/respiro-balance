
import React, { useState, useEffect } from 'react';
import { MeditationSession } from '@/types/meditation';
import { useOfflineStorage } from './OfflineStorageProvider';
import { MobilePlayerLayout } from '../player/components/MobilePlayerLayout';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';
import { useMobileAudio } from '../hooks/useMobileAudio';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OfflineSessionPlayerProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onAudioTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const OfflineSessionPlayer: React.FC<OfflineSessionPlayerProps> = ({
  session,
  onComplete,
  onStart,
  onPlayStateChange,
  onAudioTimeUpdate
}) => {
  const { deviceType } = useDeviceDetection();
  const { getOfflineSession, downloadSession, isSessionDownloaded } = useOfflineStorage();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  // Use the mobile audio hook
  const {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    play,
    pause,
    seek,
    setVolume: setAudioVolume
  } = useMobileAudio({
    audioUrl,
    onPlay: onStart,
    onPause: () => onPlayStateChange?.(false),
    onComplete,
    onTimeUpdate: onAudioTimeUpdate
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    loadAudioSource();
    checkIfDownloaded();
  }, [session.id]);

  const loadAudioSource = async () => {
    try {
      // First try to get offline version
      const offlineSession = await getOfflineSession(session.id);
      
      if (offlineSession) {
        // Create blob URL for offline audio
        const blobUrl = URL.createObjectURL(offlineSession.audioBlob);
        setAudioUrl(blobUrl);
        setIsDownloaded(true);
        return;
      }

      // Fall back to online URL if available
      if (!isOffline && session.audio_url) {
        setAudioUrl(session.audio_url);
        setIsDownloaded(false);
      } else if (isOffline) {
        toast.error('Session not available offline. Please download first.');
      }
    } catch (error) {
      console.error('Error loading audio source:', error);
      toast.error('Failed to load session audio');
    }
  };

  const checkIfDownloaded = async () => {
    const downloaded = await isSessionDownloaded(session.id);
    setIsDownloaded(downloaded);
  };

  const handleDownload = async () => {
    if (!session.audio_url) {
      toast.error('No audio available for download');
      return;
    }

    setIsDownloading(true);
    try {
      const success = await downloadSession(session.id, session.audio_url, session);
      if (success) {
        setIsDownloaded(true);
        await loadAudioSource(); // Reload to use offline version
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      onPlayStateChange?.(false);
    } else {
      play();
      onPlayStateChange?.(true);
    }
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setAudioVolume(newVolume);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    setAudioVolume(isMuted ? volume : 0);
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 10);
    seek(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 30);
    seek(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Show connection status and download options
  const ConnectionStatus = () => (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-4">
      <div className="flex items-center space-x-2">
        {isOffline ? (
          <>
            <WifiOff className="h-4 w-4 text-orange-500" />
            <span className="text-sm">Offline Mode</span>
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-sm">Online</span>
          </>
        )}
      </div>
      
      {!isDownloaded && !isOffline && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? 'Downloading...' : 'Download'}
        </Button>
      )}
      
      {isDownloaded && (
        <span className="text-sm text-green-600 font-medium">
          ✓ Available Offline
        </span>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading session...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || (!audioUrl && isOffline && !isDownloaded)) {
    return (
      <Card>
        <CardContent className="p-6">
          <ConnectionStatus />
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              {isOffline 
                ? 'This session is not available offline. Please download it when online.'
                : 'Unable to load session audio.'
              }
            </p>
            {!isOffline && !isDownloaded && session.audio_url && (
              <Button onClick={handleDownload} disabled={isDownloading}>
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download for Offline Use'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (deviceType === 'mobile') {
    return (
      <div className="space-y-4">
        <ConnectionStatus />
        <MobilePlayerLayout
          title={session.title}
          description={session.description}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          progress={progress}
          onPlayPause={handlePlayPause}
          onSkipBack={handleSkipBack}
          onSkipForward={handleSkipForward}
          onToggleMute={handleToggleMute}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          formatTime={formatTime}
        />
      </div>
    );
  }

  // Desktop layout
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <ConnectionStatus />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{session.title}</h3>
            {session.description && (
              <p className="text-sm text-muted-foreground">{session.description}</p>
            )}
          </div>

          {/* Desktop player controls would go here */}
          <div className="text-center">
            <Button onClick={handlePlayPause} size="lg">
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>

          <div className="text-sm text-center">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
