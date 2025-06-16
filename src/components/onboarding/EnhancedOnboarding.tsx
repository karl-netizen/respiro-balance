
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, Star, Target, Zap } from 'lucide-react';
import { FadeIn, SlideIn } from '@/components/animations/MicroInteractions';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

const EnhancedOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to Respiro Balance',
      description: 'Your journey to better mental wellness starts here',
      icon: <Star className="h-6 w-6" />,
      completed: false
    },
    {
      id: 'goals',
      title: 'Set Your Goals',
      description: 'Define what you want to achieve with mindfulness',
      icon: <Target className="h-6 w-6" />,
      completed: false
    },
    {
      id: 'preferences',
      title: 'Customize Experience',
      description: 'Tailor the app to your preferences',
      icon: <Zap className="h-6 w-6" />,
      completed: false
    }
  ]);

  const progressPercentage = (currentStep / steps.length) * 100;

  const handleNextStep = () => {
    const newSteps = [...steps];
    newSteps[currentStep].completed = true;
    setSteps(newSteps);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <FadeIn>
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-4">
              {steps[currentStep]?.title}
            </CardTitle>
            <div className="flex justify-center mb-4">
              {steps[currentStep]?.icon}
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <SlideIn direction="up">
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-8">
                  {steps[currentStep]?.description}
                </p>
              </div>
            </SlideIn>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleNextStep}
                className="flex items-center gap-2"
                size="lg"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex justify-center space-x-2 mt-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};

export default EnhancedOnboarding;
