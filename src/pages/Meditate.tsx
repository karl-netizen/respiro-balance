import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MeditationHeader,
  MeditationSessionView,
  MeditationLibraryBrowser,
  MeditationBenefits
} from "@/components/meditation";
import { useMeditationLibrary } from "@/hooks/useMeditationLibrary";
import { useUserPreferences } from "@/context";
import { useBiometricData } from "@/hooks/useBiometricData";
import { toast } from "sonner";
import { debugAllSessionAudio, analyzeSessionAudio, logAudioMappingStatus } from "@/lib/meditationAudioIntegration";
import { MeditationSession } from "@/components/meditation/MeditationSessionCard";

const Meditate = () => {
  const { preferences } = useUserPreferences();
  const { biometricData, addBiometricData } = useBiometricData();
  const { 
    meditationSessions,
    selectedSession, 
    setSelectedSession, 
    handleSelectSession,
    filterSessionsByCategory,
    recentlyPlayed,
    handleToggleFavorite,
    getFavoriteSessions,
    isFavorite,
    showRatingDialog,
    setShowRatingDialog,
    handleSubmitRating,
    durationFilter,
    setDurationFilter,
    levelFilter,
    setLevelFilter,
    resetFilters
  } = useMeditationLibrary();
  
  const [activeTab, setActiveTab] = useState('guided');
  
  // Run audio diagnosis on first load
  useEffect(() => {
    if (meditationSessions && meditationSessions.length > 0) {
      // Output debug info to console
      debugAllSessionAudio(meditationSessions);
      
      // Log audio mapping status
      logAudioMappingStatus();
      
      // Analyze sessions
      const { withAudio, withoutAudio, summary } = analyzeSessionAudio(meditationSessions);
      
      console.log("Audio mapping summary:", summary);
      console.log("Sessions WITH audio:", withAudio.map(s => s.title));
      console.log("Sessions WITHOUT audio:", withoutAudio.map(s => s.title));
      
      // Show toast with results
      toast.info("Audio mapping analysis", {
        description: summary
      });
    }
  }, [meditationSessions]);

  // Handle tab change
  const handleTabChange = (tabValue: string) => {
    console.log("Tab changed to:", tabValue);
    setActiveTab(tabValue);
  };
  
  const handleSessionComplete = (sessionId: string) => {
    if (preferences.hasWearableDevice) {
      toast.success("Meditation complete", {
        description: "Your biometric data has been saved."
      });
    } else {
      toast.success("Meditation complete", {
        description: "Connect a wearable device to track biometrics."
      });
    }
    
    // Show rating dialog
    setShowRatingDialog(true);
  };
  
  // Fix the type signature for handleToggleFavorite
  const handleToggleFavoriteWrapper = (session: MeditationSession) => {
    handleToggleFavorite(session);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <MeditationHeader />
        
        {selectedSession ? (
          <MeditationSessionView 
            selectedSession={selectedSession}
            onBackToLibrary={() => setSelectedSession(null)}
            handleToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            showRatingDialog={showRatingDialog}
            setShowRatingDialog={setShowRatingDialog}
            handleSubmitRating={handleSubmitRating}
          />
        ) : (
          <MeditationLibraryBrowser 
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            recentlyPlayed={recentlyPlayed}
            getFavoriteSessions={getFavoriteSessions}
            handleSelectSession={handleSelectSession}
            handleToggleFavorite={handleToggleFavoriteWrapper}
            isFavorite={isFavorite}
            filterSessionsByCategory={filterSessionsByCategory}
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            resetFilters={resetFilters}
          />
        )}
        
        <MeditationBenefits />
      </main>
      
      <Footer />
    </div>
  );
};

export default Meditate;
