
import React from "react";
import { MorningRitual } from "@/context/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RitualAnalyticsDashboard from "../analytics/RitualAnalyticsDashboard";
import AdvancedCompletionFlow, { CompletionData } from "../completion/AdvancedCompletionFlow";
import { smartNotificationSystem } from "@/services/SmartNotificationSystem";
import { toast } from "sonner";

interface RitualTimelineModalsProps {
  showAnalytics: boolean;
  showNotificationSettings: boolean;
  selectedRitualForCompletion: MorningRitual | null;
  rituals: MorningRitual[];
  onCloseAnalytics: () => void;
  onCloseNotificationSettings: () => void;
  onCloseCompletion: () => void;
  onCompleteRitual: (ritualId: string) => void;
}

const RitualTimelineModals: React.FC<RitualTimelineModalsProps> = ({
  showAnalytics,
  showNotificationSettings,
  selectedRitualForCompletion,
  rituals,
  onCloseAnalytics,
  onCloseNotificationSettings,
  onCloseCompletion,
  onCompleteRitual
}) => {
  const handleCompletionData = (completionData: CompletionData) => {
    onCompleteRitual(completionData.ritualId);
    
    if (completionData.achievements && completionData.achievements.length > 0) {
      completionData.achievements.forEach(achievement => {
        toast.success(`🏆 ${achievement.title}`, {
          description: achievement.description,
        });
      });
    }
    
    onCloseCompletion();
  };

  const handleScheduleSmartReminders = async () => {
    await smartNotificationSystem.scheduleContextualReminders(rituals);
    toast.success("Smart notifications scheduled!", {
      description: "AI-powered reminders are now active",
    });
    onCloseNotificationSettings();
  };

  return (
    <>
      {/* Analytics Dashboard Modal */}
      <Dialog open={showAnalytics} onOpenChange={onCloseAnalytics}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ritual Analytics Dashboard</DialogTitle>
          </DialogHeader>
          <RitualAnalyticsDashboard rituals={rituals} />
        </DialogContent>
      </Dialog>

      {/* Notification Settings Modal */}
      <Dialog open={showNotificationSettings} onOpenChange={onCloseNotificationSettings}>
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
                onClick={onCloseNotificationSettings}
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
          onClose={onCloseCompletion}
          onComplete={handleCompletionData}
        />
      )}
    </>
  );
};

export default RitualTimelineModals;
