
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  return (
    <div className="p-4 border-b flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[120px]">
        <Select
          value={durationFilter?.toString() || ''}
          onValueChange={(value) => setDurationFilter(value ? Number(value) : null)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Duration</SelectItem>
            <SelectItem value="5">5 min or less</SelectItem>
            <SelectItem value="10">5-10 min</SelectItem>
            <SelectItem value="15">10-15 min</SelectItem>
            <SelectItem value="30">15-30 min</SelectItem>
            <SelectItem value="60">30+ min</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[120px]">
        <Select
          value={levelFilter || ''}
          onValueChange={(value) => setLevelFilter(value || null)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Level</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(durationFilter !== null || levelFilter !== null) && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={resetFilters}
        >
          <X className="h-4 w-4 mr-1" /> Clear Filters
        </Button>
      )}
    </div>
  );
};

export default MeditationFilters;
