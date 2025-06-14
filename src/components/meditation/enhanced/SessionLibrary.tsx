
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SessionCard from './SessionCard';

interface SessionLibraryProps {
  filteredSessions: MeditationSession[];
  favorites: string[];
  canResume: (sessionId: string) => boolean;
  getProgressPercentage: (sessionId: string) => number;
  toggleFavorite: (session: MeditationSession) => void;
  onSelectSession: (session: MeditationSession) => void;
  formatDuration: (minutes: number) => string;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const SessionLibrary: React.FC<SessionLibraryProps> = ({
  filteredSessions,
  favorites,
  canResume,
  getProgressPercentage,
  toggleFavorite,
  onSelectSession,
  formatDuration,
  onClearFilters,
  hasActiveFilters
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Session Library</h2>
          <p className="text-sm text-muted-foreground">
            {filteredSessions.length} sessions available
          </p>
        </div>
        
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear All Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSessions.map(session => (
          <SessionCard
            key={session.id}
            session={session}
            isFavorite={favorites.includes(session.id)}
            canResume={canResume(session.id)}
            progressPercentage={getProgressPercentage(session.id)}
            onToggleFavorite={toggleFavorite}
            onSelectSession={onSelectSession}
            formatDuration={formatDuration}
          />
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No sessions match your current filters. Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionLibrary;
