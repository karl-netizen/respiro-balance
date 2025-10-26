
import { useState } from "react";
import { MorningRitual } from "@/context/types";
import { useRitualTimeline } from "../hooks/useRitualTimeline";
import { RitualFilters } from "../RitualFilter";
import RitualTimelineContent from "./RitualTimelineContent";
import RitualTimelineModals from "./RitualTimelineModals";

const RitualTimelineContainer = () => {
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

  const handleAdvancedComplete = (ritual: MorningRitual) => {
    setSelectedRitualForCompletion(ritual);
  };

  const handleFilterChangeWrapper = (newFilters: RitualFilters) => {
    handleFilterChange(newFilters);
  };

  const handleDeleteRitual = (ritual: MorningRitual) => {
    deleteRitual(ritual);
  };

  const handleCompleteRitual = (ritualId: string) => {
    const ritual = rituals.find(r => r.id === ritualId);
    if (ritual) {
      completeRitual(ritual);
    }
  };

  return (
    <>
      <RitualTimelineContent
        rituals={rituals}
        sortedRituals={sortedRituals}
        filters={filters}
        availableTags={availableTags}
        isLoading={isLoading}
        onComplete={handleAdvancedComplete}
        onDelete={handleDeleteRitual}
        onUpdate={updateRitual}
        onFilterChange={handleFilterChangeWrapper}
        onResetFilters={resetFilters}
        onShowAnalytics={() => setShowAnalytics(true)}
        onShowNotificationSettings={() => setShowNotificationSettings(true)}
        completeRitual={completeRitual}
      />
      
      <RitualTimelineModals
        showAnalytics={showAnalytics}
        showNotificationSettings={showNotificationSettings}
        selectedRitualForCompletion={selectedRitualForCompletion}
        rituals={rituals}
        onCloseAnalytics={() => setShowAnalytics(false)}
        onCloseNotificationSettings={() => setShowNotificationSettings(false)}
        onCloseCompletion={() => setSelectedRitualForCompletion(null)}
        onCompleteRitual={handleCompleteRitual}
      />
    </>
  );
};

export default RitualTimelineContainer;
