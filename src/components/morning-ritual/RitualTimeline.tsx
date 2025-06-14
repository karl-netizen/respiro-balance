
import React from "react";
import EmptyRitualState from "./EmptyRitualState";
import RitualTimelineHeader from "./RitualTimelineHeader";
import RitualFilter from "./RitualFilter";
import RitualFilterEmptyState from "./RitualFilterEmptyState";
import RitualTimelineList from "./RitualTimelineList";
import DailyStatusDashboard from "./DailyStatusDashboard";
import WeeklyPerformanceSummary from "./WeeklyPerformanceSummary";
import { useRitualTimeline } from "./hooks/useRitualTimeline";
import { toast } from "sonner";

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
    resetFilters,
    isLoading
  } = useRitualTimeline();
  
  const handleCompleteRemaining = () => {
    const pendingRituals = rituals.filter(ritual => 
      ritual.status !== 'completed' || 
      !ritual.lastCompleted || 
      new Date(ritual.lastCompleted).toDateString() !== new Date().toDateString()
    );
    
    if (pendingRituals.length === 0) {
      toast.success("All rituals already completed for today!");
      return;
    }
    
    // Show confirmation dialog for bulk completion
    if (window.confirm(`Mark ${pendingRituals.length} remaining rituals as completed?`)) {
      pendingRituals.forEach(ritual => {
        completeRitual(ritual.id);
      });
      toast.success(`Completed ${pendingRituals.length} rituals!`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="animate-pulse h-16 bg-slate-200 rounded mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-32 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (rituals.length === 0) {
    return <EmptyRitualState />;
  }

  return (
    <div className="space-y-8">
      {/* Daily Status Dashboard */}
      <DailyStatusDashboard 
        rituals={rituals}
        onCompleteRemaining={handleCompleteRemaining}
      />
      
      {/* Weekly Performance Summary */}
      <WeeklyPerformanceSummary rituals={rituals} />
      
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
