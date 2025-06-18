
import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X, SkipForward } from 'lucide-react';
import { TourSequence, TourStep } from './types';
import { useUserGuideProgress } from './hooks/useUserGuideProgress';

interface GuidedTourEngineProps {
  tours: TourSequence[];
  activeTourId?: string;
  onTourComplete?: (tourId: string) => void;
  onTourSkip?: (tourId: string) => void;
}

const GuidedTourEngine: React.FC<GuidedTourEngineProps> = ({
  tours,
  activeTourId,
  onTourComplete,
  onTourSkip
}) => {
  const [currentTour, setCurrentTour] = useState<TourSequence | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const { markTourCompleted, hasTourCompleted, userPreferences } = useUserGuideProgress();

  // Find and start tour
  const startTour = useCallback((tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour || hasTourCompleted(tourId)) return;

    setCurrentTour(tour);
    setCurrentStepIndex(0);
    setIsVisible(true);
    setOverlayVisible(true);
  }, [tours, hasTourCompleted]);

  // End tour
  const endTour = useCallback((completed: boolean = false) => {
    if (currentTour) {
      if (completed) {
        markTourCompleted(currentTour.id);
        onTourComplete?.(currentTour.id);
      } else {
        onTourSkip?.(currentTour.id);
      }
    }
    
    setCurrentTour(null);
    setCurrentStepIndex(0);
    setIsVisible(false);
    setOverlayVisible(false);
    setTargetElement(null);
  }, [currentTour, markTourCompleted, onTourComplete, onTourSkip]);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (!currentTour) return;

    if (currentStepIndex < currentTour.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      endTour(true);
    }
  }, [currentTour, currentStepIndex, endTour]);

  // Navigate to previous step
  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  // Skip tour
  const skipTour = useCallback(() => {
    endTour(false);
  }, [endTour]);

  // Find target element and highlight it
  useEffect(() => {
    if (!currentTour || !isVisible) return;

    const currentStep = currentTour.steps[currentStepIndex];
    if (!currentStep) return;

    const target = document.querySelector(currentStep.target);
    if (target) {
      setTargetElement(target);
      
      // Scroll target into view
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });

      // Add highlight class if specified
      if (currentStep.highlight) {
        target.classList.add('tour-highlight');
      }
    }

    // Cleanup previous highlights
    return () => {
      if (target && currentStep.highlight) {
        target.classList.remove('tour-highlight');
      }
    };
  }, [currentTour, currentStepIndex, isVisible]);

  // Auto-start tour based on activeTourId
  useEffect(() => {
    if (activeTourId && !currentTour) {
      startTour(activeTourId);
    }
  }, [activeTourId, currentTour, startTour]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;

      switch (event.key) {
        case 'Escape':
          endTour(false);
          break;
        case 'ArrowRight':
        case 'Enter':
          event.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          previousStep();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, nextStep, previousStep, endTour]);

  if (!currentTour || !isVisible) {
    return null;
  }

  const currentStep = currentTour.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / currentTour.steps.length) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === currentTour.steps.length - 1;

  // Calculate position for tour step card
  const getStepPosition = () => {
    if (!targetElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const rect = targetElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + 20;
    let left = rect.left;

    // Adjust for viewport boundaries
    if (top + 300 > viewportHeight) {
      top = rect.top - 320;
    }
    if (left + 400 > viewportWidth) {
      left = viewportWidth - 420;
    }
    if (left < 20) {
      left = 20;
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 1000
    };
  };

  const tourContent = (
    <>
      {/* Overlay */}
      {overlayVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => endTour(false)}
        />
      )}

      {/* Spotlight effect for highlighted element */}
      {targetElement && currentStep.highlight && (
        <div 
          className="fixed pointer-events-none z-50"
          style={{
            top: targetElement.getBoundingClientRect().top - 4,
            left: targetElement.getBoundingClientRect().left - 4,
            width: targetElement.getBoundingClientRect().width + 8,
            height: targetElement.getBoundingClientRect().height + 8,
            boxShadow: '0 0 0 4px rgba(0, 137, 123, 0.3), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px'
          }}
        />
      )}

      {/* Tour Step Card */}
      <div 
        style={getStepPosition()}
        className="animate-scale-in z-50"
      >
        <Card className="w-[400px] max-w-[90vw] shadow-2xl border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-primary">
                {currentStep.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => endTour(false)}
                className="h-8 w-8 p-0"
                aria-label="Close tour"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Step {currentStepIndex + 1} of {currentTour.steps.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {typeof currentStep.content === 'string' ? (
                <p>{currentStep.content}</p>
              ) : (
                currentStep.content
              )}
            </div>

            {/* Custom component */}
            {currentStep.customComponent && (
              <div className="border-t pt-4">
                <currentStep.customComponent />
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-2">
                {!isFirstStep && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousStep}
                    className="flex items-center space-x-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                )}
                
                {currentStep.skippable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                    className="flex items-center space-x-1 text-muted-foreground"
                  >
                    <SkipForward className="h-4 w-4" />
                    <span>Skip Tour</span>
                  </Button>
                )}
              </div>

              <Button
                onClick={nextStep}
                size="sm"
                className="flex items-center space-x-1"
              >
                <span>{isLastStep ? 'Complete' : 'Next'}</span>
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return createPortal(tourContent, document.body);
};

export default GuidedTourEngine;
