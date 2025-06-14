
import React, { useState } from "react";
import EmptyRitualState from "./EmptyRitualState";
import RitualTimelineHeader from "./RitualTimelineHeader";
import RitualFilter from "./RitualFilter";
import RitualFilterEmptyState from "./RitualFilterEmptyState";
import RitualTimelineList from "./RitualTimelineList";
import DailyStatusDashboard from "./DailyStatusDashboard";
import WeeklyPerformanceSummary from "./WeeklyPerformanceSummary";
import RitualAnalyticsDashboard from "./analytics/RitualAnalyticsDashboard";
import AdvancedCompletionFlow, { CompletionData } from "./completion/AdvancedCompletionFlow";
import { useRitualTimeline } from "./hooks/useRitualTimeline";
import { smartNotificationSystem } from "@/services/SmartNotificationSystem";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MorningRitual } from "@/context/types";

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

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [selectedRitualForCompletion, setSelectedRitualForCompletion] = useState<MorningRitual | null>(null);
  
  // Initialize smart notifications when rituals change
  React.useEffect(() => {
    if (rituals.length > 0) {
      smartNotificationSystem.scheduleContextualReminders(rituals);
    }
    
    return () => {
      smartNotificationSystem.clearAllReminders();
    };
  }, [rituals]);
  
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
    
    if (window.confirm(`Mark ${pendingRituals.length} remaining ritual${pendingRituals.length !== 1 ? 's' : ''} as completed for today?`)) {
      pendingRituals.forEach(ritual => {
        completeRitual(ritual.id);
      });
      
      toast.success(`🎉 Completed ${pendingRituals.length} ritual${pendingRituals.length !== 1 ? 's' : ''}!`, {
        description: "Perfect day achieved! Keep up the amazing work!",
      });
    }
  };

  const handleAdvancedComplete = (ritual: MorningRitual) => {
    setSelectedRitualForCompletion(ritual);
  };

  const handleCompletionData = (completionData: CompletionData) => {
    completeRitual(completionData.ritualId);
    
    // Show achievement notifications
    if (completionData.achievements && completionData.achievements.length > 0) {
      completionData.achievements.forEach(achievement => {
        toast.success(`🏆 ${achievement.title}`, {
          description: achievement.description,
        });
      });
    }
    
    setSelectedRitualForCompletion(null);
  };

  const handleShowNotificationSettings = () => {
    setShowNotificationSettings(true);
  };

  const handleScheduleSmartReminders = async () => {
    await smartNotificationSystem.scheduleContextualReminders(rituals);
    toast.success("Smart notifications scheduled!", {
      description: "AI-powered reminders are now active",
    });
    setShowNotificationSettings(false);
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
        <RitualTimelineHeader 
          ritualCount={rituals.length}
          onShowAnalytics={() => setShowAnalytics(true)}
          onShowNotificationSettings={handleShowNotificationSettings}
        />
        
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
          <div className="absolute left-[23px] top-6 bottom-10 w-[3px] bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 z-0 rounded-full shadow-sm"></div>
          
          <RitualTimelineList 
            rituals={sortedRituals}
            onComplete={handleAdvancedComplete}
            onDelete={deleteRitual}
            onUpdate={updateRitual}
          />
        </div>
      )}

      {/* Analytics Dashboard Modal */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ritual Analytics Dashboard</DialogTitle>
          </DialogHeader>
          <RitualAnalyticsDashboard rituals={rituals} />
        </DialogContent>
      </Dialog>

      {/* Notification Settings Modal */}
      <Dialog open={showNotificationSettings} onOpenChange={setShowNotificationSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Smart Notification Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">AI-Powered Notifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Contextual Reminders</h5>
                  <p className="text-muted-foreground">Location, weather, and calendar-aware notifications</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Risk Detection</h5>
                  <p className="text-muted-foreground">Pattern analysis to predict potential skipping</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Adaptive Timing</h5>
                  <p className="text-muted-foreground">ML-based optimal reminder scheduling</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Streak Protection</h5>
                  <p className="text-muted-foreground">Emergency interventions and recovery protocols</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleScheduleSmartReminders}
                className="flex-1"
              >
                Enable Smart Notifications
              </Button>
              <Button 
                onClick={() => setShowNotificationSettings(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advanced Completion Flow */}
      {selectedRitualForCompletion && (
        <AdvancedCompletionFlow
          ritual={selectedRitualForCompletion}
          isOpen={!!selectedRitualForCompletion}
          onClose={() => setSelectedRitualForCompletion(null)}
          onComplete={handleCompletionData}
        />
      )}
    </div>
  );
};

export default RitualTimeline;
