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
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  // Get audio URL when session changes
  useEffect(() => {
    const loadAudioUrl = async () => {
      setIsAudioLoading(true);
      setAudioError(null);
      
      try {
        let url: string | null = null;
        
        if (session.audio_url) {
          // Use the audio_url directly since it's already a complete URL from the database
          url = session.audio_url;
          console.log("🎵 Using session's audio_url directly:", session.audio_url);
        } else {
          // Fallback to generating signed URL from session ID (async)
          url = await getMeditationAudioUrl(`${session.id}.mp3`);
          console.log("🎵 Using session ID for audio:", session.id, "resolved to:", url);
        }
        
        if (!url) {
          throw new Error('Could not generate audio URL');
        }
        
        console.log("🔍 Testing audio URL accessibility:", url);
        
        // Test if the audio URL is accessible
        const testAudio = new Audio();
        
        const testPromise = new Promise<void>((resolve, reject) => {
          testAudio.oncanplaythrough = () => {
            console.log("✅ Audio can play through:", url);
            resolve();
          };
          testAudio.onerror = (e) => {
            console.error("❌ Audio load failed:", e, "URL:", url);
            reject(new Error(`Audio load failed: ${e}`));
          };
          testAudio.onabort = () => {
            console.error("❌ Audio load aborted:", url);
            reject(new Error('Audio load aborted'));
          };
          
          // Set a timeout to avoid hanging
          setTimeout(() => {
            console.error("⏰ Audio load timeout for URL:", url);
            reject(new Error('Audio load timeout'));
          }, 10000);
        });
        
        testAudio.src = url;
        testAudio.load();
        
        await testPromise;
        
        setAudioUrl(url);
        console.log("✅ Audio URL validated successfully:", url);
        
      } catch (error) {
        console.error("❌ Failed to load audio:", error);
        setAudioError(error instanceof Error ? error.message : 'Failed to load audio');
        setAudioUrl(null);
        
        // Show user-friendly error
        toast.error("Audio unavailable", {
          description: "This session will run as a timer without audio guidance."
        });
      } finally {
        setIsAudioLoading(false);
      }
    };
    
    loadAudioUrl();
  }, [session]);

  const togglePlayPause = () => {
    // Don't allow play if audio is still loading
    if (isAudioLoading) {
      toast.warning("Please wait", {
        description: "Audio is still loading..."
      });
      return;
    }
    
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    if (onPlayStateChange) {
      onPlayStateChange(newPlayState);
    }
    
    if (newPlayState && !hasStarted) {
      setHasStarted(true);
      if (onStart) onStart();
      
      const description = audioError 
        ? `${session.duration} minutes (Timer mode - no audio)`
        : `${session.duration} minutes`;
      
      toast(session.title, {
        description
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
  
  const handleAudioError = (error: string) => {
    console.error("🔴 Audio playback error:", error);
    setAudioError(error);
    setAudioUrl(null);
    
    toast.error("Audio playback failed", {
      description: "Continuing with timer mode"
    });
  };
  
  const handleAudioTimeUpdate = (currentTime: number, duration: number) => {
    // Calculate remaining time
    const remainingSecs = Math.max(0, duration - currentTime);
    setRemainingTime(remainingSecs);
    
    // Calculate progress percentage
    const progressPercent = Math.min(100, (currentTime / duration) * 100);
    setProgress(progressPercent);
  };

  // Timer effect for non-audio sessions or when audio fails
  useEffect(() => {
    if ((!audioUrl || audioError) && isPlaying && remainingTime > 0) {
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
    
    if ((!audioUrl || audioError) && remainingTime === 0 && isPlaying) {
      setIsPlaying(false);
      
      if (onPlayStateChange) {
        onPlayStateChange(false);
      }
      
      if (onComplete) {
        onComplete();
      }
    }
  }, [isPlaying, remainingTime, session, onComplete, onPlayStateChange, audioUrl, audioError]);

  return {
    isPlaying,
    remainingTime,
    progress,
    audioUrl,
    audioError,
    isAudioLoading,
    togglePlayPause,
    skipToEnd,
    handleAudioPlay,
    handleAudioPause,
    handleAudioComplete,
    handleAudioError,
    handleAudioTimeUpdate,
  };
};