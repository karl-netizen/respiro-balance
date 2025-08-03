
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MeditationContent {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty_level: string;
  instructor: string;
  audio_file_url?: string;
  tags: string[];
}

const MeditationSessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const [content, setContent] = useState<MeditationContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchMeditationContent();
    }
  }, [sessionId]);

  const fetchMeditationContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('meditation_content')
        .select('*')
        .eq('id', sessionId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load meditation session');
        return;
      }

      if (!data) {
        toast.error('Meditation session not found');
        navigate('/meditation');
        return;
      }

      setContent(data);
      console.log('Loaded content:', data);
      console.log('Audio URL:', data.audio_file_url);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      toast.success('Meditation session completed!');
    };

    const handleError = (e: any) => {
      console.error('Audio error:', e);
      setAudioError('Failed to load audio. The audio file may not be accessible.');
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
      setAudioError(null);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [content]);

  const handlePlayPause = () => {
    if (!audioRef.current || !content?.audio_file_url) {
      toast.error('No audio available for this session');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Playback error:', err);
        setAudioError('Failed to play audio. Please try again.');
      });
    }
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.volume = newMuted ? 0 : volume;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading meditation session...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Session Not Found</h2>
          <Button onClick={() => navigate('/meditation')}>
            Return to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/meditation')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
              <p className="text-muted-foreground mb-4">{content.description}</p>
              <div className="flex gap-2 mb-2">
                <Badge variant="secondary">{content.category}</Badge>
                <Badge variant="outline">{content.difficulty_level}</Badge>
                <Badge variant="outline">{content.instructor}</Badge>
              </div>
              {content.tags && content.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {content.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {content.audio_file_url && (
            <audio
              ref={audioRef}
              src={content.audio_file_url}
              preload="metadata"
            />
          )}

          {audioError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-destructive">
                {audioError}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Audio URL: {content.audio_file_url || 'No audio URL provided'}
              </p>
            </div>
          )}

          {!content.audio_file_url && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                No audio file is attached to this meditation session.
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2 mb-6">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
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
              disabled={!content.audio_file_url || audioError !== null}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              onClick={handlePlayPause}
              disabled={!content.audio_file_url || audioError !== null}
              size="lg"
              className="rounded-full w-16 h-16"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={skipForward}
              disabled={!content.audio_file_url || audioError !== null}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              disabled={!content.audio_file_url || audioError !== null}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <span className="text-sm text-muted-foreground">
              Duration: {formatTime(content.duration)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationSessionPage;
