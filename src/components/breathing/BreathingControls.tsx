
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from 'lucide-react';

interface BreathingControlsProps {
  isActive: boolean;
  voiceEnabled: boolean;
  onStart: () => void;
  onStop: () => void;
  onToggleVoice: () => void;
}

const BreathingControls: React.FC<BreathingControlsProps> = ({
  isActive,
  voiceEnabled,
  onStart,
  onStop,
  onToggleVoice
}) => {
  return (
    <div className="flex gap-4">
      {!isActive ? (
        <Button 
          onClick={onStart}
          className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-mindflow-dark transition-colors"
        >
          Start Breathing
        </Button>
      ) : (
        <Button 
          onClick={onStop}
          className="px-6 py-3 rounded-lg bg-secondary border border-primary/30 text-primary font-medium hover:bg-secondary/80 transition-colors"
        >
          Reset
        </Button>
      )}
      
      <Button
        variant="outline"
        onClick={onToggleVoice}
        title={voiceEnabled ? "Disable voice guidance" : "Enable voice guidance"}
        className="w-10 h-10 p-0 rounded-full"
      >
        {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default BreathingControls;
