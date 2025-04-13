
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';
import { useMeditationSessions } from './useMeditationSessions';
import { getMeditationAudioUrl } from '@/lib/meditationAudioIntegration';
import { useSubscriptionContext } from './useSubscriptionContext';

interface UseMeditationSessionProps {
  sessionId?: string;
  initialSession?: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
}

export function useMeditationSession({
  sessionId,
  initialSession,
  onComplete,
  onStart
}: UseMeditationSessionProps = {}) {
  const [session, setSession] = useState<MeditationSession | null>(initialSession || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { startSession, completeSession } = useMeditationSessions();
  const { hasExceededUsageLimit, isPremium } = useSubscriptionContext();

  // Initialize session duration when session changes
  useEffect(() => {
    if (session && session.duration) {
      setRemainingTime(session.duration * 60);
    }
  }, [session]);

  // Handle audio URL resolution
  useEffect(() => {
    if (session) {
      // Try session's audioUrl first, then fallback to ID-based resolution
      if (session.audioUrl) {
        const url = getMeditationAudioUrl(session.audioUrl);
        console.log("Using session's audioUrl:", session.audioUrl, "resolved to:", url);
        setAudioUrl(url);
      } else {
        // Try with session ID
        const url = getMeditationAudioUrl(`${session.id}.mp3`);
        
        // If that doesn't work, try with title
        if (!url && session.title) {
          const titleUrl = getMeditationAudioUrl(
            `${session.title.toLowerCase().replace(/\s+/g, '-')}.mp3`
          );
          if (titleUrl) {
            console.log("Using title-based audio:", titleUrl);
            setAudioUrl(titleUrl);
          } else {
            console.log("No audio found for session:", session.title);
            setAudioUrl(null);
          }
        } else if (url) {
          console.log("Using ID-based audio:", url);
          setAudioUrl(url);
        }
      }
    }
  }, [session]);

  // Timer effect for non-audio sessions
  useEffect(() => {
    if (!audioUrl && isPlaying && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          const totalSeconds = session?.duration ? session.duration * 60 : 0;
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
      handleComplete();
    }
  }, [isPlaying, remainingTime, session, audioUrl]);

  const handleStart = async () => {
    if (hasExceededUsageLimit && !isPremium) {
      toast.error("You've reached your meditation limit. Please upgrade to continue.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // If we have a session ID but no session object yet, we can skip this
      if (!session && !sessionId) {
        throw new Error("No meditation session provided");
      }

      // Start session in backend if we have a sessionId
      if (sessionId) {
        const success = await startSession({
          sessionType: session?.category || "guided",  
          duration: session?.duration || 10
        });
        
        if (success) {
          toast.success("Meditation session started");
        }
      }
      
      if (onStart) {
        onStart();
      }
      
      setHasStarted(true);
    } catch (err) {
      console.error("Failed to start session:", err);
      setError(err instanceof Error ? err : new Error("Failed to start session"));
      toast.error("Failed to start session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsPlaying(false);
    setIsComplete(true);
    
    if (sessionId) {
      try {
        await completeSession(sessionId);
        toast.success("Meditation complete!");
      } catch (err) {
        console.error("Failed to complete session:", err);
        toast.error("Failed to record session completion");
      }
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  const togglePlayPause = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    if (newPlayState && !hasStarted) {
      handleStart();
    }
  };

  const skipToEnd = () => {
    setRemainingTime(0);
    setProgress(100);
    setIsPlaying(false);
    
    if (!hasStarted) {
      handleStart();
    }
    
    handleComplete();
  };

  const handleAudioPlay = () => {
    if (!hasStarted) {
      handleStart();
    }
    setIsPlaying(true);
  };
  
  const handleAudioPause = () => {
    setIsPlaying(false);
  };
  
  const handleAudioComplete = () => {
    handleComplete();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    session,
    isPlaying,
    remainingTime,
    progress,
    audioUrl,
    isLoading,
    isComplete,
    error,
    formatTime,
    togglePlayPause,
    skipToEnd,
    handleAudioPlay,
    handleAudioPause,
    handleAudioComplete,
    handleStart,
    handleComplete
  };
}
