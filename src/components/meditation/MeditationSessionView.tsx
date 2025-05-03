
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useMeditationSession from './hooks/useMeditationSession';
import { 
  SessionHeader, 
  SessionImage, 
  SessionProgressBar, 
  SessionControls, 
  SessionRating 
} from './session';

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
  const {
    isPlaying,
    currentTime,
    duration,
    showRatingDialog,
    setShowRatingDialog,
    rating,
    setRating,
    notes,
    setNotes,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    togglePlayPause,
    handleReset,
    handleSessionEnd,
    handleSubmitRating,
    formatTime
  } = useMeditationSession({ session, onComplete });
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <SessionHeader session={session} />
        
        <CardContent className="space-y-6">
          <SessionImage session={session} />
          
          <SessionProgressBar 
            currentTime={currentTime} 
            duration={duration} 
            formatTime={formatTime} 
          />
          
          <SessionControls 
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            onPlayPause={togglePlayPause}
            onReset={handleReset}
            onMuteToggle={() => setIsMuted(!isMuted)}
            onVolumeChange={(values) => setVolume(values[0])}
          />
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full bg-primary text-white hover:bg-primary/90"
            onClick={handleSessionEnd}
          >
            Begin Meditation
          </Button>
        </CardFooter>
      </Card>
      
      <SessionRating 
        showDialog={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        rating={rating}
        notes={notes}
        onRatingChange={setRating}
        onNotesChange={setNotes}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

export default MeditationSessionView;
