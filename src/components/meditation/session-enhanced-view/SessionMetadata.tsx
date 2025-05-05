
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Tag, Award } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';

interface SessionMetadataProps {
  session: MeditationSession & { isFeatured?: boolean };
}

const SessionMetadata: React.FC<SessionMetadataProps> = ({ session }) => {
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
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="flex items-center">
        <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {formatDuration(session.duration)}
        </span>
      </div>
      
      <div className="flex items-center">
        <User className="mr-1 h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {session.instructor}
        </span>
      </div>
      
      {session.category && (
        <Badge variant="outline" className="font-normal">
          {session.category}
        </Badge>
      )}
      
      {session.isFeatured && (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
          <Award className="mr-1 h-3 w-3" />
          Featured
        </Badge>
      )}
    </div>
  );
};

export default SessionMetadata;
