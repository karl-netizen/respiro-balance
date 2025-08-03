
import React, { memo, useCallback } from 'react';
import { MeditationSession } from '@/types/meditation';
import MeditationSessionCard from './MeditationSessionCard';
import { useIsMobile } from "@/hooks/use-mobile";

export interface MeditationSessionListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const MeditationSessionList = memo<MeditationSessionListProps>(({ 
  sessions, 
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  const isMobile = useIsMobile();
  
  const handleSelectSession = useCallback((session: MeditationSession) => {
    onSelectSession(session);
  }, [onSelectSession]);
  
  const handleToggleFavorite = useCallback((session: MeditationSession) => {
    onToggleFavorite(session);
  }, [onToggleFavorite]);
  
  return (
    <div className={`grid grid-cols-1 ${isMobile ? '' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 md:gap-6`}>
      {sessions.map((session) => (
        <MeditationSessionCard 
          key={session.id}
          session={session}
          onSelectSession={handleSelectSession}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite(session.id)}
        />
      ))}
    </div>
  );
});

MeditationSessionList.displayName = 'MeditationSessionList';

export default MeditationSessionList;
