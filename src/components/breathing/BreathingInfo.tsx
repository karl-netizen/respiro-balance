
import React from 'react';

interface BreathingInfoProps {
  voiceEnabled: boolean;
}

const BreathingInfo: React.FC<BreathingInfoProps> = ({ voiceEnabled }) => {
  return (
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
  );
};

export default BreathingInfo;
