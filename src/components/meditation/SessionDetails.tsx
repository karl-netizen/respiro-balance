
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';
import { MeditationAudioPlayer } from './audio-player';

interface SessionDetailsProps {
  session: MeditationSession;
  handleSessionComplete: () => void;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ session, handleSessionComplete }) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <p className="mb-4">{session.description}</p>
          
          {session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {session.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {session.audio_url ? (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Meditation Audio</h3>
            <MeditationAudioPlayer 
              audioUrl={session.audio_url} 
              onComplete={handleSessionComplete}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-8">
            <p className="text-muted-foreground">
              This meditation session doesn't have audio yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionDetails;
