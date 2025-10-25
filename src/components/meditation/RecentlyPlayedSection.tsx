
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';

export interface RecentlyPlayedProps {
  recentlyPlayed: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const RecentlyPlayedSection: React.FC<RecentlyPlayedProps> = ({
  recentlyPlayed,
  onSelectSession
}) => {
  if (recentlyPlayed.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recently Played
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="grid gap-2">
            {recentlyPlayed.map((session) => (
              <div 
                key={session.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => onSelectSession(session)}
              >
                <div className="bg-primary/10 rounded-md p-2">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{session.title}</h4>
                  <p className="text-xs text-muted-foreground">{session.duration} min</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentlyPlayedSection;
