
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
      if (technique && ['box', '478', 'coherent'].includes(technique)) {
        // Select the technique card on the techniques tab
        setTimeout(() => {
          const techniqueCards = document.querySelectorAll('.cursor-pointer');
          const targetCard = Array.from(techniqueCards).find(
            card => card.textContent?.includes(
              technique === 'box' ? 'Box Breathing' : 
              technique === '478' ? '4-7-8' : 
              'Coherent'
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
    } else if (technique && ['box', '478', 'coherent'].includes(technique) && !isActive) {
      // If only technique parameter is present and not on techniques tab
      selectTechnique(technique);
      // Remove the technique parameter after applying
      searchParams.delete('technique');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams, selectTechnique, isActive]);

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
