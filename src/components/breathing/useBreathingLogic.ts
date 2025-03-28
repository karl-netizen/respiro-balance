
import { useState, useEffect, useRef } from 'react';
import { BreathingPhase } from './types';

export function useBreathingLogic() {
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const startBreathing = () => {
    setIsActive(true);
    setBreathingPhase('inhale');
    setCount(4);
    
    if (voiceEnabled) {
      speakBreathingCue('inhale');
    }
  };

  const stopBreathing = () => {
    setIsActive(false);
    setBreathingPhase('inhale');
    setCount(4);
    
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
        
        // Change phase
        switch (breathingPhase) {
          case 'inhale':
            const newPhase = 'hold';
            setBreathingPhase(newPhase);
            if (voiceEnabled) speakBreathingCue(newPhase);
            return 4; // Hold for 4 seconds
          case 'hold':
            const exhalePhase = 'exhale';
            setBreathingPhase(exhalePhase);
            if (voiceEnabled) speakBreathingCue(exhalePhase);
            return 6; // Exhale for 6 seconds
          case 'exhale':
            const restPhase = 'rest';
            setBreathingPhase(restPhase);
            if (voiceEnabled) speakBreathingCue(restPhase);
            return 2; // Rest for 2 seconds  
          case 'rest':
            const inhalePhase = 'inhale';
            setBreathingPhase(inhalePhase);
            if (voiceEnabled) speakBreathingCue(inhalePhase);
            return 4; // Inhale for 4 seconds
          default:
            return 4;
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
    startBreathing,
    stopBreathing,
    toggleVoice
  };
}
