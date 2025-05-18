
import React from "react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface EnergyLevelSectionProps {
  energyLevel: number;
  onChange: (value: number) => void;
}

const EnergyLevelSection = ({ energyLevel, onChange }: EnergyLevelSectionProps) => {
  const handleEnergyLevelChange = (value: number[]) => {
    const level = value[0];
    onChange(level);
    
    toast.success("Energy level updated", {
      description: `Your morning energy level has been set to ${level}/10`,
      duration: 1500
    });
  };

  // Get color based on energy level
  const getEnergyLevelColor = (level: number) => {
    if (level <= 3) return "bg-red-500"; // Low energy
    if (level <= 7) return "bg-yellow-500"; // Medium energy
    return "bg-green-500"; // High energy
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">
        Typical morning energy level: {energyLevel}/10
      </h3>
      
      {/* Enhanced energy level visualization */}
      <div className="relative mb-6 mt-4">
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div 
            className={`h-full ${getEnergyLevelColor(energyLevel)} transition-all duration-200`} 
            style={{ width: `${energyLevel * 10}%` }}
          ></div>
        </div>
        <Slider
          value={[energyLevel]}
          onValueChange={handleEnergyLevelChange}
          min={1}
          max={10}
          step={1}
          className="my-2"
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className="text-red-500 font-medium">Low Energy</span>
        <span className="text-yellow-500 font-medium">Medium</span>
        <span className="text-green-500 font-medium">High Energy</span>
      </div>
    </div>
  );
};

export default EnergyLevelSection;
