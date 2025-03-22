
import { useState, useEffect } from 'react';

const BreathingVisualizer = () => {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);

  const startBreathing = () => {
    setIsActive(true);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setBreathingPhase('inhale');
    setCount(4);
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount > 1) return prevCount - 1;
        
        // Change phase
        switch (breathingPhase) {
          case 'inhale':
            setBreathingPhase('hold');
            return 4; // Hold for 4 seconds
          case 'hold':
            setBreathingPhase('exhale');
            return 6; // Exhale for 6 seconds
          case 'exhale':
            setBreathingPhase('rest');
            return 2; // Rest for 2 seconds  
          case 'rest':
            setBreathingPhase('inhale');
            return 4; // Inhale for 4 seconds
          default:
            return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, breathingPhase]);

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
              <button 
                onClick={startBreathing}
                className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-mindflow-dark transition-colors"
              >
                Start Breathing
              </button>
            ) : (
              <button 
                onClick={stopBreathing}
                className="px-6 py-3 rounded-lg bg-secondary border border-primary/30 text-primary font-medium hover:bg-secondary/80 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          
          <div className="mt-8 p-4 rounded-lg bg-white/50 dark:bg-black/10 text-sm text-foreground/70">
            <p>
              This 4-4-6-2 breathing pattern (box breathing) is used by many professionals to reduce stress
              and improve focus. Practice daily for best results.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreathingVisualizer;
