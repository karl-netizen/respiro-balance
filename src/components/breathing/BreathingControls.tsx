
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Volume, Wind } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BreathingControlsProps {
  isActive: boolean;
  voiceEnabled: boolean;
  selectedTechnique: string;
  onStart: () => void;
  onStop: () => void;
  onToggleVoice: () => void;
  onSelectTechnique: (techniqueId: string) => void;
}

const BreathingControls: React.FC<BreathingControlsProps> = ({
  isActive,
  voiceEnabled,
  selectedTechnique,
  onStart,
  onStop,
  onToggleVoice,
  onSelectTechnique
}) => {
  const techniques = [
    { id: "box", name: "Box Breathing" },
    { id: "478", name: "4-7-8 Breathing" },
    { id: "coherent", name: "Coherent Breathing" },
    { id: "alternate", name: "Alternate Nostril" }
  ];

  return (
    <div className="w-full max-w-md mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Select value={selectedTechnique} onValueChange={onSelectTechnique} disabled={isActive}>
            <SelectTrigger className="w-full max-w-[250px]">
              <SelectValue placeholder="Select Technique" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {techniques.map(technique => (
                <SelectItem key={technique.id} value={technique.id}>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-primary" />
                    <span>{technique.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onToggleVoice}
          >
            {voiceEnabled ? 
              <Volume2 className="h-5 w-5 text-primary" /> : 
              <Volume className="h-5 w-5 text-muted-foreground" />
            }
          </Button>
        </div>
        
        <div className="flex justify-center mt-2">
          {!isActive ? (
            <Button 
              size="lg" 
              className="w-full py-6 text-lg"
              onClick={onStart}
            >
              <Play className="mr-2 h-5 w-5" /> Start Breathing
            </Button>
          ) : (
            <Button 
              variant="destructive"
              size="lg"
              className="w-full py-6 text-lg"
              onClick={onStop}
            >
              <Pause className="mr-2 h-5 w-5" /> Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreathingControls;
