import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { MeditationSession } from '@/types/meditation';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import SessionCompletionDialog from './SessionCompletionDialog';
import useMeditationFeedback from '@/hooks/useMeditationFeedback';

interface EnhancedSessionPlayerProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onAudioTimeUpdate?: (currentTime: number, duration: number) => void;
  biometricData?: {
    focusScore?: number;
    calmScore?: number;
  };
}

const EnhancedSessionPlayer: React.FC<EnhancedSessionPlayerProps> = ({ 
  session,
  onComplete,
  onStart,
  onPlayStateChange,
  onAudioTimeUpdate,
  biometricData = {}
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(session.duration * 60);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const { addFeedback } = useMeditationFeedback();
  
  // Initialize audio player if there's an audio URL
  useEffect(() => {
    if (session.audio_url) {
      const audio = new Audio(session.audio_url);
      audioRef.current = audio;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        if (onAudioTimeUpdate) {
          onAudioTimeUpdate(audio.currentTime, audio.duration);
        }
      };
      
      const handleEnded = () => {
        handleSessionComplete();
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      
      // Apply initial volume
      audio.volume = isMuted ? 0 : volume;
      
      return () => {
        audio.pause();
        audio.src = '';
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
    
    // Return a cleanup function
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session.audio_url, onAudioTimeUpdate]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Handle timer for non-audio sessions
  useEffect(() => {
    if (!session.audio_url && isPlaying && !sessionCompleted) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          
          if (newTime >= duration) {
            handleSessionComplete();
            return duration;
          }
          
          if (onAudioTimeUpdate) {
            onAudioTimeUpdate(newTime, duration);
          }
          
          return newTime;
        });
      }, 1000);
      
      // Cleanup interval
      return () => {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, session.audio_url, duration, sessionCompleted, onAudioTimeUpdate]);
  
  const handlePlayPause = () => {
    if (!sessionStarted) {
      setSessionStarted(true);
      if (onStart) onStart();
      
      toast.success(`Starting ${session.title}`, {
        description: `${session.duration} minute meditation`
      });
    }
    
    if (isPlaying) {
      // Pause playback
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // Start playback
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Could not play audio", {
            description: "Please try again or choose another meditation"
          });
        });
      }
    }
    
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    if (onPlayStateChange) {
      onPlayStateChange(newPlayingState);
    }
  };
  
  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    setCurrentTime(seekTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };
  
  const handleSkipForward = () => {
    const skipTo = Math.min(currentTime + 30, duration);
    setCurrentTime(skipTo);
    
    if (audioRef.current) {
      audioRef.current.currentTime = skipTo;
    }
  };
  
  const handleSkipBack = () => {
    const skipTo = Math.max(currentTime - 10, 0);
    setCurrentTime(skipTo);
    
    if (audioRef.current) {
      audioRef.current.currentTime = skipTo;
    }
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleSessionComplete = () => {
    // Stop playback
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsPlaying(false);
    setSessionCompleted(true);
    
    if (onPlayStateChange) {
      onPlayStateChange(false);
    }
    
    // Show completion dialog
    setShowCompletionDialog(true);
  };
  
  const handleFeedbackSubmit = (rating: number, comment: string) => {
    // Save feedback
    addFeedback(session.id, rating, comment);
    
    // Call complete callback
    if (onComplete) {
      onComplete();
    }
  };
  
  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    }
  };
  
  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const progress = (currentTime / duration) * 100;
  const { focusScore = 85, calmScore = 75 } = biometricData;
  
  return (
    <>
      <Card className="w-full bg-gray-900 text-white border-gray-700">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-700" indicatorClassName="bg-respiro-light" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleMute}
                className="hover:bg-gray-800 text-white"
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
                max={1}
                step={0.01}
                className="w-24"
                onValueChange={handleVolumeChange}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkipBack}
                disabled={currentTime < 5}
                className="text-white hover:bg-gray-800 disabled:text-gray-500"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full bg-respiro-light text-gray-900 hover:bg-respiro-dark"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkipForward}
                disabled={currentTime > duration - 5}
                className="text-white hover:bg-gray-800 disabled:text-gray-500"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="w-24"></div> {/* Spacer to balance layout */}
          </div>
          
          {!isPlaying && !sessionCompleted && sessionStarted && (
            <div className="text-center mt-2">
              <Button variant="ghost" onClick={handlePlayPause} className="text-white hover:bg-gray-800">
                Resume
              </Button>
              
              <Button variant="ghost" onClick={handleSessionComplete} className="text-white hover:bg-gray-800">
                End Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <SessionCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        session={session}
        meditationStats={{
          focusScore,
          calmScore,
          timeCompleted: currentTime
        }}
        onSubmitFeedback={handleFeedbackSubmit}
        onContinue={handleContinue}
      />
    </>
  );
};

export default EnhancedSessionPlayer;
