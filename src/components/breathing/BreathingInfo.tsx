
import React from 'react';

interface BreathingInfoProps {
  voiceEnabled: boolean;
  techniqueId: string;
}

const techniquesInfo = {
  box: {
    name: "Box Breathing",
    pattern: "4-4-4-4",
    description: "Equal inhale, hold, exhale, and pause. Great for focus and stress reduction."
  },
  '478': {
    name: "4-7-8 Breathing",
    pattern: "4-7-8",
    description: "Inhale for 4, hold for 7, exhale for 8. Perfect for sleep and anxiety."
  },
  coherent: {
    name: "Coherent Breathing",
    pattern: "5-5",
    description: "Slow, rhythmic breathing at about 5-6 breaths per minute."
  }
};

const BreathingInfo: React.FC<BreathingInfoProps> = ({ voiceEnabled, techniqueId }) => {
  const technique = techniquesInfo[techniqueId as keyof typeof techniquesInfo] || techniquesInfo.box;
  
  return (
    <div className="mt-8 p-4 rounded-lg bg-white/50 dark:bg-black/10 text-sm text-foreground/70">
      <p className="font-medium text-foreground/90">{technique.name} ({technique.pattern})</p>
      <p className="mt-1">
        {technique.description} Practice daily for best results.
      </p>
      {voiceEnabled && (
        <p className="mt-2 text-xs text-primary">
          Voice guidance is enabled. A calming voice will guide you through each breathing phase.
        </p>
      )}
    </div>
  );
};

export default BreathingInfo;
