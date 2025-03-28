
import React from 'react';
import { MeditationSession } from './MeditationSessionCard';
import MeditationSessionCard from './MeditationSessionCard';

interface QuickBreaksListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
}

const QuickBreaksList: React.FC<QuickBreaksListProps> = ({ 
  sessions, 
  onSelectSession 
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <MeditationSessionCard 
          key={session.id}
          session={session}
          onSelect={onSelectSession}
        />
      ))}
    </div>
  );
};

export default QuickBreaksList;
