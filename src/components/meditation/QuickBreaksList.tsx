
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
  // Filter sessions for quick break meditations
  const quickBreaks = sessions.filter(
    (session) => session.category === 'quick'
  );

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
