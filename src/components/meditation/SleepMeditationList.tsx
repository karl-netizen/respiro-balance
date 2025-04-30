
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Moon } from 'lucide-react';

export interface SleepMeditationListProps {
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const SleepMeditationList: React.FC<SleepMeditationListProps> = ({
  sessions,
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  // Filter sessions for sleep meditations
  const sleepMeditations = sessions.filter(
    (session) => session.category === 'sleep'
  );

  if (sleepMeditations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="h-5 w-5" />
          Sleep Meditations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px] pr-4">
          <div className="grid gap-2">
            {sleepMeditations.map((session) => (
              <div 
                key={session.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                onClick={() => onSelectSession(session)}
              >
                <div className="bg-primary/10 rounded-md p-2">
                  <Moon className="h-4 w-4 text-primary" />
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

export default SleepMeditationList;
