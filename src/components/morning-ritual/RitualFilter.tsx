
import React from "react";
import { Filter, Clock, Tag, CheckCircle } from "lucide-react";
import { RitualStatus } from "@/context/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface RitualFilters {
  status: RitualStatus | "all";
  timeRange: {
    start: string;
    end: string;
  } | null;
  tags: string[];
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
  // Function to update status filter
  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value as RitualStatus | "all"
    });
  };

  // Function to update time range filter
  const handleTimeRangeChange = (startOrEnd: "start" | "end", value: string) => {
    onFilterChange({
      ...filters,
      timeRange: {
        ...filters.timeRange || { start: "00:00", end: "23:59" },
        [startOrEnd]: value
      }
    });
  };

  // Function to toggle a tag in the filter
  const handleTagToggle = (tag: string) => {
    const updatedTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFilterChange({
      ...filters,
      tags: updatedTags
    });
  };

  // Calculate how many filters are active
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.timeRange) count++;
    if (filters.tags.length > 0) count++;
    return count;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex gap-2 flex-wrap">
        {/* Status Filter */}
        <Select 
          value={filters.status} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>

        {/* Time Range Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start">
              <Clock className="mr-2 h-4 w-4" />
              Time Range
              {filters.timeRange && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filters.timeRange.start}-{filters.timeRange.end}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Time</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="space-y-2">
                <Label htmlFor="start-time">From</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={filters.timeRange?.start || "00:00"}
                  onChange={(e) => handleTimeRangeChange("start", e.target.value)}
                />
              </div>
              <div className="space-y-2 mt-2">
                <Label htmlFor="end-time">To</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={filters.timeRange?.end || "23:59"}
                  onChange={(e) => handleTimeRangeChange("end", e.target.value)}
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => onFilterChange({...filters, timeRange: null})}
              >
                Clear Time Filter
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tags Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start">
              <Tag className="mr-2 h-4 w-4" />
              Tags
              {filters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {availableTags.length > 0 ? (
                availableTags.map(tag => (
                  <DropdownMenuItem 
                    key={tag} 
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <div className={cn(
                      "flex items-center w-full",
                      filters.tags.includes(tag) ? "font-medium" : ""
                    )}>
                      <div className={cn(
                        "h-3 w-3 rounded-full mr-2",
                        filters.tags.includes(tag) ? "bg-primary" : "bg-secondary"
                      )} />
                      {tag}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-2 py-1 text-sm text-muted-foreground">No tags available</div>
              )}
            </DropdownMenuGroup>
            {filters.tags.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onFilterChange({...filters, tags: []})}
                >
                  Clear Tag Filters
                </Button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Reset All Filters Button */}
      {getActiveFilterCount() > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onResetFilters}
          className="text-muted-foreground"
        >
          <Filter className="mr-2 h-4 w-4" />
          Reset Filters
          <Badge variant="secondary" className="ml-2">
            {getActiveFilterCount()}
          </Badge>
        </Button>
      )}
    </div>
  );
};

export default RitualFilter;
