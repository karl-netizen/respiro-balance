
import React from 'react';
import { MeditationSession } from './MeditationSessionCard';
import MeditationSessionCard from './MeditationSessionCard';

interface GuidedMeditationListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

const GuidedMeditationList: React.FC<GuidedMeditationListProps> = ({ 
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
          onSelect={onSelectSession}
          isFavorite={isFavorite(session.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default GuidedMeditationList;
