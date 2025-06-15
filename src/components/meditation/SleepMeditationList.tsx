
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import MeditationSessionList from './MeditationSessionList';

export interface SleepMeditationListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const SleepMeditationList: React.FC<SleepMeditationListProps> = ({
  sessions,
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  // Filter sessions for sleep meditations
  const sleepMeditations = sessions.filter(
    (session) => session.category === 'sleep'
  );

  if (sleepMeditations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sleep meditations available</p>
      </div>
    );
  }

  return (
    <MeditationSessionList
      sessions={sleepMeditations}
      onSelectSession={onSelectSession}
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
    />
  );
};

export default SleepMeditationList;
