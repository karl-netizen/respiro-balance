
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import MeditationSessionCard from './MeditationSessionCard';

export interface DeepFocusListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const DeepFocusList: React.FC<DeepFocusListProps> = ({ 
  sessions, 
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {sessions.map((session) => (
        <MeditationSessionCard 
          key={session.id}
          session={session}
          onSelect={() => onSelectSession(session)}
          isFavorite={isFavorite(session.id)}
          onToggleFavorite={() => onToggleFavorite(session)}
        />
      ))}
    </div>
  );
};

export default DeepFocusList;
