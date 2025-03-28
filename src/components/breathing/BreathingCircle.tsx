
import React from 'react';
import { BreathingPhase } from './types';

interface BreathingCircleProps {
  breathingPhase: BreathingPhase;
  count: number;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ breathingPhase, count }) => {
  return (
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
  );
};

export default BreathingCircle;
