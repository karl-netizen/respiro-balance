
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import RitualCreationWizard from "@/components/morning-ritual/RitualCreationWizard";
import { useUserPreferences } from "@/context";
import { useNotifications } from "@/context/NotificationsProvider";
import { useAdvancedScheduling } from "@/components/morning-ritual/hooks/useAdvancedScheduling";
import { updateRitualStatuses } from "@/components/morning-ritual/utils";
import MorningRitualHeader from "./morning-ritual/components/MorningRitualHeader";
import QuickStats from "./morning-ritual/components/QuickStats";
import ScheduleOptimizationCard from "./morning-ritual/components/ScheduleOptimizationCard";
import MorningRitualTabs from "./morning-ritual/components/MorningRitualTabs";
import MorningRitualTabsContent from "./morning-ritual/components/MorningRitualTabsContent";

const MorningRitual = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { addStreakAchievementNotification } = useNotifications();
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  
  const {
    dependencies,
    weatherAlternatives,
    scheduleOptimization,
    addDependency,
    removeDependency,
    addWeatherAlternative,
    removeWeatherAlternative,
    updateWeatherAlternative,
    analyzeSchedule,
    optimizeSchedule
  } = useAdvancedScheduling();

  const rituals = preferences.morningRituals || [];
  const hasRituals = rituals.length > 0;

  // Update ritual statuses on page load
  useEffect(() => {
    if (rituals.length > 0) {
      const updatedRituals = updateRitualStatuses(rituals);
      
      // Check for streaks to notify about
      updatedRituals.forEach(ritual => {
        const originalRitual = rituals.find(r => r.id === ritual.id);
        
        if (originalRitual && ritual.streak > (originalRitual.streak || 0)) {
          addStreakAchievementNotification(ritual);
        }
      });
      
      const statusesChanged = JSON.stringify(updatedRituals) !== JSON.stringify(rituals);
      if (statusesChanged) {
        updatePreferences({ morningRituals: updatedRituals });
      }
    }
  }, [rituals, updatePreferences, addStreakAchievementNotification]);

  // Analyze schedule when rituals change
  useEffect(() => {
    if (rituals.length > 0) {
      analyzeSchedule();
    }
  }, [rituals, analyzeSchedule]);

  const completedToday = rituals.filter(ritual => {
    if (ritual.lastCompleted) {
      const lastCompleted = new Date(ritual.lastCompleted);
      const today = new Date();
      return lastCompleted.toDateString() === today.toDateString();
    }
    return false;
  }).length;

  const handleOptimizeSchedule = () => {
    optimizeSchedule();
  };

  return (
    <>
      <MorningRitualHeader />
      
      <main className="min-h-screen">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <QuickStats 
            rituals={rituals}
            completedToday={completedToday}
            scheduleOptimization={scheduleOptimization}
          />

          <ScheduleOptimizationCard 
            scheduleOptimization={scheduleOptimization}
            onOptimize={handleOptimizeSchedule}
          />

          <MorningRitualTabs hasRituals={hasRituals}>
            <MorningRitualTabsContent
              hasRituals={hasRituals}
              rituals={rituals}
              completedToday={completedToday}
              onShowCreationWizard={() => setShowCreationWizard(true)}
              dependencies={dependencies}
              weatherAlternatives={weatherAlternatives}
              addDependency={addDependency}
              removeDependency={removeDependency}
              addWeatherAlternative={addWeatherAlternative}
              removeWeatherAlternative={removeWeatherAlternative}
              updateWeatherAlternative={updateWeatherAlternative}
            />
          </MorningRitualTabs>
        </div>

        <RitualCreationWizard
          isOpen={showCreationWizard}
          onClose={() => setShowCreationWizard(false)}
          onSave={(ritual) => {
            const updatedRituals = [...rituals, ritual];
            updatePreferences({ morningRituals: updatedRituals });
          }}
        />
      </main>
      <Footer />
    </>
  );
};

export default MorningRitual;
