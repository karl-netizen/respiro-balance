import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { validateAndFixAudioUrl, preloadAudio } from '@/utils/audioValidation';

interface AudioFile {
  id: string;
  file_name?: string;
  audio_url?: string;
  file_path?: string;
  title?: string;
  loadError?: string;
}

interface RobustAudioPlayerProps {
  audioFile: AudioFile;
  showDownload?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
  onProgress?: (currentTime: number, duration: number) => void;
  className?: string;
}

export const RobustAudioPlayer: React.FC<RobustAudioPlayerProps> = ({
  audioFile,
  showDownload = false,
  onPlayingChange,
  onProgress,
  className
}) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAudio = async () => {
      const audioUrl = audioFile?.audio_url || audioFile?.file_path;
      
      if (!audioUrl) {
        setLoadError('No audio URL provided');
        setIsLoading(false);
        return;
      }
      
      // Check for existing load errors
      if (audioFile.loadError) {
        setLoadError(audioFile.loadError);
        setIsLoading(false);
        return;
      }
      
      const validUrl = validateAndFixAudioUrl(audioUrl);
      if (!validUrl) {
        setLoadError('Invalid audio URL format');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setLoadError(null);
        
        // Try to preload the audio
        const audio = await preloadAudio(validUrl);
        
        // Set up event listeners
        const handleTimeUpdate = () => {
          setCurrentTime(audio.currentTime);
          onProgress?.(audio.currentTime, audio.duration);
        };
        
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
          setIsPlaying(false);
          onPlayingChange?.(false);
        };
        
        const handleError = (e: any) => {
          console.error('Audio playback error:', e);
          setLoadError('Failed to play audio file');
          setIsPlaying(false);
          onPlayingChange?.(false);
        };
        
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        
        setAudioElement(audio);
        setIsLoading(false);
        
        // Cleanup function will be handled by useEffect cleanup
        
      } catch (error) {
        console.error('Failed to load audio:', error);
        setLoadError(`Failed to load audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };
    
    loadAudio();
    
    // Cleanup function
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        setAudioElement(null);
      }
    };
  }, [audioFile?.audio_url, audioFile?.file_path, audioFile?.loadError]);
  
  const togglePlayPause = async () => {
    if (!audioElement) return;
    
    try {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
        onPlayingChange?.(false);
      } else {
        await audioElement.play();
        setIsPlaying(true);
        onPlayingChange?.(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
      setLoadError('Failed to play audio. Please try again.');
      setIsPlaying(false);
      onPlayingChange?.(false);
    }
  };
  
  const handleSeek = (value: number[]) => {
    if (!audioElement || !duration) return;
    
    const newTime = (value[0] / 100) * duration;
    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (!audioElement) return;
    
    const newVolume = value[0] / 100;
    audioElement.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    if (!audioElement) return;
    
    if (isMuted) {
      audioElement.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioElement.volume = 0;
      setIsMuted(true);
    }
  };
  
  const skipTime = (seconds: number) => {
    if (!audioElement) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audioElement.currentTime = newTime;
  };
  
  const downloadAudio = async () => {
    const audioUrl = audioFile?.audio_url || audioFile?.file_path;
    if (!audioUrl) return;
    
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = audioFile?.file_name || audioFile?.title || 'meditation-audio';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Loading audio...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (loadError) {
    return (
      <Card className={`w-full border-destructive/50 bg-destructive/5 ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Audio Error</span>
            </div>
            <p className="text-sm text-destructive">
              Failed to load audio. The audio file may not be accessible.
            </p>
            {audioFile?.audio_url && (
              <p className="text-xs text-muted-foreground break-all">
                URL: {audioFile.audio_url}
              </p>
            )}
            <p className="text-xs text-destructive font-medium">
              {loadError}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6 space-y-4">
        {/* Title */}
        {(audioFile?.title || audioFile?.file_name) && (
          <h3 className="text-lg font-semibold text-center">
            {audioFile.title || audioFile.file_name}
          </h3>
        )}
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
            disabled={!audioElement}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => skipTime(-15)}
            disabled={!audioElement}
            className="h-10 w-10"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            size="lg"
            onClick={togglePlayPause}
            disabled={!audioElement}
            className="h-12 w-12 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => skipTime(15)}
            disabled={!audioElement}
            className="h-10 w-10"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Volume and Download */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 max-w-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              disabled={!audioElement}
              className="h-8 w-8 p-0"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
              disabled={!audioElement}
            />
          </div>
          
          {showDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadAudio}
              disabled={!audioElement}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};