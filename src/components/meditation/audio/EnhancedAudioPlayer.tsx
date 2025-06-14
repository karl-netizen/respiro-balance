
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface BackgroundSound {
  id: string;
  name: string;
  url: string;
  icon: string;
}

interface EnhancedAudioPlayerProps {
  audioUrl?: string;
  title: string;
  onPlay?: () => void;
  onPause?: () => void;
  onComplete?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  autoPlay?: boolean;
}

const backgroundSounds: BackgroundSound[] = [
  { id: 'none', name: 'None', url: '', icon: '🔇' },
  { id: 'rain', name: 'Rain', url: '/audio/backgrounds/rain.mp3', icon: '🌧️' },
  { id: 'ocean', name: 'Ocean Waves', url: '/audio/backgrounds/ocean.mp3', icon: '🌊' },
  { id: 'forest', name: 'Forest', url: '/audio/backgrounds/forest.mp3', icon: '🌲' },
  { id: 'birds', name: 'Birds', url: '/audio/backgrounds/birds.mp3', icon: '🐦' },
  { id: 'fire', name: 'Crackling Fire', url: '/audio/backgrounds/fire.mp3', icon: '🔥' },
  { id: 'wind', name: 'Wind', url: '/audio/backgrounds/wind.mp3', icon: '💨' }
];

const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({
  audioUrl,
  title,
  onPlay,
  onPause,
  onComplete,
  onTimeUpdate,
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [backgroundVolume, setBackgroundVolume] = useState(30);
  const [selectedBackground, setSelectedBackground] = useState('none');
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    if (audioUrl) {
      voiceAudioRef.current = new Audio(audioUrl);
      const voiceAudio = voiceAudioRef.current;

      voiceAudio.addEventListener('loadedmetadata', () => {
        setDuration(voiceAudio.duration);
        setIsLoading(false);
      });

      voiceAudio.addEventListener('timeupdate', () => {
        setCurrentTime(voiceAudio.currentTime);
        if (onTimeUpdate) {
          onTimeUpdate(voiceAudio.currentTime, voiceAudio.duration);
        }
      });

      voiceAudio.addEventListener('ended', () => {
        setIsPlaying(false);
        if (backgroundAudioRef.current) {
          backgroundAudioRef.current.pause();
        }
        if (onComplete) {
          onComplete();
        }
      });

      voiceAudio.addEventListener('loadstart', () => setIsLoading(true));
      voiceAudio.addEventListener('canplaythrough', () => setIsLoading(false));

      voiceAudio.volume = voiceVolume / 100;

      if (autoPlay) {
        voiceAudio.play().catch(console.error);
        setIsPlaying(true);
      }
    }

    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current = null;
      }
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
    };
  }, [audioUrl, autoPlay, onComplete, onTimeUpdate, voiceVolume]);

  // Handle background sound changes
  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current = null;
    }

    if (selectedBackground !== 'none') {
      const backgroundSound = backgroundSounds.find(s => s.id === selectedBackground);
      if (backgroundSound?.url) {
        backgroundAudioRef.current = new Audio(backgroundSound.url);
        backgroundAudioRef.current.loop = true;
        backgroundAudioRef.current.volume = backgroundVolume / 100;

        if (isPlaying) {
          backgroundAudioRef.current.play().catch(console.error);
        }
      }
    }
  }, [selectedBackground, backgroundVolume, isPlaying]);

  // Update volumes
  useEffect(() => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.volume = isMuted ? 0 : voiceVolume / 100;
    }
  }, [voiceVolume, isMuted]);

  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = isMuted ? 0 : backgroundVolume / 100;
    }
  }, [backgroundVolume, isMuted]);

  const handlePlayPause = () => {
    if (!voiceAudioRef.current) return;

    if (isPlaying) {
      voiceAudioRef.current.pause();
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }
      if (onPause) onPause();
    } else {
      voiceAudioRef.current.play().catch(console.error);
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.play().catch(console.error);
      }
      if (onPlay) onPlay();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    handleSeek(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    handleSeek(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            className="w-full"
            onValueChange={([value]) => handleSeek(value)}
            disabled={!audioUrl || isLoading}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSkipBackward}
            disabled={!audioUrl || isLoading}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={handlePlayPause}
            disabled={!audioUrl || isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSkipForward}
            disabled={!audioUrl || isLoading}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Audio Settings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[voiceVolume]}
              max={100}
              step={1}
              className="w-24"
              onValueChange={([value]) => setVoiceVolume(value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Audio Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Voice Volume</Label>
                  <Slider
                    value={[voiceVolume]}
                    max={100}
                    step={1}
                    className="mt-2"
                    onValueChange={([value]) => setVoiceVolume(value)}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {voiceVolume}%
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Background Sound</Label>
                  <Select value={selectedBackground} onValueChange={setSelectedBackground}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {backgroundSounds.map(sound => (
                        <SelectItem key={sound.id} value={sound.id}>
                          {sound.icon} {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBackground !== 'none' && (
                  <div>
                    <Label className="text-sm font-medium">Background Volume</Label>
                    <Slider
                      value={[backgroundVolume]}
                      max={100}
                      step={1}
                      className="mt-2"
                      onValueChange={([value]) => setBackgroundVolume(value)}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {backgroundVolume}%
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAudioPlayer;
