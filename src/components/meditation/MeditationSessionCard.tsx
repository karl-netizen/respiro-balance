
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Download, Check } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';
import { useOfflineStorageSafe } from '@/hooks/useOfflineStorageSafe';
import { DownloadProgressIndicator } from './offline/DownloadProgressIndicator';

interface MeditationSessionCardProps {
  session: MeditationSession;
  onPlay: () => void;
  className?: string;
}

const MeditationSessionCard: React.FC<MeditationSessionCardProps> = ({
  session,
  onPlay,
  className = ""
}) => {
  const { isSessionDownloaded, downloadSession, isAvailable } = useOfflineStorageSafe();
  const [isDownloaded, setIsDownloaded] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState(0);

  React.useEffect(() => {
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
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                {session.title}
              </h3>
              {isDownloaded && (
                <Badge variant="secondary" className="text-xs">
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
            onClick={onPlay}
            className="flex-1 h-9"
            size="sm"
          >
            Play
          </Button>
          
          {showDownloadButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="px-3"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationSessionCard;
