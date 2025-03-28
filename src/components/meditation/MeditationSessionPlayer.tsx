
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { MeditationSession } from './MeditationSessionCard';

interface MeditationSessionPlayerProps {
  session: MeditationSession;
  onComplete: (sessionId: string) => void;
}

const MeditationSessionPlayer: React.FC<MeditationSessionPlayerProps> = ({ 
  session,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(session.duration * 60); // in seconds
  const [volume, setVolume] = React.useState(70);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            onComplete(session.id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining, session.id, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeRemaining(session.duration * 60);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full bg-secondary h-2 rounded-full">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(timeRemaining / (session.duration * 60)) * 100}%` }}
            />
          </div>
          
          <div className="text-3xl font-mono">
            {formatTime(timeRemaining)}
          </div>
          
          <div className="flex items-center justify-center space-x-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleReset}
              disabled={isPlaying && timeRemaining === session.duration * 60}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button 
              size="icon" 
              className="h-12 w-12 rounded-full" 
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-foreground/70" />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationSessionPlayer;
