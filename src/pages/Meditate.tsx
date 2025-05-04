
import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MeditationHeader, MeditationSessionDialog } from '@/components/meditation';
import RecentPlayedList from '@/components/meditation/RecentPlayedList';
import MeditationTabsContent from '@/components/meditation/MeditationTabsContent';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import SessionFilter from '@/components/meditation/SessionFilter';
import { useMeditatePage } from '@/hooks/useMeditatePage';
import { MeditationSession } from '@/types/meditation';
// Only import this in development
const StateDebugger = process.env.NODE_ENV !== 'production' 
  ? require('@/components/dev/StateDebugger').default 
  : () => null;

const Meditate = () => {
  const {
    activeTab,
    handleTabChange,
    selectedSession,
    dialogOpen,
    setDialogOpen,
    isFavorite,
    handleToggleFavorite,
    handleSelectSession,
    handleStartMeditation,
    getAllSessions,
    getFilteredSessions,
    getRecentSessions,
    isPremium
  } = useMeditatePage();

  // State to track filtered sessions
  const [filteredSessions, setFilteredSessions] = useState<MeditationSession[]>([]);
  
  // Memoize the current session's favorite status to avoid unnecessary re-renders
  const currentFavoriteStatus = useCallback(() => {
    return selectedSession ? isFavorite(selectedSession.id) : false;
  }, [selectedSession, isFavorite]);
  
  // Memoize the toggle function to ensure it references the correct session
  const handleCurrentSessionToggleFavorite = useCallback(() => {
    if (selectedSession) {
      handleToggleFavorite(selectedSession);
    }
  }, [selectedSession, handleToggleFavorite]);
  
  const recentSessions = getRecentSessions();
  const allSessions = getAllSessions();
  const allSessionsForCurrentTab = getFilteredSessions(activeTab);
  
  // The sessions to display based on filters
  const displaySessions = filteredSessions.length > 0 
    ? filteredSessions 
    : allSessionsForCurrentTab;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <MeditationHeader />
        
        {!isPremium && <SubscriptionBanner />}
        
        <div className="mb-6 mt-6">
          <SessionFilter 
            sessions={allSessions}
            onFilteredSessionsChange={setFilteredSessions}
          />
        </div>
        
        <RecentPlayedList
          recentSessions={recentSessions}
          onSelectSession={handleSelectSession}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
        
        <MeditationTabsContent
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          getFilteredSessions={() => displaySessions}
          onSelectSession={handleSelectSession}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
      </main>
      
      <MeditationSessionDialog 
        session={selectedSession} 
        open={dialogOpen}
        setOpen={setDialogOpen}
        onStart={handleStartMeditation}
        isFavorite={currentFavoriteStatus()}
        onToggleFavorite={handleCurrentSessionToggleFavorite}
      />
      
      <Footer />
      
      {process.env.NODE_ENV !== 'production' && (
        <StateDebugger
          data={{
            selectedSession,
            dialogOpen,
            activeTab,
            filteredSessions: filteredSessions.length,
            allSessionsForCurrentTab: allSessionsForCurrentTab.length,
            isFavorite: currentFavoriteStatus(),
          }}
          title="Meditation Page State"
          initialExpanded={false}
        />
      )}
    </div>
  );
};

export default Meditate;
