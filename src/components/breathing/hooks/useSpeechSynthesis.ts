
import { useRef, useEffect } from 'react';

export function useSpeechSynthesis() {
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech synthesis
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
  
  const speakBreathingCue = (phase: string, voiceEnabled: boolean) => {
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

  const cancelSpeech = () => {
    if (window.speechSynthesis && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
  };

  return {
    speakBreathingCue,
    cancelSpeech
  };
}
