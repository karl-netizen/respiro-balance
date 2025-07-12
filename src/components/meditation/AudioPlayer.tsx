import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  X,
  Download
} from 'lucide-react';
import { MeditationContent } from '@/hooks/useMeditationContent';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  content: MeditationContent;
  onProgress: (progressSeconds: number) => void;
  onComplete: () => void;
  onClose: () => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  content,
  onProgress,
  onComplete,
  onClose,
  className
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Playback error:', err);
        setError('Failed to play audio. Please try again.');
      });
    }
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current || !duration) return;
    
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.volume = newMuted ? 0 : volume;
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  // For demo purposes, we'll create a placeholder audio URL
  // In production, this would come from your content management system
  const getAudioUrl = (content: MeditationContent): string => {
    if (content.audio_file_url) {
      return content.audio_file_url;
    }
    
    // Demo: Generate a placeholder audio URL
    // In production, replace this with actual audio file URLs
    return `https://www.soundjay.com/misc/sounds/meditation-${content.id}.mp3`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onProgress(Math.floor(audio.currentTime));
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onComplete();
    };

    const handleError = () => {
      setError('Audio failed to load. This content may not have audio available yet.');
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onProgress, onComplete]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2 truncate">{content.title}</CardTitle>
            <CardDescription className="text-sm">
              {content.instructor} • {content.category}
            </CardDescription>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{content.difficulty_level}</Badge>
              <Badge variant="outline">{formatTime(content.duration)}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={getAudioUrl(content)}
          preload="metadata"
          loop={isLooping}
        />

        {/* Error State */}
        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {error}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Note: This is a demo version. Actual audio content will be available in production.
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
            disabled={isLoading || error !== null}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipBackward}
            disabled={isLoading || error !== null}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            onClick={handlePlayPause}
            disabled={isLoading || error !== null}
            size="lg"
            className="rounded-full w-12 h-12"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={skipForward}
            disabled={isLoading || error !== null}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              disabled={isLoading || error !== null}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-20"
              disabled={isLoading || error !== null}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLoop}
              disabled={isLoading || error !== null}
              className={cn(isLooping && "text-primary")}
            >
              <Repeat className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading || error !== null}
              onClick={() => {
                // In production, this would download the audio file
                alert('Download feature coming soon!');
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Description */}
        {content.description && (
          <div className="pt-4 border-t dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {content.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};