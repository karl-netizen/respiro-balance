
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Button } from '@/components/ui/button';
import { Clock, Heart, Share2 } from 'lucide-react';

interface SessionInfoProps {
  session: MeditationSession;
  onToggleFavorite: () => void;
  onShareSession: () => void;
}

const SessionInfo: React.FC<SessionInfoProps> = ({
  session,
  onToggleFavorite,
  onShareSession,
}) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{session.title}</h1>
      <p className="text-muted-foreground mb-4">{session.description}</p>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm">{session.duration} min</span>
        </div>
        <Button variant="outline" size="sm" onClick={onToggleFavorite}>
          <Heart className="h-4 w-4 mr-1" />
          Favorite
        </Button>
        <Button variant="outline" size="sm" onClick={onShareSession}>
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
    </>
  );
};

export default SessionInfo;
