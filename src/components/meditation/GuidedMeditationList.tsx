
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import MeditationSessionList, { MeditationSessionListProps } from './MeditationSessionList';

// Reuse the same props interface from the common component
export type GuidedMeditationListProps = MeditationSessionListProps;

const GuidedMeditationList: React.FC<GuidedMeditationListProps> = ({ 
  sessions, 
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <MeditationSessionList
      sessions={sessions}
      onSelectSession={onSelectSession}
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
    />
  );
};

export default GuidedMeditationList;
