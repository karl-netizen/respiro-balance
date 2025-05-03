import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';

interface SessionFilterProps {
  sessions: MeditationSession[];
  onFilteredSessionsChange: (sessions: MeditationSession[]) => void;
}

const SessionFilter: React.FC<SessionFilterProps> = ({ 
  sessions, 
  onFilteredSessionsChange 
}) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  
  // Define duration ranges
  const durationRanges = [
    { label: '<5 min', min: 0, max: 5 },
    { label: '5-10 min', min: 5, max: 10 },
    { label: '10-15 min', min: 10, max: 15 },
    { label: '15-30 min', min: 15, max: 30 },
    { label: '30+ min', min: 30, max: Infinity },
  ];
  
  // Define levels and categories
  const levels = ['beginner', 'intermediate', 'advanced'];
  const categories = ['guided', 'quick', 'deep', 'sleep'];
  
  // Filter sessions based on current filter
  useEffect(() => {
    let filteredSessions = [...sessions];
    
    if (filterType && filterValue) {
      filteredSessions = sessions.filter(session => {
        if (filterType === 'duration') {
          const range = durationRanges.find(r => r.label === filterValue);
          if (!range) return true;
          
          if (range.label === '<5 min') {
            return session.duration < 5;
          } else if (range.label === '30+ min') {
            return session.duration > 30;
          } else {
            return session.duration >= range.min && session.duration < range.max;
          }
        } else if (filterType === 'level') {
          return session.level.toLowerCase() === filterValue.toLowerCase();
        } else if (filterType === 'category') {
          return session.category.toLowerCase() === filterValue.toLowerCase();
        }
        return true;
      });
    }
    
    onFilteredSessionsChange(filteredSessions);
  }, [sessions, filterType, filterValue, onFilteredSessionsChange]);
  
  // Handle filter selection
  const handleFilterSelect = (type: string, value: string) => {
    if (filterType === type && filterValue === value) {
      // If clicking the same filter, reset
      setFilterType(null);
      setFilterValue(null);
    } else {
      // Otherwise set the new filter
      setFilterType(type);
      setFilterValue(value);
    }
  };
  
  return (
    <div className="session-filter-container space-y-4">
      {/* Filter Type Tabs */}
      <Tabs 
        value={filterType || 'all'} 
        onValueChange={(value) => {
          if (value === 'all') {
            setFilterType(null);
            setFilterValue(null);
          } else {
            setFilterType(value);
            setFilterValue(null); // Reset the filter value when changing types
          }
        }}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="duration">Duration</TabsTrigger>
          <TabsTrigger value="level">Level</TabsTrigger>
          <TabsTrigger value="category">Category</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Filter Value Options */}
      <AnimatePresence mode="wait">
        {filterType && (
          <motion.div 
            className="filter-values"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filterType === 'duration' && (
              <div className="duration-filters flex flex-wrap gap-2">
                {durationRanges.map(range => (
                  <Button
                    key={range.label}
                    onClick={() => handleFilterSelect('duration', range.label)}
                    variant={filterValue === range.label ? "default" : "outline"}
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            )}
            
            {filterType === 'level' && (
              <div className="level-filters flex flex-wrap gap-2">
                {levels.map(level => (
                  <Button
                    key={level}
                    onClick={() => handleFilterSelect('level', level)}
                    variant={filterValue === level ? "default" : "outline"}
                    size="sm"
                    className="text-xs sm:text-sm capitalize"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            )}
            
            {filterType === 'category' && (
              <div className="category-filters flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => handleFilterSelect('category', category)}
                    variant={filterValue === category ? "default" : "outline"}
                    size="sm"
                    className="text-xs sm:text-sm capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Clear Filters Button */}
      {(filterType && filterValue) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Button 
            variant="outline"
            size="sm"
            className="text-muted-foreground flex items-center"
            onClick={() => {
              setFilterType(null);
              setFilterValue(null);
            }}
          >
            <X className="h-4 w-4 mr-1" /> Clear Filter
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default SessionFilter;
