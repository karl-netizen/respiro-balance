
import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Heart, Zap, Cloud } from 'lucide-react';
import { TimeAwarenessService } from '@/services/TimeAwarenessService';

export interface MoodTrackerProps {
  onMoodSelect?: (mood: string) => void;
  currentMood?: string | null;
  compact?: boolean;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ 
  onMoodSelect = () => {}, 
  currentMood = null,
  compact = false
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(currentMood);

  // Memoize moods array to prevent recreation
  const moods = useMemo(() => [
    { 
      id: 'happy', 
      label: 'Happy', 
      icon: <Smile className={compact ? "h-4 w-4" : "h-6 w-6"} />, 
      color: 'bg-green-100 text-green-800 hover:bg-green-200',
      description: 'Feeling positive and upbeat'
    },
    { 
      id: 'calm', 
      label: 'Calm', 
      icon: <Heart className={compact ? "h-4 w-4" : "h-6 w-6"} />, 
      color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      description: 'Peaceful and relaxed'
    },
    { 
      id: 'energetic', 
      label: 'Energetic', 
      icon: <Zap className={compact ? "h-4 w-4" : "h-6 w-6"} />, 
      color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      description: 'Full of energy and motivation'
    },
    { 
      id: 'neutral', 
      label: 'Neutral', 
      icon: <Meh className={compact ? "h-4 w-4" : "h-6 w-6"} />, 
      color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      description: 'Neither good nor bad'
    },
    { 
      id: 'tired', 
      label: 'Tired', 
      icon: <Cloud className={compact ? "h-4 w-4" : "h-6 w-6"} />, 
      color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      description: 'Feeling low energy'
    },
    { 
      id: 'stressed', 
      label: 'Stressed', 
      icon: <Frown className={compact ? "h-4 w-4" : "h-6 w-6"} />, 
      color: 'bg-red-100 text-red-800 hover:bg-red-200',
      description: 'Feeling overwhelmed or anxious'
    }
  ], [compact]);

  // Use useCallback to memoize mood selection handler
  const handleMoodSelect = useCallback((moodId: string) => {
    setSelectedMood(moodId);
    TimeAwarenessService.recordMood(moodId);
    onMoodSelect(moodId);
  }, [onMoodSelect]);

  // Memoize the selected mood data
  const selectedMoodData = useMemo(() => 
    moods.find(m => m.id === selectedMood),
    [moods, selectedMood]
  );

  return (
    <div className="space-y-4">
      <div className={`grid gap-3 ${compact ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-3'}`}>
        {moods.map((mood) => (
          <Button
            key={mood.id}
            variant={selectedMood === mood.id ? "default" : "outline"}
            size={compact ? "sm" : "default"}
            className={`${compact ? 'h-auto p-2' : 'h-auto p-4'} flex flex-col items-center gap-2 transition-all duration-200 ${
              selectedMood === mood.id 
                ? 'ring-2 ring-primary ring-offset-2' 
                : 'hover:shadow-md ' + mood.color
            }`}
            onClick={() => handleMoodSelect(mood.id)}
          >
            {mood.icon}
            <span className={compact ? "text-xs" : "text-sm"}>{mood.label}</span>
            {!compact && selectedMood === mood.id && (
              <span className="text-xs text-muted-foreground text-center">
                {mood.description}
              </span>
            )}
          </Button>
        ))}
      </div>
      
      {selectedMoodData && (
        <div className="text-center">
          <Badge variant="outline" className={selectedMoodData.color.replace('hover:bg-', 'bg-')}>
            Current mood: {selectedMoodData.label}
          </Badge>
          {!compact && (
            <p className="text-sm text-muted-foreground mt-2">
              Perfect! We'll customize your experience based on how you're feeling.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(MoodTracker);
