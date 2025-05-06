
import React from 'react';
import BreathingCircle from '../BreathingCircle';
import BreathingControls from '../BreathingControls';
import BreathingInfo from '../BreathingInfo';
import { BreathingPhase } from '../types';

interface VisualizerContentProps {
  breathingPhase: BreathingPhase;
  count: number;
  isActive: boolean;
  voiceEnabled: boolean;
  selectedTechnique: string;
  onSelectTechnique: (techniqueId: string) => void;
  onStart: () => void;
  onStop: () => void;
  onToggleVoice: () => void;
}

const VisualizerContent: React.FC<VisualizerContentProps> = ({
  breathingPhase,
  count,
  isActive,
  voiceEnabled,
  selectedTechnique,
  onSelectTechnique,
  onStart,
  onStop,
  onToggleVoice
}) => {
  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <BreathingCircle 
          breathingPhase={breathingPhase} 
          count={count} 
          techniqueId={selectedTechnique}
        />
      </div>
          
      <div className="w-full max-w-md mx-auto">
        <BreathingControls 
          isActive={isActive}
          voiceEnabled={voiceEnabled}
          selectedTechnique={selectedTechnique}
          onSelectTechnique={onSelectTechnique}
          onStart={onStart}
          onStop={onStop}
          onToggleVoice={onToggleVoice}
        />
      </div>
          
      <div className="w-full max-w-md mx-auto mt-4">
        <BreathingInfo 
          techniqueId={selectedTechnique}
          voiceEnabled={voiceEnabled}
        />
      </div>
    </>
  );
};

export default VisualizerContent;
