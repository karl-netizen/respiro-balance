
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import MeditationSessionList from './MeditationSessionList';

export interface GuidedMeditationListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const GuidedMeditationList: React.FC<GuidedMeditationListProps> = ({
  sessions,
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  // Filter sessions for guided meditations
  const guidedMeditations = sessions.filter(
    (session) => session.category === 'guided'
  );

  if (guidedMeditations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No guided meditations available</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <MeditationSessionList
        sessions={guidedMeditations}
        onSelectSession={onSelectSession}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
};

export default GuidedMeditationList;
