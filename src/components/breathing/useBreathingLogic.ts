
import { useState, useEffect, useRef } from 'react';
import { BreathingPhase } from './types';
import { toast } from 'sonner';

type BreathingPattern = {
  inhale: number;
  hold?: number;
  exhale: number;
  rest?: number;
  name: string;
  description: string;
};

const breathingPatterns: Record<string, BreathingPattern> = {
  box: { 
    inhale: 4, 
    hold: 4, 
    exhale: 4, 
    rest: 4,
    name: "Box Breathing",
    description: "Equal 4-count inhale, hold, exhale, and rest"
  },
  '478': { 
    inhale: 4, 
    hold: 7, 
    exhale: 8,
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8"
  },
  coherent: { 
    inhale: 5, 
    exhale: 5,
    name: "Coherent Breathing",
    description: "5-5 balanced breathing for heart rate coherence"
  },
  alternate: {
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 2,
    name: "Alternate Nostril",
    description: "Alternating between nostrils with holds"
  }
};

export function useBreathingLogic() {
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState('box');
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const patternRef = useRef<BreathingPattern>(breathingPatterns.box);
  const cyclesCompletedRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectTechnique = (techniqueId: string) => {
    if (breathingPatterns[techniqueId]) {
      setSelectedTechnique(techniqueId);
      patternRef.current = breathingPatterns[techniqueId];
      
      // Reset to inhale phase and appropriate count
      setBreathingPhase('inhale');
      setCount(patternRef.current.inhale);
      
      // If already active, notify of technique change
      if (isActive) {
        toast.info(`Switched to ${patternRef.current.name}`, {
          description: patternRef.current.description
        });
      }
    }
  };

  const startBreathing = () => {
    setIsActive(true);
    setBreathingPhase('inhale');
    setCount(patternRef.current.inhale);
    cyclesCompletedRef.current = 0;
    
    toast.success(`Starting ${patternRef.current.name}`, {
      description: "Follow the animation and sync your breath"
    });
    
    if (voiceEnabled) {
      speakBreathingCue('inhale');
    }
  };

  const stopBreathing = () => {
    setIsActive(false);
    setBreathingPhase('inhale');
    setCount(patternRef.current.inhale);
    
    // Cancel any ongoing speech
    if (window.speechSynthesis && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    
    // Clear any active timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast.info("Breathing exercise stopped", {
      description: `Completed ${cyclesCompletedRef.current} breath cycles`
    });
  };
  
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    
    toast.info(voiceEnabled ? "Voice guidance disabled" : "Voice guidance enabled");
    
    // If turning off voice while active, cancel any ongoing speech
    if (voiceEnabled && isActive && window.speechSynthesis && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
  };
  
  const speakBreathingCue = (phase: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    // Cancel any previous speech
    if (window.speechSynthesis.speaking && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(phase);
    utterance.rate = 0.7; // Slower rate for a softer, more calming effect
    utterance.volume = 0.8;
    utterance.pitch = 1.2; // Slightly higher pitch for a more feminine voice
    
    // Try to find a calm, soothing female voice
    const voices = window.speechSynthesis.getVoices();
    // Prioritize female voices - try to find voices with these names first
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Victoria') || 
      voice.name.includes('Karen') ||
      voice.name.includes('Tessa') ||
      (voice.name.includes('Google') && voice.name.includes('Female'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else {
      // Fall back to any voice that sounds feminine based on language
      const femaleVoice = voices.find(voice => voice.lang.includes('en-US') || voice.lang.includes('en-GB'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    }
    
    // Store reference and speak
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Load voices when component mounts
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    
    return () => {
      // Clean up any speech on unmount
      if (window.speechSynthesis && speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle breathing timer
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount > 1) return prevCount - 1;
        
        // Change phase based on current pattern
        switch (breathingPhase) {
          case 'inhale':
            if (patternRef.current.hold) {
              const newPhase = 'hold';
              setBreathingPhase(newPhase);
              if (voiceEnabled) speakBreathingCue(newPhase);
              return patternRef.current.hold; // Hold duration
            } else {
              const newPhase = 'exhale';
              setBreathingPhase(newPhase);
              if (voiceEnabled) speakBreathingCue(newPhase);
              return patternRef.current.exhale; // Exhale duration
            }
          case 'hold':
            const exhalePhase = 'exhale';
            setBreathingPhase(exhalePhase);
            if (voiceEnabled) speakBreathingCue(exhalePhase);
            return patternRef.current.exhale; // Exhale duration
          case 'exhale':
            if (patternRef.current.rest) {
              const restPhase = 'rest';
              setBreathingPhase(restPhase);
              if (voiceEnabled) speakBreathingCue(restPhase);
              return patternRef.current.rest; // Rest duration
            } else {
              // If no rest phase, we've completed a cycle
              cyclesCompletedRef.current += 1;
              const inhalePhase = 'inhale';
              setBreathingPhase(inhalePhase);
              if (voiceEnabled) speakBreathingCue(inhalePhase);
              return patternRef.current.inhale; // Inhale duration
            }  
          case 'rest':
            // Completed a full cycle
            cyclesCompletedRef.current += 1;
            const inhalePhase = 'inhale';
            setBreathingPhase(inhalePhase);
            if (voiceEnabled) speakBreathingCue(inhalePhase);
            return patternRef.current.inhale; // Inhale duration
          default:
            return patternRef.current.inhale;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, breathingPhase, voiceEnabled]);

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
    cyclesCompleted: cyclesCompletedRef.current
  };
}
