
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
      <h1 className="text-2xl font-bold mb-2 text-white">{session.title}</h1>
      <p className="text-gray-300 mb-4">{session.description}</p>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          <span className="text-sm text-gray-300">{session.duration} min</span>
        </div>
        <Button variant="outline" size="sm" onClick={onToggleFavorite} className="border-gray-700 text-white hover:bg-gray-800 hover:text-respiro-light">
          <Heart className="h-4 w-4 mr-1" />
          Favorite
        </Button>
        <Button variant="outline" size="sm" onClick={onShareSession} className="border-gray-700 text-white hover:bg-gray-800 hover:text-respiro-light">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
    </>
  );
};

export default SessionInfo;
