
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';
import { getMeditationAudioUrl } from '@/lib/meditationAudioIntegration';

interface UseSessionPlayerProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const useSessionPlayer = ({ 
  session, 
  onComplete,
  onStart,
  onPlayStateChange
}: UseSessionPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(session.duration * 60);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Get audio URL when session changes
  useEffect(() => {
    if (session.audio_url) {
      const url = getMeditationAudioUrl(session.audio_url);
      setAudioUrl(url);
      console.log("Using session's audio_url:", session.audio_url, "resolved to:", url);
    } else {
      const url = getMeditationAudioUrl(`${session.id}.mp3`);
      setAudioUrl(url);
      console.log("Using session ID for audio:", session.id, "resolved to:", url);
    }
  }, [session]);

  const togglePlayPause = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    if (onPlayStateChange) {
      onPlayStateChange(newPlayState);
    }
    
    if (newPlayState && !hasStarted) {
      setHasStarted(true);
      if (onStart) onStart();
      
      toast(session.title, {
        description: `${session.duration} minutes`
      });
    }
  };

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
    
    toast("Session completed", {
      description: `You've completed ${session.title}`
    });
  };

  const handleAudioPlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      if (onStart) onStart();
    }
    setIsPlaying(true);
    
    if (onPlayStateChange) {
      onPlayStateChange(true);
    }
  };
  
  const handleAudioPause = () => {
    setIsPlaying(false);
    
    if (onPlayStateChange) {
      onPlayStateChange(false);
    }
  };
  
  const handleAudioComplete = () => {
    setIsPlaying(false);
    setProgress(100);
    
    if (onPlayStateChange) {
      onPlayStateChange(false);
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  // Timer effect for non-audio sessions
  useEffect(() => {
    if (!audioUrl && isPlaying && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          const totalSeconds = session.duration * 60;
          const newProgress = Math.round(((totalSeconds - newTime) / totalSeconds) * 100);
          setProgress(newProgress);
          
          return newTime;
        });
      }, 1000);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } 
    
    if (!audioUrl && remainingTime === 0 && isPlaying) {
      setIsPlaying(false);
      
      if (onPlayStateChange) {
        onPlayStateChange(false);
      }
      
      if (onComplete) {
        onComplete();
      }
    }
  }, [isPlaying, remainingTime, session, onComplete, onPlayStateChange, audioUrl]);

  return {
    isPlaying,
    remainingTime,
    progress,
    audioUrl,
    togglePlayPause,
    skipToEnd,
    handleAudioPlay,
    handleAudioPause,
    handleAudioComplete,
  };
};
