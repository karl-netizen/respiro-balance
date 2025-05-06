
export type BreathingPattern = {
  inhale: number;
  hold?: number;
  exhale: number;
  rest?: number;
  name: string;
  description: string;
};

export const breathingPatterns: Record<string, BreathingPattern> = {
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
