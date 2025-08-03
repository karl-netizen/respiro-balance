
import { useState } from 'react';
import { MeditationFilters } from '@/components/meditation';
import { MeditationSession } from '@/types/meditation';
import { meditationSessions } from '@/data/meditationSessions';
import { MeditationSessionCard } from '@/components/meditation';

const MeditationFilterExample = () => {
  const [sessions] = useState<MeditationSession[]>(meditationSessions);
  const [filteredSessions, setFilteredSessions] = useState<MeditationSession[]>(sessions);
  
  const handlePlay = (session: MeditationSession) => {
    console.log('Playing session:', session.title);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Meditation Library</h1>
      
      <MeditationFilters 
        sessions={sessions}
        onFilteredSessionsChange={setFilteredSessions}
      />
      
      {/* Display filtered sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredSessions.map(session => (
          <MeditationSessionCard 
            key={session.id} 
            session={session}
            onSelectSession={handlePlay}
            onToggleFavorite={() => {}} // Add empty handler or implement favorites
            isFavorite={false} // Add proper favorite state
          />
        ))}
      </div>
      
      {filteredSessions.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          No sessions match your current filters.
        </div>
      )}
    </div>
  );
};

export default MeditationFilterExample;
