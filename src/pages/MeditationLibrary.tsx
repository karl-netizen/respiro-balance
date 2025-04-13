
import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  MeditationHeader,
  MeditationSessionView,
  MeditationLibraryBrowser,
  MeditationBenefits
} from "@/components/meditation";
import { MeditationSession as UIMeditationSession } from "@/components/meditation/MeditationSessionCard";
import { useMeditationLibrary } from "@/hooks/useMeditationLibrary";
import { useUserPreferences } from "@/context";
import { useBiometricData } from "@/hooks/useBiometricData";
import { toast } from "sonner";

// Create a type adapter function to convert between the two MeditationSession types
const adaptSessionType = (session: UIMeditationSession): UIMeditationSession => {
  return session;
};

const MeditationLibrary = () => {
  const { preferences } = useUserPreferences();
  const { biometricData, addBiometricData } = useBiometricData();
  const { 
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
  const handleToggleFavoriteSafe = (session: UIMeditationSession) => {
    handleToggleFavorite(session.id);
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
            handleToggleFavorite={isFavorite}
            isFavorite={isFavorite}
            showRatingDialog={showRatingDialog}
            setShowRatingDialog={setShowRatingDialog}
            handleSubmitRating={handleSubmitRating}
          />
        ) : (
          <MeditationLibraryBrowser 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            recentlyPlayed={recentlyPlayed}
            getFavoriteSessions={getFavoriteSessions}
            handleSelectSession={handleSelectSession}
            handleToggleFavorite={handleToggleFavoriteSafe}
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

export default MeditationLibrary;
