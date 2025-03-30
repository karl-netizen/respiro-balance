
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mic, MicOff, Info } from 'lucide-react';

interface BreathingTechnique {
  id: string;
  name: string;
  pattern: string;
}

interface BreathingControlsProps {
  isActive: boolean;
  voiceEnabled: boolean;
  selectedTechnique: string;
  onSelectTechnique: (techniqueId: string) => void;
  onStart: () => void;
  onStop: () => void;
  onToggleVoice: () => void;
}

const breathingTechniques: BreathingTechnique[] = [
  {
    id: "box",
    name: "Box",
    pattern: "4-4-4-4"
  },
  {
    id: "478",
    name: "4-7-8",
    pattern: "4-7-8"
  },
  {
    id: "coherent",
    name: "Coherent",
    pattern: "5-5"
  }
];

const BreathingControls: React.FC<BreathingControlsProps> = ({
  isActive,
  voiceEnabled,
  selectedTechnique,
  onSelectTechnique,
  onStart,
  onStop,
  onToggleVoice
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
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

      {!isActive && (
        <div className="mt-4">
          <div className="text-sm text-foreground/70 mb-2 text-center">Select breathing technique:</div>
          <div className="flex gap-2">
            {breathingTechniques.map((technique) => (
              <Button
                key={technique.id}
                variant={selectedTechnique === technique.id ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectTechnique(technique.id)}
                className={`px-4 py-1 text-xs ${selectedTechnique === technique.id ? 'bg-primary text-white' : 'text-foreground/70'}`}
              >
                {technique.name}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs text-primary/80 hover:text-primary"
            >
              <Link to="/breathe?tab=techniques">
                <Info className="h-3 w-3 mr-1" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingControls;
