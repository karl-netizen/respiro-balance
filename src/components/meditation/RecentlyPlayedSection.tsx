
import React from 'react';
import { History } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { MeditationSession } from './MeditationSessionCard';

interface RecentlyPlayedProps {
  recentSessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
}

const RecentlyPlayedSection: React.FC<RecentlyPlayedProps> = ({
  recentSessions,
  onSelectSession
}) => {
  if (recentSessions.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <History size={20} className="text-primary" />
        Recently Played
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {recentSessions.map((session) => (
          <Card 
            key={session.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectSession(session)}
          >
            <CardContent className="p-3 md:p-4 flex gap-2 md:gap-3 items-center">
              <div className="shrink-0">
                {/* Use a fallback if icon is not available */}
                {session.icon || '🧘'}
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-xs md:text-sm truncate">{session.title}</h3>
                <p className="text-xs text-muted-foreground">{session.duration} min</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayedSection;
