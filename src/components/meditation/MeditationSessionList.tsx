
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import MeditationSessionCard from './MeditationSessionCard';
import { useIsMobile } from "@/hooks/use-mobile";

export interface MeditationSessionListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const MeditationSessionList: React.FC<MeditationSessionListProps> = ({ 
  sessions, 
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`grid grid-cols-1 ${isMobile ? '' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-4 md:gap-6`}>
      {sessions.map((session) => (
        <MeditationSessionCard 
          key={session.id}
          session={session}
          onPlay={() => onSelectSession(session)}
        />
      ))}
    </div>
  );
};

export default MeditationSessionList;
