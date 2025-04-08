
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface MeditationAudioPlayerProps {
  audioUrl: string;
  onComplete?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  autoPlay?: boolean;
}

export const MeditationAudioPlayer: React.FC<MeditationAudioPlayerProps> = ({
  audioUrl,
  onComplete,
  onPlay,
  onPause,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Log the audio URL being used
  useEffect(() => {
    console.log("MeditationAudioPlayer: Using audio URL:", audioUrl);
  }, [audioUrl]);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.volume = volume;
    setIsLoading(true);
    setError(null);
    
    const handleLoadedMetadata = () => {
      console.log("Audio metadata loaded. Duration:", audio.duration);
      setDuration(audio.duration);
      setIsLoading(false);
      if (autoPlay) {
        handlePlay();
      }
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      console.log("Audio playback ended");
      setIsPlaying(false);
      setCurrentTime(0);
      if (onComplete) {
        onComplete();
      }
    };
    
    const handleError = (e: any) => {
      console.error("Audio loading error:", e);
      const errorMessage = "Error loading audio file. Please try another meditation.";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    };
    
    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Set a timeout to check if loading takes too long
    const loadingTimeout = setTimeout(() => {
      if (isLoading && !audio.duration) {
        console.warn("Audio loading timeout");
        setError("Audio file is taking too long to load. It may be unavailable.");
        setIsLoading(false);
      }
    }, 10000);
    
    return () => {
      // Clean up
      clearTimeout(loadingTimeout);
      audio.pause();
      audio.src = '';
      
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, autoPlay, onComplete, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlay = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started");
            setIsPlaying(true);
            if (onPlay) onPlay();
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            toast.error("Could not play the audio. Please try again.");
          });
      }
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      setIsMuted(!isMuted);
      audioRef.current.volume = !isMuted ? 0 : volume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-pulse text-primary">Loading audio...</div>
        </div>
      ) : error ? (
        <div className="text-center p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
          <p className="mb-2">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <div className="w-24">
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
          
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="mb-4"
          />
          
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.max(0, currentTime - 10);
                }
              }}
              title="Back 10 seconds"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            {isPlaying ? (
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handlePause}
                title="Pause"
              >
                <Pause className="h-6 w-6" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handlePlay}
                title="Play"
              >
                <Play className="h-6 w-6" />
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.min(duration, currentTime + 10);
                }
              }}
              title="Forward 10 seconds"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MeditationAudioPlayer;
