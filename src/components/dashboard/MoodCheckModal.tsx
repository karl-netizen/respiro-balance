
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smile, Frown, Meh, Heart, Zap, Cloud } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getMoodCheckForToday } from '@/utils/moodCheckUtils';

interface MoodCheckModalProps {
  open: boolean;
  onMoodSelect: (mood: string) => void;
}

const MoodCheckModal: React.FC<MoodCheckModalProps> = ({ open, onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Check for existing mood when modal opens
  useEffect(() => {
    if (open) {
      const existingMood = getMoodCheckForToday();
      if (existingMood) {
        setSelectedMood(existingMood);
      } else {
        setSelectedMood(null);
      }
    }
  }, [open]);

  const moods = [
    { 
      id: 'happy', 
      label: 'Happy', 
      icon: <Smile className="h-8 w-8" />, 
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      selectedColor: 'bg-green-100 border-green-400',
      textColor: 'text-green-800',
      description: 'Feeling positive and upbeat'
    },
    { 
      id: 'calm', 
      label: 'Calm', 
      icon: <Heart className="h-8 w-8" />, 
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      selectedColor: 'bg-blue-100 border-blue-400',
      textColor: 'text-blue-800',
      description: 'Peaceful and relaxed'
    },
    { 
      id: 'energetic', 
      label: 'Energetic', 
      icon: <Zap className="h-8 w-8" />, 
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
      selectedColor: 'bg-yellow-100 border-yellow-400',
      textColor: 'text-yellow-800',
      description: 'Full of energy and motivation'
    },
    { 
      id: 'neutral', 
      label: 'Neutral', 
      icon: <Meh className="h-8 w-8" />, 
      color: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
      selectedColor: 'bg-gray-100 border-gray-400',
      textColor: 'text-gray-800',
      description: 'Neither good nor bad'
    },
    { 
      id: 'tired', 
      label: 'Tired', 
      icon: <Cloud className="h-8 w-8" />, 
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      selectedColor: 'bg-purple-100 border-purple-400',
      textColor: 'text-purple-800',
      description: 'Feeling low energy'
    },
    { 
      id: 'stressed', 
      label: 'Stressed', 
      icon: <Frown className="h-8 w-8" />, 
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      selectedColor: 'bg-red-100 border-red-400',
      textColor: 'text-red-800',
      description: 'Feeling overwhelmed or anxious'
    }
  ];

  const handleMoodSelect = (moodId: string) => {
    console.log('Mood selected in modal:', moodId);
    setSelectedMood(moodId);
  };

  const handleContinue = () => {
    if (selectedMood) {
      console.log('Continue clicked with mood:', selectedMood);
      onMoodSelect(selectedMood);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      console.log('Modal close clicked');
      onMoodSelect('neutral');
    }
  };

  const selectedMoodData = moods.find(m => m.id === selectedMood);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl max-h-[95vh] bg-white border-2 border-gray-200 shadow-2xl p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            How are you feeling today?
          </DialogTitle>
          <p className="text-base text-gray-700 mt-2 text-center">
            Your mood helps us recommend the perfect activities for you
          </p>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {moods.map((mood) => (
              <Card
                key={mood.id}
                className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                  selectedMood === mood.id 
                    ? `${mood.selectedColor} ring-2 ring-primary ring-offset-2 shadow-lg` 
                    : `${mood.color} hover:shadow-md`
                }`}
                onClick={() => handleMoodSelect(mood.id)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={selectedMood === mood.id ? mood.textColor : 'text-gray-600'}>
                    {mood.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-base ${selectedMood === mood.id ? mood.textColor : 'text-gray-800'}`}>
                      {mood.label}
                    </h3>
                    <p className={`text-xs ${selectedMood === mood.id ? mood.textColor : 'text-gray-600'}`}>
                      {mood.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedMood && selectedMoodData && (
            <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20 mt-4">
              <p className="text-primary font-medium text-sm">
                Perfect! Based on feeling {selectedMoodData.label.toLowerCase()}, we'll recommend activities to help you make the most of your day.
              </p>
            </div>
          )}
        </div>

        {/* Fixed bottom section with button */}
        <div className="border-t border-gray-100 p-4 bg-white flex-shrink-0">
          <div className="flex justify-center">
            <Button 
              onClick={handleContinue}
              disabled={!selectedMood}
              size="lg"
              className="w-full max-w-sm py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 shadow-lg transition-colors"
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
