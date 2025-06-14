
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Heart } from 'lucide-react';

interface SessionCardProps {
  session: MeditationSession;
  isFavorite: boolean;
  canResume: boolean;
  progressPercentage: number;
  onToggleFavorite: (session: MeditationSession) => void;
  onSelectSession: (session: MeditationSession) => void;
  formatDuration: (minutes: number) => string;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  isFavorite,
  canResume,
  progressPercentage,
  onToggleFavorite,
  onSelectSession,
  formatDuration
}) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{session.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(session);
            }}
            className={`${isFavorite ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{session.instructor}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {session.description}
        </p>

        <div className="flex items-center space-x-2">
          <Badge variant="outline">{session.category}</Badge>
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(session.duration)}
          </Badge>
          {session.level && (
            <Badge variant="secondary">{session.level}</Badge>
          )}
        </div>

        {canResume && (
          <div className="bg-primary/10 p-2 rounded">
            <p className="text-xs text-primary font-medium">
              Resume from {progressPercentage}%
            </p>
          </div>
        )}

        <Button 
          className="w-full" 
          onClick={() => onSelectSession(session)}
        >
          <Play className="h-4 w-4 mr-2" />
          {canResume ? 'Resume' : 'Start'} Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
