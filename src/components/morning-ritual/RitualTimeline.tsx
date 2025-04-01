
import React from "react";
import EmptyRitualState from "./EmptyRitualState";
import RitualTimelineHeader from "./RitualTimelineHeader";
import RitualFilter from "./RitualFilter";
import RitualFilterEmptyState from "./RitualFilterEmptyState";
import RitualTimelineList from "./RitualTimelineList";
import { useRitualTimeline } from "./hooks/useRitualTimeline";

const RitualTimeline = () => {
  const {
    rituals,
    sortedRituals,
    filters,
    availableTags,
    completeRitual,
    deleteRitual,
    updateRitual,
    handleFilterChange,
    resetFilters
  } = useRitualTimeline();
  
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
        <RitualFilterEmptyState onResetFilters={resetFilters} />
      ) : (
        <RitualTimelineList 
          rituals={sortedRituals}
          onComplete={completeRitual}
          onDelete={deleteRitual}
          onUpdate={updateRitual}
        />
      )}
    </div>
  );
};

export default RitualTimeline;
