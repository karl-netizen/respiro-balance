
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
        <ToggleGroup type="single" value={durationFilter?.toString() || ""} onValueChange={handleDurationChange} className="flex flex-wrap gap-2">
          <ToggleGroupItem value="5" className="text-xs sm:text-sm bg-background border border-input hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">≤ 5 min</ToggleGroupItem>
          <ToggleGroupItem value="10" className="text-xs sm:text-sm bg-background border border-input hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">5-10 min</ToggleGroupItem>
          <ToggleGroupItem value="15" className="text-xs sm:text-sm bg-background border border-input hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">10-15 min</ToggleGroupItem>
          <ToggleGroupItem value="30" className="text-xs sm:text-sm bg-background border border-input hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">15-30 min</ToggleGroupItem>
          <ToggleGroupItem value="60" className="text-xs sm:text-sm bg-background border border-input hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">&gt; 30 min</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Level</h3>
        <ToggleGroup type="single" value={levelFilter || ""} onValueChange={handleLevelChange} className="flex flex-wrap gap-2">
          <ToggleGroupItem value="beginner" className="text-xs sm:text-sm bg-background border border-input hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Beginner</ToggleGroupItem>
          <ToggleGroupItem value="intermediate" className="text-xs sm:text-sm bg-background border border-input hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Intermediate</ToggleGroupItem>
          <ToggleGroupItem value="advanced" className="text-xs sm:text-sm bg-background border border-input hover:bg-accent data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Advanced</ToggleGroupItem>
        </ToggleGroup>
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
