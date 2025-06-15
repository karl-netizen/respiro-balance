
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MeditationSession } from '@/types/meditation';
import EnhancedSessionPlayer from '../../EnhancedSessionPlayer';

interface SessionPlayerCardProps {
  session: MeditationSession;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  biometricData?: {
    focusScore?: number;
    calmScore?: number;
  };
  onAudioTimeUpdate?: (currentTime: number, duration: number) => void;
}

const SessionPlayerCard: React.FC<SessionPlayerCardProps> = ({
  session,
  onComplete,
  onStart,
  onPlayStateChange,
  biometricData,
  onAudioTimeUpdate
}) => {
  return (
    <Card className="border-4 border-white bg-respiro-dark hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <CardContent className="pt-6 bg-respiro-dark rounded-md shadow-lg">
        <EnhancedSessionPlayer
          session={session}
          onComplete={onComplete}
          onStart={onStart}
          onPlayStateChange={onPlayStateChange}
          biometricData={biometricData}
          onAudioTimeUpdate={onAudioTimeUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default SessionPlayerCard;
