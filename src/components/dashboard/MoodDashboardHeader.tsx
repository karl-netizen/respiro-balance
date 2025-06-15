
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Heart, Zap, Cloud, RotateCcw } from 'lucide-react';

interface MoodDashboardHeaderProps {
  currentMood: string | null;
  onMoodChange: () => void;
}

const MoodDashboardHeader: React.FC<MoodDashboardHeaderProps> = ({ 
  currentMood, 
  onMoodChange 
}) => {
  const moods = [
    { id: 'happy', label: 'Happy', icon: <Smile className="h-5 w-5" />, color: 'bg-green-100 text-green-800 border-green-300' },
    { id: 'calm', label: 'Calm', icon: <Heart className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { id: 'energetic', label: 'Energetic', icon: <Zap className="h-5 w-5" />, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { id: 'neutral', label: 'Neutral', icon: <Meh className="h-5 w-5" />, color: 'bg-gray-100 text-gray-800 border-gray-300' },
    { id: 'tired', label: 'Tired', icon: <Cloud className="h-5 w-5" />, color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { id: 'stressed', label: 'Stressed', icon: <Frown className="h-5 w-5" />, color: 'bg-red-100 text-red-800 border-red-300' }
  ];

  const selectedMood = moods.find(m => m.id === currentMood);

  const getMoodGradient = (mood: string | null) => {
    switch (mood) {
      case 'happy': return 'bg-gradient-to-r from-green-50 to-green-100';
      case 'calm': return 'bg-gradient-to-r from-blue-50 to-blue-100';
      case 'energetic': return 'bg-gradient-to-r from-yellow-50 to-yellow-100';
      case 'stressed': return 'bg-gradient-to-r from-red-50 to-red-100';
      case 'tired': return 'bg-gradient-to-r from-purple-50 to-purple-100';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100';
    }
  };

  if (!currentMood) {
    return (
      <Card className="border-2 border-dashed border-primary/20">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">How are you feeling today?</p>
          <Button onClick={onMoodChange} variant="outline">
            Select Your Mood
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-0 ${getMoodGradient(currentMood)}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${selectedMood?.color.replace('text-', 'bg-').replace('border-', 'bg-').replace('100', '200')}`}>
                {selectedMood?.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  You're feeling {selectedMood?.label.toLowerCase()}
                </h3>
                <p className="text-sm text-gray-600">
                  We've tailored your recommendations based on your mood
                </p>
              </div>
            </div>
            <Badge variant="outline" className={selectedMood?.color}>
              Current mood: {selectedMood?.label}
            </Badge>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMoodChange}
            className="hover:bg-white/50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Change
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodDashboardHeader;
