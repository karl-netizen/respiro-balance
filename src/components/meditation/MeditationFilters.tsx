
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { X } from 'lucide-react';

export interface MeditationFiltersProps {
  durationFilter: number | null;
  setDurationFilter: (duration: number | null) => void;
  levelFilter: string | null;
  setLevelFilter: (level: string | null) => void;
  resetFilters: () => void;
}

const MeditationFilters: React.FC<MeditationFiltersProps> = ({
  durationFilter,
  setDurationFilter,
  levelFilter,
  setLevelFilter,
  resetFilters
}) => {
  const handleDurationChange = (value: string) => {
    // If clicking the already selected value, clear the filter
    if (value === durationFilter?.toString()) {
      setDurationFilter(null);
    } else if (value) {
      setDurationFilter(Number(value));
    } else {
      setDurationFilter(null);
    }
  };
  
  const handleLevelChange = (value: string) => {
    // If clicking the already selected value, clear the filter
    if (value === levelFilter) {
      setLevelFilter(null);
    } else if (value) {
      setLevelFilter(value);
    } else {
      setLevelFilter(null);
    }
  };

  return (
    <div className="p-4 border-b space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Duration</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 5, label: "≤ 5 min" },
            { value: 10, label: "5-10 min" },
            { value: 15, label: "10-15 min" },
            { value: 30, label: "15-30 min" },
            { value: 60, label: "> 30 min" }
          ].map(option => (
            <Button
              key={option.value}
              onClick={() => setDurationFilter(durationFilter === option.value ? null : option.value)}
              variant={durationFilter === option.value ? "default" : "outline"}
              className="text-xs sm:text-sm"
              size="sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Level</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" }
          ].map(option => (
            <Button
              key={option.value}
              onClick={() => setLevelFilter(levelFilter === option.value ? null : option.value)}
              variant={levelFilter === option.value ? "default" : "outline"}
              className="text-xs sm:text-sm"
              size="sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      {(durationFilter !== null || levelFilter !== null) && (
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground flex items-center"
          onClick={resetFilters}
        >
          <X className="h-4 w-4 mr-1" /> Clear Filters
        </Button>
      )}
    </div>
  );
};

export default MeditationFilters;
