import React, { memo } from 'react';
import { MeditationSession } from '@/hooks/useEnhancedMeditationPage';
import SimpleSessionCard from './SimpleSessionCard';

interface SessionGridProps {
  sessions: MeditationSession[];
  viewMode: 'grid' | 'list';
  onSessionSelect: (session: MeditationSession) => void;
  onToggleFavorite: (session: MeditationSession) => void;
  favorites: string[];
  formatTime: (seconds: number) => string;
  getDifficultyColor: (difficulty: string) => string;
  getCategoryIcon: (category: string) => React.ReactNode;
}

const SessionGrid = memo<SessionGridProps>(({
  sessions,
  viewMode,
  onSessionSelect,
  onToggleFavorite,
  favorites,
  formatTime,
  getDifficultyColor,
  getCategoryIcon
}) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No sessions found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
      {sessions.map(session => (
        <SimpleSessionCard 
          key={session.id}
          session={session}
          onSelect={onSessionSelect}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(session.id)}
          formatTime={formatTime}
          getDifficultyColor={getDifficultyColor}
          getCategoryIcon={getCategoryIcon}
        />
      ))}
    </div>
  );
});

SessionGrid.displayName = 'SessionGrid';

export default SessionGrid;