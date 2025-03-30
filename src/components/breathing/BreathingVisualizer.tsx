
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BreathingCircle from './BreathingCircle';
import BreathingControls from './BreathingControls';
import BreathingInfo from './BreathingInfo';
import { useBreathingLogic } from './useBreathingLogic';

const BreathingVisualizer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    breathingPhase,
    count,
    isActive,
    voiceEnabled,
    selectedTechnique,
    startBreathing,
    stopBreathing,
    toggleVoice,
    selectTechnique
  } = useBreathingLogic();

  // Handle tab selection from URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
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
      
      // Remove the tab parameter to avoid reapplying on refresh
      searchParams.delete('tab');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

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
            selectedTechnique={selectedTechnique}
            onSelectTechnique={selectTechnique}
            onStart={startBreathing}
            onStop={stopBreathing}
            onToggleVoice={toggleVoice}
          />
          
          <BreathingInfo 
            voiceEnabled={voiceEnabled}
            techniqueId={selectedTechnique}
          />
        </div>
      </div>
    </section>
  );
};

export default BreathingVisualizer;
