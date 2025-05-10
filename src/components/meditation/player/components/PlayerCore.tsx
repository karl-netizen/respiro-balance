
import React, { useState, useEffect, useRef } from 'react';
import { MeditationSession } from '@/types/meditation';
import { formatTime } from '@/lib/utils';
import ProgressDisplay from './ProgressDisplay';
import SessionControls from './SessionControls';
import PausedActions from './PausedActions';
import { Card, CardContent } from '@/components/ui/card';

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
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorited, setIsFavorited] = useState(session.favorite || false);
  
  // Audio reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Timer for tracking progress
  const timerRef = useRef<number | null>(null);
  
  // Initialize audio when session changes
  useEffect(() => {
    if (session.audio_url) {
      const audio = new Audio(session.audio_url);
      audioRef.current = audio;
      audio.loop = false;
      
      audio.addEventListener('ended', handleComplete);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        audio.removeEventListener('ended', handleComplete);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [session]);
  
  // Handle time updates from audio element
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Toggle play/pause
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        if (currentTime === 0 && onStart) {
          onStart();
        }
      }
      
      setIsPlaying(!isPlaying);
      if (onPlayStateChange) {
        onPlayStateChange(!isPlaying);
      }
    }
  };
  
  // Handle session completion
  const handleComplete = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };
  
  // Skip forward 30 seconds
  const handleSkipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.currentTime + 30, audioRef.current.duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Restart session
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        handlePlayPause();
      }
    }
  };
  
  // Toggle mute
  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Toggle favorite status
  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
    // In a real app, you'd save this to the database
  };
  
  // Share session
  const handleShare = () => {
    // Implementation would depend on your sharing mechanism
    console.log('Share session:', session.id);
  };
  
  // Save progress
  const handleSaveProgress = () => {
    // Implementation would depend on your progress tracking
    console.log('Save progress at:', formatTime(currentTime));
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background shadow-md">
      <div 
        className="w-full aspect-video bg-cover bg-center rounded-t-lg"
        style={{ backgroundImage: `url(${session.image_url})` }}
      >
        <div className="w-full h-full bg-black/30 flex items-center justify-center">
          <span className="text-4xl">{session.icon || '🧘'}</span>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">{session.title}</h2>
          <p className="text-sm text-muted-foreground">
            {session.duration_minutes} minutes • {session.category || 'Meditation'}
          </p>
        </div>
        
        {/* Progress bar and time display */}
        <ProgressDisplay 
          currentTime={currentTime}
          duration={session.duration_minutes * 60}
          isPlaying={isPlaying}
        />
        
        {/* Playback controls */}
        <SessionControls 
          isPlaying={isPlaying}
          isMuted={isMuted}
          onPlayPause={handlePlayPause}
          onRestart={handleRestart}
          onSkipForward={handleSkipForward}
          onMuteToggle={handleMuteToggle}
        />
        
        {/* Only show actions when paused */}
        {!isPlaying && (
          <PausedActions 
            onFavorite={handleFavoriteToggle}
            onShare={handleShare}
            onSaveProgress={handleSaveProgress}
            isFavorited={isFavorited}
          />
        )}
        
        {/* Biometric data display if available */}
        {biometricData && !isPlaying && (
          <div className="bg-muted/50 p-3 rounded-md mt-4">
            <h3 className="text-sm font-medium mb-2">Session Biometrics</h3>
            <div className="grid grid-cols-2 gap-2">
              {biometricData.focusScore !== undefined && (
                <div>
                  <span className="text-xs text-muted-foreground">Focus Score</span>
                  <p className="text-lg font-medium">{biometricData.focusScore}%</p>
                </div>
              )}
              {biometricData.calmScore !== undefined && (
                <div>
                  <span className="text-xs text-muted-foreground">Calm Score</span>
                  <p className="text-lg font-medium">{biometricData.calmScore}%</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCore;
