
import React from 'react';
import { MeditationSession } from '@/types/meditation';

interface RecentPlayedListProps {
  recentSessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  onToggleFavorite: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
}

const RecentPlayedList: React.FC<RecentPlayedListProps> = ({ 
  recentSessions, 
  onSelectSession, 
  onToggleFavorite, 
  isFavorite 
}) => {
  if (recentSessions.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Recently Played</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentSessions.map(session => (
          <div 
            key={session.id}
            className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectSession(session)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{session.title}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(session);
                }}
                className="text-muted-foreground hover:text-primary"
              >
                {isFavorite(session.id) ? '★' : '☆'}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{session.duration} min • {session.instructor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPlayedList;
