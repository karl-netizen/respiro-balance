
import React from 'react';
import { Filter, Clock, Award } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface MeditationFiltersProps {
  durationRange: [number, number];
  onDurationChange: (value: [number, number]) => void;
  selectedLevel: string | null;
  onLevelChange: (level: string | null) => void;
  onResetFilters: () => void;
}

const MeditationFilters: React.FC<MeditationFiltersProps> = ({
  durationRange,
  onDurationChange,
  selectedLevel,
  onLevelChange,
  onResetFilters
}) => {
  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <Filter size={18} />
          Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={onResetFilters}>
          Reset
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Duration (minutes)</span>
          </div>
          
          <div className="px-2">
            <Slider 
              defaultValue={durationRange} 
              min={1} 
              max={60} 
              step={1}
              onValueChange={(value) => onDurationChange(value as [number, number])}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>{durationRange[0]} min</span>
              <span>{durationRange[1]} min</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">Experience Level</span>
          </div>
          
          <Select 
            value={selectedLevel || ''} 
            onValueChange={(value) => onLevelChange(value === '' ? null : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MeditationFilters;
