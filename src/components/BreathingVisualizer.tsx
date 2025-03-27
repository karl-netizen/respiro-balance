
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from 'lucide-react';

const BreathingVisualizer = () => {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
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
    utterance.rate = 0.8;
    utterance.volume = 0.8;
    
    // Try to find a calm, soothing voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Karen') || voice.name.includes('Samantha'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
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
          <div className="relative w-64 h-64 mb-8">
            {/* Center circle */}
            <div 
              className={`
                absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                rounded-full bg-gradient-to-br from-mindflow-light to-mindflow 
                flex items-center justify-center text-white font-medium
                transition-all duration-1000 ease-in-out
                ${breathingPhase === 'inhale' ? 'w-32 h-32 opacity-80' : ''}
                ${breathingPhase === 'hold' ? 'w-52 h-52 opacity-90' : ''}
                ${breathingPhase === 'exhale' ? 'w-32 h-32 opacity-70' : ''}
                ${breathingPhase === 'rest' ? 'w-24 h-24 opacity-60' : ''}
              `}
            >
              <span className="text-lg">
                {breathingPhase === 'inhale' && 'Inhale'}
                {breathingPhase === 'hold' && 'Hold'}
                {breathingPhase === 'exhale' && 'Exhale'}
                {breathingPhase === 'rest' && 'Rest'}
              </span>
            </div>
            
            {/* Outer circles */}
            <div 
              className={`
                absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                rounded-full border-4 border-mindflow-light/30
                transition-all duration-1000 ease-in-out
                ${breathingPhase === 'inhale' ? 'w-48 h-48 opacity-70' : ''}
                ${breathingPhase === 'hold' ? 'w-60 h-60 opacity-40' : ''}
                ${breathingPhase === 'exhale' ? 'w-40 h-40 opacity-30' : ''}
                ${breathingPhase === 'rest' ? 'w-32 h-32 opacity-20' : ''}
              `}
            />
            
            {/* Count display */}
            <div className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md">
              <span className="text-lg font-semibold text-mindflow-dark">{count}</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            {!isActive ? (
              <Button 
                onClick={startBreathing}
                className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-mindflow-dark transition-colors"
              >
                Start Breathing
              </Button>
            ) : (
              <Button 
                onClick={stopBreathing}
                className="px-6 py-3 rounded-lg bg-secondary border border-primary/30 text-primary font-medium hover:bg-secondary/80 transition-colors"
              >
                Reset
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={toggleVoice}
              title={voiceEnabled ? "Disable voice guidance" : "Enable voice guidance"}
              className="w-10 h-10 p-0 rounded-full"
            >
              {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="mt-8 p-4 rounded-lg bg-white/50 dark:bg-black/10 text-sm text-foreground/70">
            <p>
              This 4-4-6-2 breathing pattern (box breathing) is used by many professionals to reduce stress
              and improve focus. Practice daily for best results.
            </p>
            {voiceEnabled && (
              <p className="mt-2 text-xs text-primary">
                Voice guidance is enabled. A calming voice will guide you through each breathing phase.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreathingVisualizer;
