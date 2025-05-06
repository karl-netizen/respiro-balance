
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import BreathingCircle from './BreathingCircle';
import BreathingControls from './BreathingControls';
import BreathingInfo from './BreathingInfo';
import SessionTimer from './SessionTimer';
import SessionSummary from './SessionSummary';
import { useBreathingLogic } from './useBreathingLogic';

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
      // If a specific technique was requested, select it
      if (technique && ['box', '478', 'coherent', 'alternate'].includes(technique)) {
        selectTechnique(technique);
      }
    } else if (technique && ['box', '478', 'coherent', 'alternate'].includes(technique) && !isActive) {
      // If only technique parameter is present and not on techniques tab
      selectTechnique(technique);
    }
  }, [searchParams, selectTechnique, isActive]);

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
            <SessionSummary 
              duration={sessionDuration} 
              formatTime={formatTime} 
            />
          )}
          
          {isActive && (
            <SessionTimer
              isActive={isActive}
              sessionElapsed={sessionElapsed}
              formatTime={formatTime}
            />
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
