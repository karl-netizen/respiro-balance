
import { useState, useRef, useEffect } from 'react';
import { MeditationSession } from '@/types/meditation';

interface UseMeditationSessionProps {
  session: MeditationSession;
  onComplete: (completedSession: MeditationSession, feedback?: { rating: number; notes?: string }) => void;
}

export const useMeditationSession = ({ session, onComplete }: UseMeditationSessionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(session.duration * 60);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize audio
  useEffect(() => {
    if (session.audio_url) {
      audioRef.current = new Audio(session.audio_url);
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
      
      audioRef.current.addEventListener('ended', handleSessionEnd);
      
      // Set initial volume
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleSessionEnd);
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session.audio_url]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      } else {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleSessionEnd();
            return duration;
          }
          return prev + 1;
        });
      }
    }, 1000);
  };
  
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopTimer();
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      startTimer();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleReset = () => {
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    }
  };
  
  const handleSessionEnd = () => {
    setIsPlaying(false);
    stopTimer();
    setShowRatingDialog(true);
  };
  
  const handleSubmitRating = () => {
    const completedSession = {
      ...session,
      completed: true,
      completed_at: new Date().toISOString(),
      rating: rating
    };
    
    onComplete(completedSession, { rating, notes });
    setShowRatingDialog(false);
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return {
    isPlaying,
    currentTime,
    duration,
    showRatingDialog,
    setShowRatingDialog,
    rating,
    setRating,
    notes,
    setNotes,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    togglePlayPause,
    handleReset,
    handleSessionEnd,
    handleSubmitRating,
    formatTime
  };
};

export default useMeditationSession;
