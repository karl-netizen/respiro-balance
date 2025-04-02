
import React, { useEffect } from "react";
import EmptyRitualState from "./EmptyRitualState";
import RitualTimelineHeader from "./RitualTimelineHeader";
import RitualFilter from "./RitualFilter";
import RitualFilterEmptyState from "./RitualFilterEmptyState";
import RitualTimelineList from "./RitualTimelineList";
import { useRitualTimeline } from "./hooks/useRitualTimeline";
import { useAuth } from "@/hooks/useAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

const RitualTimeline = () => {
  const { user } = useAuth();
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
  
  // Save ritual data to Supabase when changes occur
  useEffect(() => {
    const saveRitualsToSupabase = async () => {
      if (!user || !isSupabaseConfigured() || rituals.length === 0) return;
      
      try {
        // Get the current user preferences
        const { data: prefsData } = await supabase
          .from('user_preferences')
          .select('id, preferences_data')
          .eq('user_id', user.id)
          .single();
          
        if (prefsData) {
          // Update preferences with latest rituals
          const updatedData = {
            ...prefsData.preferences_data,
            morningRituals: rituals
          };
          
          await supabase
            .from('user_preferences')
            .update({ 
              preferences_data: updatedData,
              updated_at: new Date().toISOString()
            })
            .eq('id', prefsData.id);
        }
      } catch (error) {
        console.error("Failed to save rituals to Supabase:", error);
      }
    };
    
    saveRitualsToSupabase();
  }, [rituals, user]);
  
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
