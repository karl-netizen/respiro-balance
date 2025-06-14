
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Heart, Zap, Cloud } from 'lucide-react';
import { TimeAwarenessService } from '@/services/TimeAwarenessService';

export interface MoodTrackerProps {
  onMoodSelect?: (mood: string) => void;
  currentMood?: string | null;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ 
  onMoodSelect = () => {}, 
  currentMood = null 
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(currentMood);

  const moods = [
    { id: 'happy', label: 'Happy', icon: <Smile className="h-5 w-5" />, color: 'bg-green-100 text-green-800' },
    { id: 'calm', label: 'Calm', icon: <Heart className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'energetic', label: 'Energetic', icon: <Zap className="h-5 w-5" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'neutral', label: 'Neutral', icon: <Meh className="h-5 w-5" />, color: 'bg-gray-100 text-gray-800' },
    { id: 'tired', label: 'Tired', icon: <Cloud className="h-5 w-5" />, color: 'bg-purple-100 text-purple-800' },
    { id: 'stressed', label: 'Stressed', icon: <Frown className="h-5 w-5" />, color: 'bg-red-100 text-red-800' }
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    TimeAwarenessService.recordMood(moodId);
    onMoodSelect(moodId);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {moods.map((mood) => (
          <Button
            key={mood.id}
            variant={selectedMood === mood.id ? "default" : "outline"}
            size="sm"
            className="h-auto p-2 flex flex-col items-center gap-1"
            onClick={() => handleMoodSelect(mood.id)}
          >
            {mood.icon}
            <span className="text-xs">{mood.label}</span>
          </Button>
        ))}
      </div>
      
      {selectedMood && (
        <div className="text-center">
          <Badge variant="outline" className={moods.find(m => m.id === selectedMood)?.color}>
            Current mood: {moods.find(m => m.id === selectedMood)?.label}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
