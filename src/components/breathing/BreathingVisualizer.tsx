
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBreathingLogic } from './useBreathingLogic';
import { SessionProvider } from './context/SessionContext';
import BreathingVisualizerHeader from './components/BreathingVisualizerHeader';
import SessionDisplay from './components/SessionDisplay';
import VisualizerContent from './components/VisualizerContent';

interface BreathingVisualizerProps {
  selectedTechnique?: string;
  onSessionComplete?: (techniqueId: string, durationMinutes: number) => void;
}

const BreathingVisualizer: React.FC<BreathingVisualizerProps> = ({ 
  selectedTechnique = "box",
  onSessionComplete 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    breathingPhase,
    count,
    isActive,
    voiceEnabled,
    selectedTechnique: currentTechnique,
    startBreathing,
    stopBreathing,
    toggleVoice,
    selectTechnique,
    cyclesCompleted
  } = useBreathingLogic();

  // Apply technique from props
  useEffect(() => {
    if (selectedTechnique && selectedTechnique !== currentTechnique) {
      selectTechnique(selectedTechnique);
    }
  }, [selectedTechnique, currentTechnique, selectTechnique]);

  // Handle tab selection and technique selection from URL query parameters
  useEffect(() => {
    const technique = searchParams.get('technique');
    
    if (technique && ['box', '478', 'coherent', 'alternate'].includes(technique)) {
      selectTechnique(technique);
    }
  }, [searchParams, selectTechnique]);

  return (
    <section className="py-6 px-4 bg-secondary/30 rounded-lg" id="breathing-visualizer">
      <div className="mx-auto">
        <BreathingVisualizerHeader />
        
        <div className="flex flex-col items-center mx-auto">
          <SessionProvider 
            isActive={isActive} 
            onSessionComplete={onSessionComplete} 
            currentTechnique={currentTechnique}
          >
            <SessionDisplay />
            
            <VisualizerContent 
              breathingPhase={breathingPhase}
              count={count}
              isActive={isActive}
              voiceEnabled={voiceEnabled}
              selectedTechnique={currentTechnique}
              onSelectTechnique={selectTechnique}
              onStart={startBreathing}
              onStop={stopBreathing}
              onToggleVoice={toggleVoice}
            />
          </SessionProvider>
        </div>
      </div>
    </section>
  );
};

export default BreathingVisualizer;
