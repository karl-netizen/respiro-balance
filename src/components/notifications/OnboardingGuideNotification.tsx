
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Star,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { onboardingNotificationService, OnboardingSection } from '@/services/OnboardingNotificationService';

interface OnboardingGuideNotificationProps {
  onClose: () => void;
}

const OnboardingGuideNotification: React.FC<OnboardingGuideNotificationProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [sections, setSections] = useState(() => onboardingNotificationService.getOnboardingSections());
  const [progress] = useState(() => onboardingNotificationService.getOnboardingProgress());
  const overallProgress = onboardingNotificationService.calculateOverallProgress();

  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, expanded: !section.expanded }
        : section
    ));
  };

  const handleStepAction = (stepId: string, actionUrl?: string) => {
    if (actionUrl) {
      onboardingNotificationService.markStepComplete(stepId);
      navigate(actionUrl);
      onClose();
    }
  };

  const isStepCompleted = (stepId: string) => {
    return progress.completedSteps.includes(stepId);
  };

  const getSectionProgress = (section: OnboardingSection) => {
    const completedSteps = section.steps.filter(step => isStepCompleted(step.id)).length;
    return Math.round((completedSteps / section.steps.length) * 100);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl text-primary">Getting Started Guide</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome to Respiro Balance! Here's how to begin your wellness journey
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {overallProgress}% Complete
          </Badge>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{progress.completedSteps.length} of 16 steps</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="p-0 max-h-96 overflow-y-auto">
        {sections.map((section) => {
          const sectionProgress = getSectionProgress(section);
          const isCurrentPhase = section.id === progress.currentPhase;
          
          return (
            <div key={section.id} className="border-b last:border-b-0">
              <div
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                  isCurrentPhase ? 'bg-primary/5' : ''
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {section.expanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{section.title}</h3>
                        {isCurrentPhase && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={sectionProgress === 100 ? "default" : "secondary"}>
                      {sectionProgress}%
                    </Badge>
                  </div>
                </div>
              </div>

              {section.expanded && (
                <div className="px-4 pb-4">
                  {section.steps.map((step, index) => {
                    const completed = isStepCompleted(step.id);
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          completed ? 'bg-green-50' : 'bg-gray-50'
                        } mb-2 last:mb-0`}
                      >
                        <div className="flex-shrink-0">
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              {index + 1}.
                            </span>
                            <h4 className={`font-medium ${completed ? 'text-green-800' : ''}`}>
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                        </div>
                        
                        {!completed && step.actionUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStepAction(step.id, step.actionUrl)}
                            className="flex-shrink-0"
                          >
                            {step.actionText}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default OnboardingGuideNotification;
