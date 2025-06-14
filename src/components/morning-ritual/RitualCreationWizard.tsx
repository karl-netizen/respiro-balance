
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MorningRitual, RitualPriority, RitualRecurrence } from '@/context/types';
import { useUserPreferences } from '@/context';
import { Clock, Calendar, Zap, AlertTriangle, CheckCircle2, Wand2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface RitualCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ritual: MorningRitual) => void;
}

interface ConflictAlert {
  type: 'overlap' | 'tight' | 'unrealistic';
  message: string;
  suggestion: string;
}

const RitualCreationWizard: React.FC<RitualCreationWizardProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { preferences } = useUserPreferences();
  const existingRituals = preferences.morningRituals || [];
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeOfDay: '07:00',
    duration: 15,
    priority: 'medium' as RitualPriority,
    recurrence: 'daily' as RitualRecurrence,
    tags: [] as string[],
    reminderEnabled: true,
    reminderTime: 10
  });

  const [conflicts, setConflicts] = useState<ConflictAlert[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const analyzeConflicts = () => {
    const newConflicts: ConflictAlert[] = [];
    const newSuggestions: string[] = [];

    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startTime = timeToMinutes(formData.timeOfDay);
    const endTime = startTime + formData.duration;

    // Check for conflicts with existing rituals
    existingRituals.forEach(ritual => {
      const existingStart = timeToMinutes(ritual.timeOfDay);
      const existingEnd = existingStart + ritual.duration;

      // Check for overlaps
      if (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd)
      ) {
        newConflicts.push({
          type: 'overlap',
          message: `Overlaps with "${ritual.title}" (${ritual.timeOfDay})`,
          suggestion: 'Adjust timing to avoid conflict'
        });
      }
      // Check for tight scheduling
      else if (Math.abs(endTime - existingStart) < 5 || Math.abs(existingEnd - startTime) < 5) {
        newConflicts.push({
          type: 'tight',
          message: `Very close to "${ritual.title}" (${ritual.timeOfDay})`,
          suggestion: 'Add 5+ minute buffer between rituals'
        });
      }
    });

    // Check for unrealistic durations
    if (formData.duration > 45) {
      newConflicts.push({
        type: 'unrealistic',
        message: 'Duration exceeds 45 minutes',
        suggestion: 'Consider breaking into smaller segments'
      });
    }

    // Generate smart suggestions
    if (newConflicts.length === 0) {
      newSuggestions.push('Perfect timing! No conflicts detected.');
    }

    if (formData.duration < 5) {
      newSuggestions.push('Consider extending duration for better results');
    }

    if (startTime < 5 * 60) { // Before 5 AM
      newSuggestions.push('Very early start - ensure you can maintain this consistently');
    }

    if (formData.priority === 'high' && existingRituals.filter(r => r.priority === 'high').length >= 2) {
      newSuggestions.push('Many high-priority rituals can be overwhelming');
    }

    setConflicts(newConflicts);
    setSuggestions(newSuggestions);
  };

  React.useEffect(() => {
    if (formData.title && formData.timeOfDay) {
      analyzeConflicts();
    }
  }, [formData.timeOfDay, formData.duration, existingRituals]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a ritual title');
      return;
    }

    const hasOverlapConflicts = conflicts.some(c => c.type === 'overlap');
    if (hasOverlapConflicts) {
      toast.error('Please resolve time conflicts before saving');
      return;
    }

    const newRitual: MorningRitual = {
      id: `ritual_${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      timeOfDay: formData.timeOfDay,
      duration: formData.duration,
      recurrence: formData.recurrence,
      priority: formData.priority,
      reminderEnabled: formData.reminderEnabled,
      reminderTime: formData.reminderTime,
      tags: formData.tags,
      status: 'planned',
      streak: 0,
      createdAt: new Date(),
      completionHistory: []
    };

    onSave(newRitual);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      timeOfDay: '07:00',
      duration: 15,
      priority: 'medium',
      recurrence: 'daily',
      tags: [],
      reminderEnabled: true,
      reminderTime: 10
    });
    
    onClose();
    
    toast.success('Ritual created successfully!', {
      description: 'Your new morning ritual has been added to your timeline.'
    });
  };

  const suggestOptimalTime = () => {
    const occupiedTimes = existingRituals.map(r => {
      const start = r.timeOfDay.split(':').map(Number);
      return {
        start: start[0] * 60 + start[1],
        end: start[0] * 60 + start[1] + r.duration
      };
    }).sort((a, b) => a.start - b.start);

    // Find gaps between existing rituals
    let suggestedTime = 6 * 60; // Start at 6 AM

    for (const slot of occupiedTimes) {
      if (suggestedTime + formData.duration <= slot.start) {
        break; // Found a gap
      }
      suggestedTime = slot.end + 5; // Add 5 minute buffer
    }

    const hours = Math.floor(suggestedTime / 60);
    const minutes = suggestedTime % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    setFormData(prev => ({ ...prev, timeOfDay: timeString }));
    
    toast.success('Optimal time suggested!', {
      description: `Set to ${timeString} with no conflicts`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Smart Ritual Creator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ritual Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Morning Meditation"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your ritual..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="flex gap-2">
                      <Input
                        id="time"
                        type="time"
                        value={formData.timeOfDay}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeOfDay: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={suggestOptimalTime}
                        className="whitespace-nowrap"
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select
                      value={formData.duration.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, duration: Number(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: RitualPriority) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recurrence">Frequency</Label>
                    <Select
                      value={formData.recurrence}
                      onValueChange={(value: RitualRecurrence) => setFormData(prev => ({ ...prev, recurrence: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Smart Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Conflicts */}
                {conflicts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Detected Issues</h4>
                    {conflicts.map((conflict, index) => (
                      <Alert key={index} variant={conflict.type === 'overlap' ? 'destructive' : 'default'}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            <p className="font-medium">{conflict.message}</p>
                            <p className="text-xs text-muted-foreground">{conflict.suggestion}</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Smart Suggestions</h4>
                    {suggestions.map((suggestion, index) => (
                      <Alert key={index}>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>{suggestion}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

                {/* Timeline Preview */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Timeline Preview</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {[...existingRituals, {
                      id: 'preview',
                      title: formData.title || 'New Ritual',
                      timeOfDay: formData.timeOfDay,
                      duration: formData.duration,
                      status: 'planned'
                    }]
                    .sort((a, b) => {
                      const timeA = a.timeOfDay.split(':').map(Number);
                      const timeB = b.timeOfDay.split(':').map(Number);
                      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
                    })
                    .map((ritual, index) => (
                      <div
                        key={ritual.id}
                        className={`flex items-center justify-between p-2 rounded-md text-sm ${
                          ritual.id === 'preview' 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <span className={ritual.id === 'preview' ? 'font-medium text-blue-700' : ''}>
                          {ritual.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {ritual.timeOfDay} ({ritual.duration}m)
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.title.trim() || conflicts.some(c => c.type === 'overlap')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Ritual
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RitualCreationWizard;
