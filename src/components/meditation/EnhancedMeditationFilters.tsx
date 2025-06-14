
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, X, Filter, Clock, User, Tag } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterState {
  searchQuery: string;
  duration: string;
  instructor: string;
  tags: string[];
  level: string;
  category: string;
}

interface EnhancedMeditationFiltersProps {
  sessions: MeditationSession[];
  onFilteredSessionsChange: (sessions: MeditationSession[]) => void;
  onFiltersChange?: (filters: FilterState) => void;
}

const EnhancedMeditationFilters: React.FC<EnhancedMeditationFiltersProps> = ({
  sessions,
  onFilteredSessionsChange,
  onFiltersChange
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    duration: '',
    instructor: '',
    tags: [],
    level: '',
    category: ''
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Extract unique values for filter options
  const instructors = Array.from(new Set(sessions.map(s => s.instructor))).filter(Boolean);
  const allTags = Array.from(new Set(sessions.flatMap(s => s.tags || []))).filter(Boolean);
  const levels = Array.from(new Set(sessions.map(s => s.level))).filter(Boolean);
  const categories = Array.from(new Set(sessions.map(s => s.category))).filter(Boolean);

  // Duration ranges
  const durationRanges = [
    { value: 'under-5', label: 'Under 5 minutes', min: 0, max: 5 },
    { value: '5-10', label: '5-10 minutes', min: 5, max: 10 },
    { value: '10-15', label: '10-15 minutes', min: 10, max: 15 },
    { value: '15-30', label: '15-30 minutes', min: 15, max: 30 },
    { value: '30-plus', label: '30+ minutes', min: 30, max: Infinity }
  ];

  // Apply filters whenever they change
  useEffect(() => {
    let filteredSessions = [...sessions];

    // Text search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredSessions = filteredSessions.filter(session =>
        session.title.toLowerCase().includes(query) ||
        session.description.toLowerCase().includes(query) ||
        session.instructor.toLowerCase().includes(query) ||
        (session.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Duration filter
    if (filters.duration) {
      const range = durationRanges.find(r => r.value === filters.duration);
      if (range) {
        filteredSessions = filteredSessions.filter(session =>
          session.duration >= range.min && session.duration < range.max
        );
      }
    }

    // Instructor filter
    if (filters.instructor) {
      filteredSessions = filteredSessions.filter(session =>
        session.instructor === filters.instructor
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filteredSessions = filteredSessions.filter(session =>
        filters.tags.some(tag => (session.tags || []).includes(tag))
      );
    }

    // Level filter
    if (filters.level) {
      filteredSessions = filteredSessions.filter(session =>
        session.level === filters.level
      );
    }

    // Category filter
    if (filters.category) {
      filteredSessions = filteredSessions.filter(session =>
        session.category === filters.category
      );
    }

    onFilteredSessionsChange(filteredSessions);
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, sessions, onFilteredSessionsChange, onFiltersChange]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      duration: '',
      instructor: '',
      tags: [],
      level: '',
      category: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'tags') return count + (value as string[]).length;
    return count + (value ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search meditations, instructors, or tags..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={filters.duration} onValueChange={(value) => updateFilter('duration', value)}>
          <SelectTrigger className="w-auto">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Durations</SelectItem>
            {durationRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4 border-t"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Instructor
                </Label>
                <Select value={filters.instructor} onValueChange={(value) => updateFilter('instructor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Instructors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Instructors</SelectItem>
                    {instructors.map(instructor => (
                      <SelectItem key={instructor} value={instructor}>
                        {instructor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2">Level</Label>
                <Select value={filters.level} onValueChange={(value) => updateFilter('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={filters.tags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label htmlFor={tag} className="text-sm cursor-pointer">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {filters.searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.searchQuery}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('searchQuery', '')}
              />
            </Badge>
          )}
          {filters.duration && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {durationRanges.find(r => r.value === filters.duration)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('duration', '')}
              />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('category', '')}
              />
            </Badge>
          )}
          {filters.instructor && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.instructor}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('instructor', '')}
              />
            </Badge>
          )}
          {filters.level && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.level.charAt(0).toUpperCase() + filters.level.slice(1)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('level', '')}
              />
            </Badge>
          )}
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedMeditationFilters;
