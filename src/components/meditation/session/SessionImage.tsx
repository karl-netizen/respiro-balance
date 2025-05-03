
import React from 'react';
import { MeditationSession } from '@/types/meditation';

interface SessionImageProps {
  session: MeditationSession;
}

const SessionImage: React.FC<SessionImageProps> = ({ session }) => {
  return (
    <div 
      className="h-48 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-md flex items-center justify-center"
      style={session.image_url ? { backgroundImage: `url(${session.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {!session.image_url && (
        <div className="text-6xl">{session.icon || '🧘'}</div>
      )}
    </div>
  );
};

export default SessionImage;
