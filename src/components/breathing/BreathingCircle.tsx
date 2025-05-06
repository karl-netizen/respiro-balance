
import React, { useMemo } from 'react';
import { cn } from "@/lib/utils";
import { BreathingPhase } from './types';

interface BreathingCircleProps {
  breathingPhase: BreathingPhase;
  count: number;
  techniqueId?: string;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ 
  breathingPhase, 
  count,
  techniqueId = 'box'
}) => {
  // Get technique-specific colors and animations
  const techniqueStyles = useMemo(() => {
    switch (techniqueId) {
      case 'box':
        return {
          baseColor: 'bg-blue-50',
          activeColor: 'bg-blue-400',
          textColor: 'text-blue-900',
          glowColor: 'shadow-blue-300',
          borderColor: 'border-blue-200'
        };
      case '478':
        return {
          baseColor: 'bg-indigo-50',
          activeColor: 'bg-indigo-400',
          textColor: 'text-indigo-900',
          glowColor: 'shadow-indigo-300',
          borderColor: 'border-indigo-200'
        };
      case 'coherent':
        return {
          baseColor: 'bg-teal-50',
          activeColor: 'bg-teal-400',
          textColor: 'text-teal-900',
          glowColor: 'shadow-teal-300',
          borderColor: 'border-teal-200'
        };
      case 'alternate':
        return {
          baseColor: 'bg-purple-50',
          activeColor: 'bg-purple-400',
          textColor: 'text-purple-900',
          glowColor: 'shadow-purple-300',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          baseColor: 'bg-blue-50',
          activeColor: 'bg-blue-400',
          textColor: 'text-blue-900',
          glowColor: 'shadow-blue-300',
          borderColor: 'border-blue-200'
        };
    }
  }, [techniqueId]);

  // Calculate the animation scale based on breathing phase
  const animationScale = useMemo(() => {
    switch (breathingPhase) {
      case 'inhale':
        return 'scale-110 shadow-lg';
      case 'hold':
        return 'scale-110 shadow-lg';
      case 'exhale':
        return 'scale-100 shadow-sm';
      case 'rest':
        return 'scale-100 shadow-sm';
      default:
        return 'scale-100 shadow-sm';
    }
  }, [breathingPhase]);

  // Calculate phase-specific styles
  const phaseStyles = useMemo(() => {
    switch (breathingPhase) {
      case 'inhale':
        return {
          outerRing: `${techniqueStyles.activeColor} opacity-30`,
          innerCircle: `${techniqueStyles.activeColor} opacity-80`,
          textClass: techniqueStyles.textColor,
          animationSpeed: 'transition-all duration-1000 ease-in'
        };
      case 'hold':
        return {
          outerRing: `${techniqueStyles.activeColor} opacity-40`,
          innerCircle: `${techniqueStyles.activeColor} opacity-90`,
          textClass: 'text-white',
          animationSpeed: 'transition-all duration-300 ease-out'
        };
      case 'exhale':
        return {
          outerRing: `${techniqueStyles.baseColor} opacity-30`,
          innerCircle: `${techniqueStyles.activeColor} opacity-60`,
          textClass: techniqueStyles.textColor,
          animationSpeed: 'transition-all duration-1000 ease-out'
        };
      case 'rest':
        return {
          outerRing: `${techniqueStyles.baseColor} opacity-20`,
          innerCircle: `${techniqueStyles.baseColor}`,
          textClass: techniqueStyles.textColor,
          animationSpeed: 'transition-all duration-300 ease-in'
        };
      default:
        return {
          outerRing: `${techniqueStyles.baseColor} opacity-30`,
          innerCircle: `${techniqueStyles.baseColor}`,
          textClass: techniqueStyles.textColor,
          animationSpeed: 'transition-all duration-500 ease-in-out'
        };
    }
  }, [breathingPhase, techniqueStyles]);

  // Use different sizes for mobile and desktop
  const circleSize = "w-full max-w-[250px] h-[250px] sm:w-[280px] sm:h-[280px]";
  const middleRingSize = "w-full max-w-[200px] h-[200px] sm:w-[230px] sm:h-[230px]";
  const innerCircleSize = "w-full max-w-[170px] h-[170px] sm:w-[200px] sm:h-[200px]";

  return (
    <div className="relative flex justify-center items-center mb-6">
      {/* Outer ring */}
      <div
        className={cn(
          "absolute rounded-full opacity-30",
          circleSize,
          phaseStyles.outerRing,
          phaseStyles.animationSpeed,
          animationScale
        )}
      ></div>
      
      {/* Middle ring */}
      <div
        className={cn(
          "absolute rounded-full border-4",
          middleRingSize,
          techniqueStyles.borderColor,
          phaseStyles.animationSpeed,
          animationScale
        )}
      ></div>
      
      {/* Inner circle */}
      <div
        className={cn(
          "rounded-full flex flex-col justify-center items-center shadow-md",
          innerCircleSize,
          techniqueStyles.glowColor,
          phaseStyles.innerCircle,
          phaseStyles.animationSpeed,
          animationScale
        )}
      >
        <div className="text-center">
          <p className={cn("text-xl sm:text-2xl font-bold mb-1 uppercase", phaseStyles.textClass)}>
            {breathingPhase}
          </p>
          <p className={cn("text-4xl sm:text-5xl font-bold", phaseStyles.textClass)}>{count}</p>
        </div>
      </div>
    </div>
  );
};

export default BreathingCircle;
