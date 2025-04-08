
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipForward } from 'lucide-react';
import { MeditationSession } from './MeditationSessionCard';
import { toast } from 'sonner';

interface MeditationSessionPlayerProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const MeditationSessionPlayer: React.FC<MeditationSessionPlayerProps> = ({ 
  session, 
  onComplete,
  onStart,
  onPlayStateChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(session.duration * 60);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    if (onPlayStateChange) {
      onPlayStateChange(newPlayState);
    }
    
    if (newPlayState && !hasStarted) {
      setHasStarted(true);
      if (onStart) onStart();
      
      toast({
        title: "Meditation started",
        description: `${session.title} - ${session.duration} minutes`,
      });
    }
  };

  // Skip to end (for testing)
  const skipToEnd = () => {
    setRemainingTime(0);
    setProgress(100);
    setIsPlaying(false);
    
    if (onPlayStateChange) {
      onPlayStateChange(false);
    }
    
    if (!hasStarted && onStart) {
      onStart();
    }
    
    if (onComplete) {
      onComplete();
    }
    
    toast({
      title: "Meditation completed",
      description: `You've completed ${session.title}`,
    });
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          // Calculate progress percentage
          const totalSeconds = session.duration * 60;
          const newProgress = Math.round(((totalSeconds - newTime) / totalSeconds) * 100);
          setProgress(newProgress);
          
          return newTime;
        });
      }, 1000);
    } else if (remainingTime === 0 && isPlaying) {
      setIsPlaying(false);
      
      if (onPlayStateChange) {
        onPlayStateChange(false);
      }
      
      if (onComplete) {
        onComplete();
      }
      
      toast({
        title: "Meditation completed",
        description: `You've completed ${session.title}`,
      });
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, remainingTime, session, onComplete, onPlayStateChange]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="w-full bg-secondary rounded-full h-2.5 mb-6">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-3xl font-mono mb-8">
            {formatTime(remainingTime)}
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={skipToEnd}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationSessionPlayer;
