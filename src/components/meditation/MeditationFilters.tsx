
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { MeditationSession } from '@/types/meditation';

interface MeditationFiltersProps {
  durationFilter: number | null;
  setDurationFilter: (value: number | null) => void;
  resetFilters: () => void;
}

const MeditationFilters: React.FC<MeditationFiltersProps> = ({
  durationFilter,
  setDurationFilter,
  resetFilters
}) => {
  // Duration options
  const durations = [
    { value: 5, label: '<5 min' },
    { value: 10, label: '5-10 min' },
    { value: 15, label: '10-15 min' },
    { value: 30, label: '15-30 min' },
    { value: 60, label: '30+ min' }
  ];

  return (
    <div className="p-4 border-b">
      <div className="mb-4">
        <h3 className="font-medium mb-2">Filter by Duration</h3>
        <div className="flex flex-wrap gap-2">
          {durations.map(duration => (
            <Button
              key={duration.value}
              size="sm"
              variant={durationFilter === duration.value ? "default" : "outline"}
              onClick={() => durationFilter === duration.value ? setDurationFilter(null) : setDurationFilter(duration.value)}
              className="text-xs sm:text-sm"
            >
              {duration.label}
            </Button>
          ))}
        </div>
      </div>
      
      {durationFilter !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <Button 
            variant="ghost"
            size="sm"
            className="text-muted-foreground flex items-center gap-1"
            onClick={resetFilters}
          >
            <X className="h-4 w-4" /> Clear filters
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MeditationFilters;
