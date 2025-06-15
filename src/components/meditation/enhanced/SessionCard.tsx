import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart, Brain, Zap, Target, Moon } from 'lucide-react';

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
  const getCategoryIcon = (category: string) => {
    const baseIconProps = { className: "h-6 w-6 mb-2" };
    switch (category.toLowerCase()) {
      case 'guided': return <Brain {...baseIconProps} className="h-6 w-6 mb-2 text-blue-500" />;
      case 'quick': return <Zap {...baseIconProps} className="h-6 w-6 mb-2 text-green-500" />;
      case 'deep': return <Target {...baseIconProps} className="h-6 w-6 mb-2 text-purple-500" />;
      case 'sleep': return <Moon {...baseIconProps} className="h-6 w-6 mb-2 text-indigo-500" />;
      default: return <Brain {...baseIconProps} className="h-6 w-6 mb-2 text-blue-500" />;
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 group">
      <CardHeader className="pb-2">
        <div className="flex flex-col items-center text-center">
          {getCategoryIcon(session.category)}
          <div className="flex items-start justify-between w-full">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-respiro-dark transition-colors duration-300">{session.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(session);
              }}
              className={`${isFavorite ? 'text-red-500' : 'text-respiro-dark'} hover:text-red-500 hover:scale-110 transition-all duration-200`}
            >
              <Heart className={`h-4 w-4 text-red-500 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">{session.instructor}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2 text-center">
          {session.description}
        </p>

        <div className="flex items-center justify-center space-x-2">
          <Badge variant="outline" className="group-hover:border-respiro-dark transition-colors duration-300">{session.category}</Badge>
          <Badge variant="outline" className="flex items-center group-hover:border-respiro-dark transition-colors duration-300">
            <Clock className="h-3 w-3 mr-1 text-respiro-dark" />
            {formatDuration(session.duration)}
          </Badge>
          {session.level && (
            <Badge variant="secondary" className="group-hover:bg-respiro-light transition-colors duration-300">{session.level}</Badge>
          )}
        </div>

        {canResume && (
          <div className="bg-respiro-light p-2 rounded">
            <p className="text-xs text-respiro-dark font-medium">
              Resume from {progressPercentage}%
            </p>
          </div>
        )}

        <Button 
          className="w-full bg-respiro-dark hover:bg-respiro-darker text-white transition-colors duration-300" 
          onClick={() => onSelectSession(session)}
        >
          <span className="mr-2">▶</span>
          {canResume ? 'Resume' : 'Start'} Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
