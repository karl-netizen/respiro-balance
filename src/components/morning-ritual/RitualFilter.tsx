import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Filter } from 'lucide-react';
import { RitualStatus } from '@/context/types';

export interface RitualFilters {
  status: 'all' | RitualStatus;
  priority: 'all' | 'low' | 'medium' | 'high';
  tags: string[];
  timeRange?: 'all' | { start: string; end: string };
}

interface RitualFilterProps {
  filters: RitualFilters;
  availableTags: string[];
  onFilterChange: (filters: RitualFilters) => void;
  onResetFilters: () => void;
}

const RitualFilter: React.FC<RitualFilterProps> = ({
  filters,
  availableTags,
  onFilterChange,
  onResetFilters
}) => {
  const handleStatusChange = (status: string) => {
    onFilterChange({
      ...filters,
      status: status as 'all' | RitualStatus
    });
  };

  const handlePriorityChange = (priority: string) => {
    onFilterChange({
      ...filters,
      priority: priority as 'all' | 'low' | 'medium' | 'high'
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFilterChange({
      ...filters,
      tags: newTags
    });
  };

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.priority !== 'all' || 
                          filters.tags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="skipped">Skipped</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Priority</label>
          <Select value={filters.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
                {filters.tags.includes(tag) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RitualFilter;
