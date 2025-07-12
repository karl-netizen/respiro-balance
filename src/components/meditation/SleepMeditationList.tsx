
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
  console.log('🎬 SleepMeditationList received sessions:', sessions.length);
  
  // REMOVE BROKEN FILTERING - sessions are already correctly filtered!
  // const sleepMeditations = sessions.filter(
  //   (session) => session.category === 'sleep'
  // );
  
  // Use sessions directly since they're already filtered by category mapping
  const sleepMeditations = sessions;

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
