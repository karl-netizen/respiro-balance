
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
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      toast.success("All rituals already completed for today! 🎉", {
        description: "You're absolutely crushing it!",
      });
      return;
    }
    
    // Show confirmation dialog for bulk completion
    if (window.confirm(`Mark ${pendingRituals.length} remaining ritual${pendingRituals.length !== 1 ? 's' : ''} as completed for today?`)) {
      pendingRituals.forEach(ritual => {
        completeRitual(ritual.id);
      });
      
      toast.success(`🎉 Completed ${pendingRituals.length} ritual${pendingRituals.length !== 1 ? 's' : ''}!`, {
        description: "Perfect day achieved! Keep up the amazing work!",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Enhanced loading state */}
        <div className="space-y-4">
          <div className="animate-pulse h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-3/4"></div>
          <div className="animate-pulse h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
        </div>
        
        <div className="animate-pulse h-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
        
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-40 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg"></div>
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
      {/* Enhanced Daily Status Dashboard */}
      <DailyStatusDashboard 
        rituals={rituals}
        onCompleteRemaining={handleCompleteRemaining}
      />
      
      <Separator className="my-8" />
      
      {/* Enhanced Weekly Performance Summary */}
      <WeeklyPerformanceSummary rituals={rituals} />
      
      <Separator className="my-8" />
      
      {/* Timeline Header with enhanced styling */}
      <div className="relative">
        <RitualTimelineHeader ritualCount={rituals.length} />
        
        {/* Enhanced Filter Component */}
        <Card className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200">
          <RitualFilter 
            filters={filters}
            availableTags={availableTags}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
          />
        </Card>
      </div>
      
      {/* Enhanced Timeline List */}
      {sortedRituals.length === 0 ? (
        <RitualFilterEmptyState onResetFilters={resetFilters} />
      ) : (
        <div className="relative">
          {/* Enhanced timeline connector line */}
          <div className="absolute left-[23px] top-6 bottom-10 w-[3px] bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 z-0 rounded-full shadow-sm"></div>
          
          <RitualTimelineList 
            rituals={sortedRituals}
            onComplete={completeRitual}
            onDelete={deleteRitual}
            onUpdate={updateRitual}
          />
        </div>
      )}
    </div>
  );
};

export default RitualTimeline;
