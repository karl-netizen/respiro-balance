
import React, { useState, useEffect, useRef } from 'react';
import { MeditationSession } from '@/types/meditation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import ProgressDisplay from './ProgressDisplay';

interface PlayerCoreProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  biometricData?: {
    focusScore?: number;
    calmScore?: number;
  };
}

const PlayerCore: React.FC<PlayerCoreProps> = ({ 
  session, 
  onComplete, 
  onStart,
  onPlayStateChange,
  biometricData 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio when component mounts
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(session.audio_url);
      
      // Set up event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      
      audioRef.current.addEventListener('ended', handleSessionComplete);
    }
    
    // Update audio source if session changes
    if (audioRef.current.src !== session.audio_url) {
      audioRef.current.src = session.audio_url;
      audioRef.current.load();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current.removeEventListener('timeupdate', () => {});
        audioRef.current.removeEventListener('ended', handleSessionComplete);
      }
    };
  }, [session.audio_url]);
  
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      if (!currentTime && onStart) {
        onStart();
      }
      audioRef.current?.play();
    }
    
    setIsPlaying(!isPlaying);
    if (onPlayStateChange) {
      onPlayStateChange(!isPlaying);
    }
  };
  
  const handleSessionComplete = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
    if (onPlayStateChange) {
      onPlayStateChange(false);
    }
  };
  
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 30, audioRef.current.duration);
    }
  };
  
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  // Calculate progress percentage
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  
  // Calculate session duration in minutes for display
  const sessionDurationMinutes = Math.ceil(duration / 60);

  // Format time remaining
  const timeRemaining = formatTime(Math.max(0, duration - currentTime));

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Session info */}
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <span className="text-2xl">{session.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-medium">{session.title}</h3>
              <p className="text-sm text-muted-foreground">{sessionDurationMinutes} min · {session.category}</p>
            </div>
          </div>
          
          {/* Biometrics display (if available) */}
          {biometricData && (
            <div className="grid grid-cols-2 gap-4">
              {biometricData.focusScore !== undefined && (
                <div className="bg-secondary/10 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Focus</p>
                  <p className="text-lg font-medium">{biometricData.focusScore}%</p>
                </div>
              )}
              {biometricData.calmScore !== undefined && (
                <div className="bg-secondary/10 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">Calm</p>
                  <p className="text-lg font-medium">{biometricData.calmScore}%</p>
                </div>
              )}
            </div>
          )}
          
          {/* Progress bar */}
          <ProgressDisplay 
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
          />
          
          {/* Player controls */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={skipBackward}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button 
              className="h-12 w-12 rounded-full" 
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
            </Button>
            <Button variant="outline" size="icon" onClick={skipForward}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCore;
