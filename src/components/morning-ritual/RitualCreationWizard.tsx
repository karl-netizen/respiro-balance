
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, AlertTriangle, Target, Lightbulb, CheckCircle } from 'lucide-react';
import { MorningRitual } from '@/context/types';
import RitualFormContent from './RitualFormContent';
import { useRitualForm } from './hooks/useRitualForm';

interface RitualCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  existingRituals: MorningRitual[];
}

interface ConflictAnalysis {
  hasConflicts: boolean;
  timeConflicts: string[];
  durationWarnings: string[];
  feasibilityScore: number;
  suggestions: string[];
}

interface SchedulePreview {
  timeline: Array<{
    time: string;
    ritual: string;
    duration: number;
    isNew?: boolean;
  }>;
  totalDuration: number;
  freeTime: number;
}

const RitualCreationWizard: React.FC<RitualCreationWizardProps> = ({
  isOpen,
  onClose,
  existingRituals
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [analysis, setAnalysis] = useState<ConflictAnalysis | null>(null);
  const [schedulePreview, setSchedulePreview] = useState<SchedulePreview | null>(null);
  
  const {
    form,
    selectedTags,
    submitted,
    setSubmitted,
    toggleTag,
    onSubmit: originalOnSubmit
  } = useRitualForm();

  const totalSteps = 4;

  // Analyze potential conflicts and feasibility
  const analyzeRitual = (formData: any) => {
    const newTime = formData.timeOfDay;
    const newDuration = formData.duration;
    
    const conflicts: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Check time conflicts
    existingRituals.forEach(ritual => {
      const existingTime = ritual.timeOfDay;
      const existingDuration = ritual.duration;
      
      const newStartMinutes = timeToMinutes(newTime);
      const newEndMinutes = newStartMinutes + newDuration;
      const existingStartMinutes = timeToMinutes(existingTime);
      const existingEndMinutes = existingStartMinutes + existingDuration;
      
      if (
        (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
        (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
        (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
      ) {
        conflicts.push(`Overlaps with "${ritual.title}" (${ritual.timeOfDay})`);
      }
      
      // Check for tight scheduling
      const timeDiff = Math.abs(newStartMinutes - existingEndMinutes);
      if (timeDiff < 5 && timeDiff > 0) {
        warnings.push(`Very tight schedule with "${ritual.title}" - consider 5+ minute buffer`);
      }
    });
    
    // Feasibility scoring
    let feasibilityScore = 100;
    
    if (conflicts.length > 0) feasibilityScore -= 40;
    if (warnings.length > 0) feasibilityScore -= 20;
    if (newDuration > 30) feasibilityScore -= 15;
    if (timeToMinutes(newTime) < 360) feasibilityScore -= 10; // Before 6 AM
    if (existingRituals.length > 5) feasibilityScore -= 10;
    
    // Generate suggestions
    if (conflicts.length > 0) {
      suggestions.push('Consider adjusting the time to avoid conflicts');
      suggestions.push('Reduce duration to create buffer time');
    }
    
    if (newDuration > 20) {
      suggestions.push('Consider starting with a shorter duration and gradually increasing');
    }
    
    if (existingRituals.length === 0) {
      suggestions.push('Great choice for your first morning ritual!');
    }
    
    setAnalysis({
      hasConflicts: conflicts.length > 0,
      timeConflicts: conflicts,
      durationWarnings: warnings,
      feasibilityScore: Math.max(0, feasibilityScore),
      suggestions
    });
  };

  // Generate schedule preview
  const generateSchedulePreview = (formData: any) => {
    const allRituals = [
      ...existingRituals.map(r => ({
        time: r.timeOfDay,
        ritual: r.title,
        duration: r.duration
      })),
      {
        time: formData.timeOfDay,
        ritual: formData.title || 'New Ritual',
        duration: formData.duration,
        isNew: true
      }
    ].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    
    const totalDuration = allRituals.reduce((sum, r) => sum + r.duration, 0);
    const freeTime = Math.max(0, 180 - totalDuration); // Assuming 3-hour morning window
    
    setSchedulePreview({
      timeline: allRituals,
      totalDuration,
      freeTime
    });
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    const formData = form.getValues();
    
    if (currentStep === 1) {
      analyzeRitual(formData);
      generateSchedulePreview(formData);
    }
    
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinish = () => {
    originalOnSubmit(form.getValues());
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Create Your Morning Ritual</h3>
              <p className="text-muted-foreground">
                Design a meaningful ritual to enhance your mornings
              </p>
            </div>
            
            <RitualFormContent
              form={form}
              onSubmit={() => {}} // Handled by wizard
              availableTags={['mindfulness', 'exercise', 'planning', 'nutrition', 'learning']}
              selectedTags={selectedTags}
              onTagToggle={toggleTag}
              submitted={false}
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Conflict Analysis</h3>
              <p className="text-muted-foreground">
                Let's check how this fits with your existing schedule
              </p>
            </div>
            
            {analysis && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Feasibility Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Success Probability</span>
                        <Badge variant={analysis.feasibilityScore >= 80 ? 'default' : analysis.feasibilityScore >= 60 ? 'secondary' : 'destructive'}>
                          {analysis.feasibilityScore}%
                        </Badge>
                      </div>
                      <Progress value={analysis.feasibilityScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                {analysis.timeConflicts.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Schedule Conflicts:</strong>
                      <ul className="mt-2 list-disc list-inside">
                        {analysis.timeConflicts.map((conflict, index) => (
                          <li key={index}>{conflict}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {analysis.durationWarnings.length > 0 && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Timing Considerations:</strong>
                      <ul className="mt-2 list-disc list-inside">
                        {analysis.durationWarnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  )}
                )}
                
                {analysis.suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Schedule Preview</h3>
              <p className="text-muted-foreground">
                Here's how your morning timeline will look
              </p>
            </div>
            
            {schedulePreview && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{schedulePreview.totalDuration}min</div>
                        <p className="text-sm text-muted-foreground">Total Duration</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{schedulePreview.freeTime}min</div>
                        <p className="text-sm text-muted-foreground">Buffer Time</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Morning Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {schedulePreview.timeline.map((item, index) => (
                        <div 
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            item.isNew ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-mono">{item.time}</div>
                            <div className={`font-medium ${item.isNew ? 'text-blue-700' : ''}`}>
                              {item.ritual}
                              {item.isNew && <Badge className="ml-2">New</Badge>}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.duration}min
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Ready to Create!</h3>
              <p className="text-muted-foreground">
                Your ritual has been validated and optimized. Click finish to add it to your morning routine.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Success Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start with shorter durations and gradually increase</li>
                <li>• Set up your environment the night before</li>
                <li>• Track your progress and celebrate small wins</li>
                <li>• Be patient - habits take 21-66 days to form</li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Ritual Creation Wizard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} />
          </div>
          
          {/* Step content */}
          {renderStepContent()}
          
          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleFinish}>
                Create Ritual
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RitualCreationWizard;
