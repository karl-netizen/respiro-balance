
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Sparkles, Clock, Target } from 'lucide-react';
import { MorningRitual } from '@/context/types';
import { toast } from 'sonner';

interface RitualSuggestion {
  id: string;
  title: string;
  description: string;
  duration: number;
  timeOfDay: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  category: string;
}

interface RitualCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ritual: MorningRitual) => void;
}

const RITUAL_SUGGESTIONS: RitualSuggestion[] = [
  {
    id: 'meditation',
    title: 'Morning Meditation',
    description: 'Start your day with mindfulness and clarity',
    duration: 10,
    timeOfDay: '07:00',
    priority: 'high',
    tags: ['mindfulness', 'meditation'],
    category: 'Mental Wellness'
  },
  {
    id: 'exercise',
    title: 'Morning Exercise',
    description: 'Energize your body with light movement',
    duration: 20,
    timeOfDay: '06:30',
    priority: 'medium',
    tags: ['exercise', 'energy'],
    category: 'Physical Health'
  },
  {
    id: 'journaling',
    title: 'Gratitude Journaling',
    description: 'Reflect on what you\'re grateful for',
    duration: 5,
    timeOfDay: '07:30',
    priority: 'medium',
    tags: ['gratitude', 'journaling'],
    category: 'Mental Wellness'
  }
];

const RitualCreationWizard: React.FC<RitualCreationWizardProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  const toggleSuggestion = (id: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleCreateRituals = () => {
    if (selectedSuggestions.size === 0) {
      toast.error('Please select at least one ritual to create');
      return;
    }

    selectedSuggestions.forEach(suggestionId => {
      const suggestion = RITUAL_SUGGESTIONS.find(s => s.id === suggestionId);
      if (suggestion) {
        const newRitual: MorningRitual = {
          id: `ritual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: suggestion.title,
          description: suggestion.description,
          timeOfDay: suggestion.timeOfDay,
          startTime: suggestion.timeOfDay,
          duration: suggestion.duration,
          priority: suggestion.priority,
          recurrence: 'daily',
          daysOfWeek: [],
          reminderEnabled: true,
          reminderTime: 10,
          reminders: [],
          tags: suggestion.tags,
          status: 'planned',
          complete: false,
          streak: 0,
          createdAt: new Date()
        };

        onSave(newRitual);
      }
    });

    toast.success(`Created ${selectedSuggestions.size} ritual${selectedSuggestions.size > 1 ? 's' : ''} successfully!`);
    setSelectedSuggestions(new Set());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-2xl">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            <span>Create Your Morning Rituals</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-600">
              Choose from these scientifically-backed morning rituals to transform your day
            </p>
            <Badge className="bg-blue-100 text-blue-800">
              Select one or more rituals to get started
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {RITUAL_SUGGESTIONS.map((suggestion) => {
              const isSelected = selectedSuggestions.has(suggestion.id);
              
              return (
                <Card 
                  key={suggestion.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => toggleSuggestion(suggestion.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{suggestion.title}</span>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {suggestion.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-4">
                      {suggestion.description}
                    </CardDescription>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{suggestion.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{suggestion.priority} priority</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {suggestion.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-gray-600">
              {selectedSuggestions.size > 0 ? (
                <span className="font-medium text-blue-600">
                  {selectedSuggestions.size} ritual{selectedSuggestions.size > 1 ? 's' : ''} selected
                </span>
              ) : (
                <span>Select rituals to continue</span>
              )}
            </div>
            
            <div className="space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRituals}
                disabled={selectedSuggestions.size === 0}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Create Rituals
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RitualCreationWizard;
