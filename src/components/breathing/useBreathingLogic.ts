
import { useState, useRef, useEffect } from 'react';
import { BreathingPhase } from './types';
import { toast } from 'sonner';
import { breathingPatterns } from './data/breathingPatterns';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useBreathingTimer } from './hooks/useBreathingTimer';

export function useBreathingLogic() {
  const [isActive, setIsActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState('box');
  const patternRef = useRef(breathingPatterns.box);
  
  const { speakBreathingCue, cancelSpeech } = useSpeechSynthesis();
  
  // Handle phase changes and speech cues
  const handlePhaseChange = (phase: BreathingPhase) => {
    if (voiceEnabled) {
      speakBreathingCue(phase, voiceEnabled);
    }
  };
  
  // Update pattern when technique changes
  useEffect(() => {
    patternRef.current = breathingPatterns[selectedTechnique];
    resetTimer();
  }, [selectedTechnique]);
  
  // Timer logic
  const { 
    breathingPhase, 
    count, 
    cyclesCompleted,
    resetTimer
  } = useBreathingTimer({
    isActive,
    voiceEnabled,
    pattern: patternRef.current,
    onPhaseChange: handlePhaseChange
  });

  const selectTechnique = (techniqueId: string) => {
    if (breathingPatterns[techniqueId]) {
      setSelectedTechnique(techniqueId);
      patternRef.current = breathingPatterns[techniqueId];
      
      // If already active, notify of technique change
      if (isActive) {
        stopBreathing();
        toast.info(`Switched to ${patternRef.current.name}`, {
          description: patternRef.current.description
        });
      }
    }
  };

  const startBreathing = () => {
    setIsActive(true);
    resetTimer();
    
    toast.success(`Starting ${patternRef.current.name}`, {
      description: "Follow the animation and sync your breath"
    });
    
    if (voiceEnabled) {
      speakBreathingCue('inhale', voiceEnabled);
    }
  };

  const stopBreathing = () => {
    setIsActive(false);
    resetTimer();
    
    // Cancel any ongoing speech
    cancelSpeech();
    
    toast.info("Breathing exercise stopped", {
      description: `Completed ${cyclesCompleted} breath cycles`
    });
  };
  
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    
    toast.info(voiceEnabled ? "Voice guidance disabled" : "Voice guidance enabled");
    
    // If turning off voice while active, cancel any ongoing speech
    if (voiceEnabled && isActive) {
      cancelSpeech();
    }
  };

  return {
    breathingPhase,
    count,
    isActive,
    voiceEnabled,
    selectedTechnique,
    startBreathing,
    stopBreathing,
    toggleVoice,
    selectTechnique,
    cyclesCompleted
  };
}
