
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import MeditationSessionList from './MeditationSessionList';

export interface QuickBreaksListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const QuickBreaksList: React.FC<QuickBreaksListProps> = ({
  sessions,
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  console.log('🎬 QuickBreaksList received sessions:', sessions.length);
  
  // REMOVE BROKEN FILTERING - sessions are already correctly filtered!
  // const quickBreaks = sessions.filter(
  //   (session) => session.category === 'quick'
  // );
  
  // Use sessions directly since they're already filtered by category mapping
  const quickBreaks = sessions;

  if (quickBreaks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No quick break sessions available</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <MeditationSessionList
        sessions={quickBreaks}
        onSelectSession={onSelectSession}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
};

export default QuickBreaksList;
