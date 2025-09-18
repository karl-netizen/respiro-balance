import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { MeditationContent, PlaybackState } from '../types/meditation.types';

export const useAudioPlayer = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentContent: null,
    currentTime: 0,
    duration: 0
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const play = useCallback(async (content: MeditationContent, audioUrl?: string) => {
    try {
      if (audioRef.current) {
        // If switching to a different track, stop current playback
        if (playbackState.currentContent?.id !== content.id) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        // Set the audio source
        const sourceUrl = audioUrl || content.audio_file_url;
        if (sourceUrl && audioRef.current.src !== sourceUrl) {
          audioRef.current.src = sourceUrl;
        }

        await audioRef.current.play();
        
        setPlaybackState(prev => ({
          ...prev,
          isPlaying: true,
          currentContent: content
        }));

        toast.success(`Playing: ${content.title}`);
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
      toast.error('Failed to play audio. Please try again.');
    }
  }, [playbackState.currentContent?.id]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: false
      }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaybackState({
        isPlaying: false,
        currentContent: null,
        currentTime: 0,
        duration: 0
      });
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setPlaybackState(prev => ({
        ...prev,
        currentTime: time
      }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Audio event handlers
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setPlaybackState(prev => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0,
        duration: audioRef.current?.duration || 0
      }));
    }
  }, []);

  const handleEnded = useCallback(() => {
    setPlaybackState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0
    }));
    toast.success('Meditation session completed!');
  }, []);

  return {
    playbackState,
    audioRef,
    play,
    pause,
    stop,
    seek,
    setVolume,
    handleTimeUpdate,
    handleEnded
  };
};