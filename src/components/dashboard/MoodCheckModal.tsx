
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smile, Frown, Meh, Heart, Zap, Cloud } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MoodCheckModalProps {
  open: boolean;
  onMoodSelect: (mood: string) => void;
}

const MoodCheckModal: React.FC<MoodCheckModalProps> = ({ open, onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { 
      id: 'happy', 
      label: 'Happy', 
      icon: <Smile className="h-8 w-8" />, 
      color: 'bg-green-100 hover:bg-green-200 border-green-300',
      textColor: 'text-green-800',
      description: 'Feeling positive and upbeat'
    },
    { 
      id: 'calm', 
      label: 'Calm', 
      icon: <Heart className="h-8 w-8" />, 
      color: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
      textColor: 'text-blue-800',
      description: 'Peaceful and relaxed'
    },
    { 
      id: 'energetic', 
      label: 'Energetic', 
      icon: <Zap className="h-8 w-8" />, 
      color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
      textColor: 'text-yellow-800',
      description: 'Full of energy and motivation'
    },
    { 
      id: 'neutral', 
      label: 'Neutral', 
      icon: <Meh className="h-8 w-8" />, 
      color: 'bg-gray-100 hover:bg-gray-200 border-gray-300',
      textColor: 'text-gray-800',
      description: 'Neither good nor bad'
    },
    { 
      id: 'tired', 
      label: 'Tired', 
      icon: <Cloud className="h-8 w-8" />, 
      color: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
      textColor: 'text-purple-800',
      description: 'Feeling low energy'
    },
    { 
      id: 'stressed', 
      label: 'Stressed', 
      icon: <Frown className="h-8 w-8" />, 
      color: 'bg-red-100 hover:bg-red-200 border-red-300',
      textColor: 'text-red-800',
      description: 'Feeling overwhelmed or anxious'
    }
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleContinue = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood);
    }
  };

  const selectedMoodData = moods.find(m => m.id === selectedMood);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl" closeDisabled>
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-3xl font-bold text-primary">
            How are you feeling today?
          </DialogTitle>
          <p className="text-lg text-muted-foreground">
            Your mood helps us recommend the perfect activities for you
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {moods.map((mood) => (
              <Card
                key={mood.id}
                className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                  selectedMood === mood.id 
                    ? mood.color + ' ring-2 ring-primary ring-offset-2' 
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => handleMoodSelect(mood.id)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={selectedMood === mood.id ? mood.textColor : 'text-gray-600'}>
                    {mood.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${selectedMood === mood.id ? mood.textColor : 'text-gray-800'}`}>
                      {mood.label}
                    </h3>
                    <p className={`text-sm ${selectedMood === mood.id ? mood.textColor : 'text-gray-600'}`}>
                      {mood.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedMood && selectedMoodData && (
            <div className="text-center p-4 bg-primary/5 rounded-lg border">
              <p className="text-primary font-medium">
                Perfect! Based on feeling {selectedMoodData.label.toLowerCase()}, we'll recommend activities to help you make the most of your day.
              </p>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleContinue}
              disabled={!selectedMood}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodCheckModal;
