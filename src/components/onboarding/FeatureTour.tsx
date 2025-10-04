import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="meditation-library"]',
    title: 'Meditation Library',
    description: 'Browse curated meditation sessions designed for all experience levels.',
    position: 'right'
  },
  {
    target: '[data-tour="session-counter"]',
    title: 'Session Counter',
    description: 'Track your monthly usage. Free tier includes 5 sessions per month.',
    position: 'bottom'
  },
  {
    target: '[data-tour="modules"]',
    title: 'Power Modules',
    description: 'Activate modules like Biofeedback and Focus Mode to enhance your practice.',
    position: 'left'
  }
];

export function FeatureTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Check if user has completed tour
    const tourCompleted = localStorage.getItem('feature_tour_completed');
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    
    if (!tourCompleted && onboardingCompleted) {
      // Wait for DOM to be ready
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (isActive && tourSteps[currentStep]) {
      const element = document.querySelector(tourSteps[currentStep].target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX
        });
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('feature_tour_completed', 'true');
    setIsActive(false);
  };

  if (!isActive) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleComplete} />
      
      {/* Tour Card */}
      <Card 
        className="fixed z-50 max-w-sm shadow-lg"
        style={{
          top: `${position.top}px`,
          left: `${position.left + 20}px`
        }}
      >
        <CardContent className="pt-6 space-y-4 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleComplete}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} of {tourSteps.length}
            </span>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(currentStep - 1)}>
                  Back
                </Button>
              )}
              <Button size="sm" onClick={handleNext} className="bg-blue-500 hover:bg-blue-600 text-white">
                {currentStep < tourSteps.length - 1 ? 'Next' : 'Got it!'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
