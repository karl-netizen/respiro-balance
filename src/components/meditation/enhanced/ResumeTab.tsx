
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Award } from 'lucide-react';

interface ResumeTabProps {
  incompleteSessions: MeditationSession[];
  getProgressPercentage: (sessionId: string) => number;
  getResumeTime: (sessionId: string) => number;
  onSelectSession: (session: MeditationSession) => void;
}

const ResumeTab: React.FC<ResumeTabProps> = ({
  incompleteSessions,
  getProgressPercentage,
  getResumeTime,
  onSelectSession
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Continue Your Practice</h2>
        <p className="text-sm text-muted-foreground">
          Pick up where you left off with these incomplete sessions.
        </p>
      </div>

      {incompleteSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incompleteSessions.map(session => (
            <Card key={session.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">{session.instructor}</p>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${getProgressPercentage(session.id)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {getProgressPercentage(session.id)}% complete
                    </span>
                    <Badge variant="outline">
                      {Math.round(getResumeTime(session.id) / 60)}m remaining
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => onSelectSession(session)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continue Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">All caught up!</h3>
            <p className="text-muted-foreground">
              You don't have any incomplete sessions. Start a new meditation to begin your practice.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeTab;
