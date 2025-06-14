
import React, { useState } from "react";
import { MorningRitual } from "@/context/types";
import { useRitualTimeline } from "../hooks/useRitualTimeline";
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

  return (
    <>
      <RitualTimelineContent
        rituals={rituals}
        sortedRituals={sortedRituals}
        filters={filters}
        availableTags={availableTags}
        isLoading={isLoading}
        onComplete={handleAdvancedComplete}
        onDelete={deleteRitual}
        onUpdate={updateRitual}
        onFilterChange={handleFilterChange}
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
        onCompleteRitual={completeRitual}
      />
    </>
  );
};

export default RitualTimelineContainer;
