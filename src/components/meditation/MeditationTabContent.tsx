
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import MeditationSessionCard, { MeditationSession } from "./MeditationSessionCard";

interface MeditationTabContentProps {
  value: string;
  sessions: MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
  onToggleFavorite: (session: MeditationSession) => void;
}

const MeditationTabContent: React.FC<MeditationTabContentProps> = ({
  value,
  sessions,
  onSelectSession,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <TabsContent value={value} className="mt-0">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <MeditationSessionCard 
            key={session.id}
            session={session}
            onSelect={onSelectSession}
            isFavorite={isFavorite(session.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </TabsContent>
  );
};

export default MeditationTabContent;
