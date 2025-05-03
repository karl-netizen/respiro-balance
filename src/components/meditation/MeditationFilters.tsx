
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { MeditationSession } from '@/types/meditation';

interface MeditationFiltersProps {
  // Original props
  durationFilter?: number | null;
  setDurationFilter?: (value: number | null) => void;
  resetFilters?: () => void;
  
  // New API props
  sessions?: MeditationSession[];
  onFilteredSessionsChange?: (sessions: MeditationSession[]) => void;
}

const MeditationFilters: React.FC<MeditationFiltersProps> = (props) => {
  // Duration options
  const durations = [
    { value: 5, label: '<5 min' },
    { value: 10, label: '5-10 min' },
    { value: 15, label: '10-15 min' },
    { value: 30, label: '15-30 min' },
    { value: 60, label: '30+ min' }
  ];

  // For the new API
  const [internalDurationFilter, setInternalDurationFilter] = useState<number | null>(null);

  // Determine which API we're using
  const isUsingNewApi = !!props.sessions && !!props.onFilteredSessionsChange;
  
  // Get the appropriate duration filter and setter based on API
  const durationFilter = isUsingNewApi ? internalDurationFilter : props.durationFilter;
  
  const setDurationFilter = (value: number | null) => {
    if (isUsingNewApi) {
      setInternalDurationFilter(value);
    } else if (props.setDurationFilter) {
      props.setDurationFilter(value);
    }
  };
  
  const resetFilters = () => {
    if (isUsingNewApi) {
      setInternalDurationFilter(null);
    } else if (props.resetFilters) {
      props.resetFilters();
    }
  };
  
  // Filter sessions when using new API
  useEffect(() => {
    if (isUsingNewApi && props.sessions) {
      let filteredSessions = [...props.sessions];
      
      // Apply duration filter if set
      if (internalDurationFilter !== null) {
        filteredSessions = filteredSessions.filter(session => {
          const duration = session.duration;
          switch (internalDurationFilter) {
            case 5:
              return duration < 5;
            case 10:
              return duration >= 5 && duration < 10;
            case 15:
              return duration >= 10 && duration < 15;
            case 30:
              return duration >= 15 && duration <= 30;
            case 60:
              return duration > 30;
            default:
              return true;
          }
        });
      }
      
      props.onFilteredSessionsChange(filteredSessions);
    }
  }, [internalDurationFilter, isUsingNewApi, props]);

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
              onClick={() => durationFilter === duration.value 
                ? setDurationFilter(null) 
                : setDurationFilter(duration.value)}
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
