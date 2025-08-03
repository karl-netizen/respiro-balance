
import React, { memo, useCallback, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Download, Check, Heart, Play } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';
import { useOfflineStorageSafe } from '@/hooks/useOfflineStorageSafe';
import { DownloadProgressIndicator } from './offline/DownloadProgressIndicator';

interface MeditationSessionCardProps {
  session: MeditationSession;
  onSelectSession: (session: MeditationSession) => void;
  onToggleFavorite: (session: MeditationSession) => void;
  isFavorite: boolean;
  className?: string;
}

const MeditationSessionCard = memo<MeditationSessionCardProps>(({
  session,
  onSelectSession,
  onToggleFavorite,
  isFavorite,
  className = ""
}) => {
  const { isSessionDownloaded, downloadSession, isAvailable } = useOfflineStorageSafe();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handlePlay = useCallback(() => {
    onSelectSession(session);
  }, [session, onSelectSession]);

  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(session);
  }, [session, onToggleFavorite]);

  useEffect(() => {
    if (isAvailable) {
      checkDownloadStatus();
    }
  }, [session.id, isAvailable]);

  const checkDownloadStatus = async () => {
    if (!isAvailable) return;
    
    try {
      const downloaded = await isSessionDownloaded(session.id);
      setIsDownloaded(downloaded);
    } catch (error) {
      console.error('Error checking download status:', error);
      setIsDownloaded(false);
    }
  };

  const handleDownload = async () => {
    if (!session.audio_url || !isAvailable) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const success = await downloadSession(session.id, session.audio_url, session);
      if (success) {
        setDownloadProgress(100);
        setIsDownloaded(true);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      clearInterval(progressInterval);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const showDownloadButton = isAvailable && !isDownloaded && !isDownloading && session.audio_url;

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-lg transition-all duration-300 hover:shadow-primary/20 ${className}`}
      onClick={handlePlay}
    >
      <CardContent className="p-4">
        {session.image_url && (
          <div className="relative mb-3 overflow-hidden rounded-lg">
            <img 
              src={session.image_url} 
              alt={session.title}
              className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                {session.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className="p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Heart 
                  className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                />
              </Button>
              {isDownloaded && (
                <Badge variant="secondary" className="text-xs" data-guide="offline-badge">
                  <Check className="h-3 w-3 mr-1" />
                  Downloaded
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {session.description}
            </p>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{session.duration} min</span>
              </div>
              {session.instructor && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{session.instructor}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isDownloading && (
          <div className="mb-3">
            <DownloadProgressIndicator
              status="downloading"
              progress={downloadProgress}
              size="sm"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            onClick={handlePlay}
            className="flex-1 h-9"
            size="sm"
            data-guide="play-button"
          >
            Play
          </Button>
          
          {showDownloadButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="px-3"
              data-guide="download-button"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {session.premium && (
          <div className="flex mt-2">
            <span className="inline-block px-2 py-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs rounded-full">
              Premium
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

MeditationSessionCard.displayName = 'MeditationSessionCard';

export default MeditationSessionCard;
