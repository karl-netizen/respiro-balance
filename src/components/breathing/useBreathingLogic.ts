
import { useState, useEffect, useRef } from 'react';
import { BreathingPhase } from './types';

type BreathingPattern = {
  inhale: number;
  hold?: number;
  exhale: number;
  rest?: number;
};

const breathingPatterns: Record<string, BreathingPattern> = {
  box: { inhale: 4, hold: 4, exhale: 4, rest: 4 },
  '478': { inhale: 4, hold: 7, exhale: 8 },
  coherent: { inhale: 5, exhale: 5 },
};

export function useBreathingLogic() {
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState('box');
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const patternRef = useRef<BreathingPattern>(breathingPatterns.box);

  const selectTechnique = (techniqueId: string) => {
    if (breathingPatterns[techniqueId]) {
      setSelectedTechnique(techniqueId);
      patternRef.current = breathingPatterns[techniqueId];
      
      // Reset to inhale phase and appropriate count
      setBreathingPhase('inhale');
      setCount(patternRef.current.inhale);
    }
  };

  const startBreathing = () => {
    setIsActive(true);
    setBreathingPhase('inhale');
    setCount(patternRef.current.inhale);
    
    if (voiceEnabled) {
      speakBreathingCue('inhale');
    }
  };

  const stopBreathing = () => {
    setIsActive(false);
    setBreathingPhase('inhale');
    setCount(patternRef.current.inhale);
    
    // Cancel any ongoing speech
    if (speechSynthesis && speechSynthesisRef.current) {
      speechSynthesis.cancel();
    }
  };
  
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    
    // If turning off voice while active, cancel any ongoing speech
    if (voiceEnabled && isActive && speechSynthesis && speechSynthesisRef.current) {
      speechSynthesis.cancel();
    }
  };
  
  const speakBreathingCue = (phase: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    // Cancel any previous speech
    if (speechSynthesis.speaking && speechSynthesisRef.current) {
      speechSynthesis.cancel();
    }
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(phase);
    utterance.rate = 0.7; // Slower rate for a softer, more calming effect
    utterance.volume = 0.8;
    utterance.pitch = 1.2; // Slightly higher pitch for a more feminine voice
    
    // Try to find a calm, soothing female voice
    const voices = speechSynthesis.getVoices();
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
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Load voices when component mounts
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
    
    return () => {
      // Clean up any speech on unmount
      if (speechSynthesis && speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
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
              const inhalePhase = 'inhale';
              setBreathingPhase(inhalePhase);
              if (voiceEnabled) speakBreathingCue(inhalePhase);
              return patternRef.current.inhale; // Inhale duration
            }  
          case 'rest':
            const inhalePhase = 'inhale';
            setBreathingPhase(inhalePhase);
            if (voiceEnabled) speakBreathingCue(inhalePhase);
            return patternRef.current.inhale; // Inhale duration
          default:
            return patternRef.current.inhale;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
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
    selectTechnique
  };
}
