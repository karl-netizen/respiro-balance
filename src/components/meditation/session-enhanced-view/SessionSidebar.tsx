
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MeditationSession } from '@/types/meditation';

interface SessionSidebarProps {
  session: MeditationSession;
}

const SessionSidebar: React.FC<SessionSidebarProps> = ({ session }) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  };

  return (
    <div>
      <Card className="h-full">
        <CardContent className="pt-6">
          {session.image_url ? (
            <img 
              src={session.image_url} 
              alt={session.title} 
              className="w-full h-auto rounded-md mb-4"
            />
          ) : (
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Duration</h3>
              <p>{formatDuration(session.duration)}</p>
            </div>
            
            <div>
              <h3 className="font-medium">Instructor</h3>
              <p>{session.instructor}</p>
            </div>
            
            <div>
              <h3 className="font-medium">Category</h3>
              <p>{session.category}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionSidebar;
