
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MoodOption {
  value: string;
  emoji: string;
  label: string;
  color: string;
}

interface MoodTrackerProps {
  onMoodSelect: (mood: string) => void;
  currentMood: string | null;
}

const moods: MoodOption[] = [
  { value: 'amazing', emoji: '😄', label: 'Amazing', color: 'bg-green-100 hover:bg-green-200 text-green-800' },
  { value: 'good', emoji: '🙂', label: 'Good', color: 'bg-lime-100 hover:bg-lime-200 text-lime-800' },
  { value: 'okay', emoji: '😐', label: 'Okay', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
  { value: 'meh', emoji: '😕', label: 'Meh', color: 'bg-amber-100 hover:bg-amber-200 text-amber-800' },
  { value: 'stressed', emoji: '😓', label: 'Stressed', color: 'bg-orange-100 hover:bg-orange-200 text-orange-800' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-red-100 hover:bg-red-200 text-red-800' }
];

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodSelect, currentMood }) => {
  const handleSelect = (mood: string) => {
    onMoodSelect(mood);
    toast.success('Mood updated', {
      description: 'Your mood has been recorded'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
        <CardDescription>
          Tracking your mood helps us personalize your meditation recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant="ghost"
              className={`flex flex-col items-center p-3 h-auto ${mood.color} ${
                currentMood === mood.value ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelect(mood.value)}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
