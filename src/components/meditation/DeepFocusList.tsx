
import React from 'react';
import { MeditationSession } from './MeditationSessionCard';
import MeditationSessionCard from './MeditationSessionCard';

interface DeepFocusListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
  onToggleFavorite: (sessionId: string) => void;
}

const DeepFocusList: React.FC<DeepFocusListProps> = ({ 
  sessions, 
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <MeditationSessionCard 
          key={session.id}
          session={session}
          onSelect={() => onSelectSession(session)}
          isFavorite={isFavorite(session.id)}
          onToggleFavorite={() => onToggleFavorite(session.id)}
        />
      ))}
    </div>
  );
};

export default DeepFocusList;
