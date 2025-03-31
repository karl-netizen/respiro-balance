
import React, { useState } from "react";
import { useUserPreferences } from "@/context";
import { MorningRitual, RitualStatus } from "@/context/types";
import RitualTimelineItem from "./RitualTimelineItem";
import EmptyRitualState from "./EmptyRitualState";
import RitualTimelineHeader from "./RitualTimelineHeader";
import RitualFilter, { RitualFilters } from "./RitualFilter";
import { filterRituals, getAllAvailableTags, defaultFilters } from "./filterUtils";
import { useToast } from "@/hooks/use-toast";

const RitualTimeline = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const rituals = preferences.morningRituals || [];
  const [filters, setFilters] = useState<RitualFilters>(defaultFilters);
  
  // Get all available tags from rituals
  const availableTags = getAllAvailableTags(rituals);
  
  // Apply filters to rituals
  const filteredRituals = filterRituals(rituals, filters);
  
  // Sort rituals by time of day
  const sortedRituals = [...filteredRituals].sort((a, b) => {
    const timeA = a.timeOfDay.split(':').map(Number);
    const timeB = b.timeOfDay.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });
  
  const completeRitual = (ritualId: string) => {
    const updatedRituals = rituals.map(ritual => {
      if (ritual.id === ritualId) {
        const wasCompleted = ritual.status === "completed";
        return { 
          ...ritual, 
          status: wasCompleted ? "planned" as RitualStatus : "completed" as RitualStatus,
          lastCompleted: wasCompleted ? undefined : new Date().toISOString(),
          streak: wasCompleted ? ritual.streak - 1 : ritual.streak + 1
        };
      }
      return ritual;
    });
    
    updatePreferences({ morningRituals: updatedRituals });
    toast({
      title: "Ritual updated",
      description: "Your morning ritual status has been updated",
    });
  };
  
  const deleteRitual = (ritualId: string) => {
    const updatedRituals = rituals.filter(ritual => ritual.id !== ritualId);
    updatePreferences({ morningRituals: updatedRituals });
    toast({
      title: "Ritual deleted",
      description: "Your morning ritual has been removed",
    });
  };
  
  const updateRitual = (updatedRitual: MorningRitual) => {
    const updatedRituals = rituals.map(ritual => 
      ritual.id === updatedRitual.id ? updatedRitual : ritual
    );
    
    updatePreferences({ morningRituals: updatedRituals });
  };
  
  const handleFilterChange = (newFilters: RitualFilters) => {
    setFilters(newFilters);
  };
  
  const resetFilters = () => {
    setFilters(defaultFilters);
  };
  
  if (rituals.length === 0) {
    return <EmptyRitualState />;
  }

  return (
    <div className="space-y-8">
      <RitualTimelineHeader ritualCount={rituals.length} />
      
      {/* Filter Component */}
      <RitualFilter 
        filters={filters}
        availableTags={availableTags}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
      />
      
      {sortedRituals.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No matching rituals</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters to see more rituals
          </p>
          <button 
            onClick={resetFilters}
            className="text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-6 bottom-10 w-[2px] bg-slate-200 z-0"></div>
          
          <div className="space-y-6 relative z-10">
            {sortedRituals.map((ritual) => (
              <RitualTimelineItem
                key={ritual.id}
                ritual={ritual}
                onComplete={completeRitual}
                onDelete={deleteRitual}
                onUpdate={updateRitual}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RitualTimeline;
