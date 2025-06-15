
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import MeditationSessionList from './MeditationSessionList';

export interface DeepFocusListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const DeepFocusList: React.FC<DeepFocusListProps> = ({
  sessions,
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  // Filter sessions for deep focus meditations
  const deepFocusSessions = sessions.filter(
    (session) => session.category === 'deep'
  );

  if (deepFocusSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No deep focus sessions available</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <MeditationSessionList
        sessions={deepFocusSessions}
        onSelectSession={onSelectSession}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
};

export default DeepFocusList;
