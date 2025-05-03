
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import BreathingCircle from './BreathingCircle';
import BreathingControls from './BreathingControls';
import BreathingInfo from './BreathingInfo';
import { useBreathingLogic } from './useBreathingLogic';
import { AlertCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BreathingVisualizerProps {
  selectedTechnique?: string;
  onSessionComplete?: (techniqueId: string, durationMinutes: number) => void;
}

const BreathingVisualizer: React.FC<BreathingVisualizerProps> = ({ 
  selectedTechnique = "box",
  onSessionComplete 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessionDuration, setSessionDuration] = useState(0); // in seconds
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const sessionStartTime = useRef<Date | null>(null);
  const sessionInterval = useRef<NodeJS.Timeout | null>(null);
  
  const {
    breathingPhase,
    count,
    isActive,
    voiceEnabled,
    selectedTechnique: currentTechnique,
    startBreathing,
    stopBreathing,
    toggleVoice,
    selectTechnique
  } = useBreathingLogic();

  // Apply technique from props
  useEffect(() => {
    if (selectedTechnique && selectedTechnique !== currentTechnique) {
      selectTechnique(selectedTechnique);
    }
  }, [selectedTechnique, currentTechnique, selectTechnique]);

  // Handle tab selection and technique selection from URL query parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    const technique = searchParams.get('technique');
    
    if (tab === 'techniques') {
      // If we arrived here with the techniques tab parameter, update the parent tab
      const tabsElement = document.querySelector('[role="tablist"]');
      if (tabsElement) {
        const techniquesTab = Array.from(tabsElement.children).find(
          child => child.textContent?.includes('Techniques')
        );
        if (techniquesTab && techniquesTab instanceof HTMLElement) {
          techniquesTab.click();
        }
      }
      
      // If a specific technique was requested, select it
      if (technique && ['box', '478', 'coherent', 'alternate'].includes(technique)) {
        selectTechnique(technique);
        
        // Select the technique card on the techniques tab
        setTimeout(() => {
          const techniqueCards = document.querySelectorAll('.cursor-pointer');
          const targetCard = Array.from(techniqueCards).find(
            card => card.textContent?.includes(
              technique === 'box' ? 'Box Breathing' : 
              technique === '478' ? '4-7-8' : 
              technique === 'coherent' ? 'Coherent' :
              'Alternate Nostril'
            )
          );
          
          if (targetCard instanceof HTMLElement) {
            targetCard.click();
          }
        }, 100); // Small delay to ensure DOM is ready
      }
      
      // Remove the parameters to avoid reapplying on refresh
      if (!isActive) {
        searchParams.delete('tab');
        searchParams.delete('technique');
        setSearchParams(searchParams);
      }
    } else if (technique && ['box', '478', 'coherent', 'alternate'].includes(technique) && !isActive) {
      // If only technique parameter is present and not on techniques tab
      selectTechnique(technique);
      // Remove the technique parameter after applying
      searchParams.delete('technique');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, selectTechnique, isActive]);

  // Start timing when breathing exercise begins
  useEffect(() => {
    if (isActive && !sessionStartTime.current) {
      sessionStartTime.current = new Date();
      sessionInterval.current = setInterval(() => {
        if (sessionStartTime.current) {
          const elapsed = Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 1000);
          setSessionElapsed(elapsed);
          setSessionDuration(elapsed);
        }
      }, 1000);
    } else if (!isActive && sessionStartTime.current) {
      // Calculate final duration when stopped
      const finalDuration = Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 1000);
      setSessionDuration(finalDuration);
      
      // Reset timing mechanism
      if (sessionInterval.current) {
        clearInterval(sessionInterval.current);
        sessionInterval.current = null;
      }
      
      // Call the session complete callback
      if (onSessionComplete && finalDuration >= 30) { // Only count sessions at least 30 seconds
        const minutesCompleted = Math.ceil(finalDuration / 60);
        onSessionComplete(currentTechnique, minutesCompleted);
      }
      
      sessionStartTime.current = null;
    }
    
    return () => {
      if (sessionInterval.current) {
        clearInterval(sessionInterval.current);
      }
    };
  }, [isActive, currentTechnique, onSessionComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-8 px-6 bg-secondary/30 rounded-lg" id="breathing-visualizer">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Breathing Visualizer</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Use this guided breathing exercise to find calm and focus in just a few minutes.
            Follow the animation and synchronize your breath for an immediate sense of relaxation.
          </p>
        </div>
        
        <div className="flex flex-col items-center max-w-md mx-auto">
          {sessionDuration > 0 && !isActive && (
            <div className="w-full mb-6 p-4 bg-card border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Session Completed</h3>
                <span className="text-sm text-muted-foreground">{formatTime(sessionDuration)}</span>
              </div>
              <Progress value={100} className="h-2" />
              {sessionDuration < 30 ? (
                <div className="flex items-center gap-2 mt-4 text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Sessions under 30 seconds aren't tracked. Try again for longer!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>Great job! This session has been added to your stats.</span>
                </div>
              )}
            </div>
          )}
          
          {isActive && (
            <div className="w-full mb-6 p-4 bg-card border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Session in Progress</h3>
                <span className="text-sm">{formatTime(sessionElapsed)}</span>
              </div>
              <Progress value={sessionElapsed % 60 / 60 * 100} className="h-2" />
            </div>
          )}
          
          <BreathingCircle 
            breathingPhase={breathingPhase} 
            count={count} 
            techniqueId={currentTechnique}
          />
          
          <BreathingControls 
            isActive={isActive}
            voiceEnabled={voiceEnabled}
            selectedTechnique={currentTechnique}
            onSelectTechnique={selectTechnique}
            onStart={startBreathing}
            onStop={stopBreathing}
            onToggleVoice={toggleVoice}
          />
          
          <BreathingInfo 
            voiceEnabled={voiceEnabled}
            techniqueId={currentTechnique}
          />
        </div>
      </div>
    </section>
  );
};

export default BreathingVisualizer;
