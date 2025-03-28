
import React from 'react';
import { BreathingCircle } from './BreathingCircle';
import { BreathingControls } from './BreathingControls';
import { BreathingInfo } from './BreathingInfo';
import { useBreathingLogic } from './useBreathingLogic';

const BreathingVisualizer = () => {
  const {
    breathingPhase,
    count,
    isActive,
    voiceEnabled,
    startBreathing,
    stopBreathing,
    toggleVoice
  } = useBreathingLogic();

  return (
    <section className="py-16 px-6 bg-secondary/50" id="meditation">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Breathing Visualizer</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Use this guided breathing exercise to find calm and focus in just a few minutes.
            Follow the animation and synchronize your breath for an immediate sense of relaxation.
          </p>
        </div>
        
        <div className="flex flex-col items-center max-w-md mx-auto">
          <BreathingCircle 
            breathingPhase={breathingPhase} 
            count={count} 
          />
          
          <BreathingControls 
            isActive={isActive}
            voiceEnabled={voiceEnabled}
            onStart={startBreathing}
            onStop={stopBreathing}
            onToggleVoice={toggleVoice}
          />
          
          <BreathingInfo voiceEnabled={voiceEnabled} />
        </div>
      </div>
    </section>
  );
};

export default BreathingVisualizer;
