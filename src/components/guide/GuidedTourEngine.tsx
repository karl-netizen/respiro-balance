
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';
import { TourSequence, TourStep } from './types';

interface GuidedTourEngineProps {
  tours: TourSequence[];
  activeTourId?: string;
  onTourComplete: (tourId: string) => void;
  onTourSkip: (tourId: string) => void;
}

const GuidedTourEngine: React.FC<GuidedTourEngineProps> = ({
  tours,
  activeTourId,
  onTourComplete,
  onTourSkip
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const activeTour = tours.find(tour => tour.id === activeTourId);
  const currentStep = activeTour?.steps[currentStepIndex];

  useEffect(() => {
    if (!currentStep) return;

    const targetElement = document.querySelector(currentStep.target);
    if (targetElement) {
      setHighlightedElement(targetElement);
      targetElement.classList.add('tour-highlight');
      
      // Calculate tooltip position
      const rect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      
      let position = { top: 0, left: 0 };
      
      switch (currentStep.placement) {
        case 'top':
          position = {
            top: rect.top - (tooltipRect?.height || 0) - 10,
            left: rect.left + rect.width / 2 - (tooltipRect?.width || 0) / 2
          };
          break;
        case 'bottom':
          position = {
            top: rect.bottom + 10,
            left: rect.left + rect.width / 2 - (tooltipRect?.width || 0) / 2
          };
          break;
        case 'left':
          position = {
            top: rect.top + rect.height / 2 - (tooltipRect?.height || 0) / 2,
            left: rect.left - (tooltipRect?.width || 0) - 10
          };
          break;
        case 'right':
          position = {
            top: rect.top + rect.height / 2 - (tooltipRect?.height || 0) / 2,
            left: rect.right + 10
          };
          break;
      }
      
      setTooltipPosition(position);
    }

    return () => {
      if (targetElement) {
        targetElement.classList.remove('tour-highlight');
      }
    };
  }, [currentStep]);

  const handleNext = () => {
    if (!activeTour) return;
    
    if (currentStepIndex < activeTour.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onTourComplete(activeTour.id);
      setCurrentStepIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (!activeTour) return;
    onTourSkip(activeTour.id);
    setCurrentStepIndex(0);
  };

  const handleClose = () => {
    if (!activeTour) return;
    onTourSkip(activeTour.id);
    setCurrentStepIndex(0);
  };

  if (!activeTour || !currentStep) {
    return null;
  }

  const progress = ((currentStepIndex + 1) / activeTour.steps.length) * 100;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      
      {/* Tour Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[51] max-w-sm"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          transform: 'translateX(-50%)'
        } as React.CSSProperties}
      >
        <Card className="shadow-lg border-2 border-primary">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{currentStep.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Step {currentStepIndex + 1} of {activeTour.steps.length}
              </p>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {currentStep.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {currentStepIndex > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                {currentStep.skippable !== false && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                  >
                    <SkipForward className="h-4 w-4 mr-1" />
                    Skip
                  </Button>
                )}
                
                <Button
                  size="sm"
                  onClick={handleNext}
                >
                  {currentStepIndex === activeTour.steps.length - 1 ? 'Finish' : 'Next'}
                  {currentStepIndex < activeTour.steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default GuidedTourEngine;
