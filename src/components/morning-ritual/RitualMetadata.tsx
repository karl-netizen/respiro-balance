
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Repeat } from 'lucide-react';
import { MorningRitual } from '@/context/types';

interface RitualMetadataProps {
  ritual: MorningRitual;
  isToday: boolean;
  isCompletedToday: boolean;
}

const RitualMetadata: React.FC<RitualMetadataProps> = ({ ritual, isToday, isCompletedToday }) => {
  return (
    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
      <div className="flex items-center space-x-1">
        <Clock className="h-4 w-4" />
        <span>{ritual.duration} min</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <Repeat className="h-4 w-4" />
        <span className="capitalize">{ritual.recurrence}</span>
      </div>
      
      {ritual.priority !== 'medium' && (
        <Badge variant={ritual.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
          {ritual.priority} priority
        </Badge>
      )}
    </div>
  );
};

export default RitualMetadata;
