
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
  console.log('🎬 GuidedMeditationList received sessions:', sessions.length);
  console.log('🎬 Session categories:', sessions.map(s => s.category));
  
  // REMOVE THIS BROKEN FILTERING - sessions are already correctly filtered!
  // const guidedMeditations = sessions.filter(
  //   (session) => session.category === 'guided'
  // );
  
  // Use sessions directly since they're already filtered by category mapping
  const guidedMeditations = sessions;
  
  console.log('🎬 Final guided meditations to render:', guidedMeditations.length);

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
