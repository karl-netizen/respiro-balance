
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseMobileAudioProps {
  audioUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
  onComplete?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const useMobileAudio = ({
  audioUrl,
  onPlay,
  onPause,
  onComplete,
  onTimeUpdate
}: UseMobileAudioProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    // iOS/Safari specific settings
    audio.preload = 'metadata';
    audio.playsInline = true;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      console.log('Mobile audio loaded:', audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime, audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onComplete?.();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleError = (e: any) => {
      console.error('Mobile audio error:', e);
      setError('Failed to load audio');
      setIsLoading(false);
      toast.error('Audio playback error');
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Initialize media session for lock screen controls
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        audio.play().catch(console.error);
      });
      
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause();
      });
      
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
      });
      
      navigator.mediaSession.setActionHandler('seekforward', () => {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 30);
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl]);

  const play = async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
    } catch (error) {
      console.error('Play failed:', error);
      toast.error('Could not play audio');
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    error,
    play,
    pause,
    seek,
    setVolume
  };
};
