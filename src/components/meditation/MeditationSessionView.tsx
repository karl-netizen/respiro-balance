import React, { useState, useEffect, useRef } from 'react';
import { MeditationSession } from '@/types/meditation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Star, Pause, Play, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MeditationSessionViewProps {
  session: MeditationSession;
  onComplete: (completedSession: MeditationSession, feedback?: { rating: number; notes?: string }) => void;
  isPremium: boolean;
}

const MeditationSessionView: React.FC<MeditationSessionViewProps> = ({
  session,
  onComplete,
  isPremium
}) => {
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
    if (session.audioUrl) {
      audioRef.current = new Audio(session.audioUrl);
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
  }, [session.audioUrl]);
  
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
  
  const progress = (currentTime / duration) * 100;
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{session.title}</CardTitle>
          <CardDescription>{session.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div 
            className="h-48 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-md flex items-center justify-center"
            style={session.imageUrl ? { backgroundImage: `url(${session.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {!session.imageUrl && (
              <div className="text-6xl">{session.icon || '🧘'}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleReset}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-full"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              <Slider
                value={[volume]}
                min={0}
                max={100}
                step={1}
                className="w-24"
                onValueChange={(value) => setVolume(value[0])}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleSessionEnd}
          >
            End Session
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate your meditation experience</DialogTitle>
            <DialogDescription>
              How was your meditation session? Your feedback helps us improve.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 flex flex-col space-y-6">
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-all",
                      rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
            
            <Textarea
              placeholder="Share your thoughts about this session (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button onClick={handleSubmitRating}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeditationSessionView;
