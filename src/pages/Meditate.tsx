
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MeditationHeader, MeditationSessionDialog } from '@/components/meditation';
import RecentPlayedList from '@/components/meditation/RecentPlayedList';
import MeditationTabsContent from '@/components/meditation/MeditationTabsContent';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import SessionFilter from '@/components/meditation/SessionFilter';
import { useMeditatePage } from '@/hooks/useMeditatePage';
import { MeditationSession } from '@/types/meditation';

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
  
  // Track currently displayed session in dialog to ensure consistency
  const [currentDialogSession, setCurrentDialogSession] = useState<MeditationSession | null>(null);
  
  // Update currentDialogSession whenever selectedSession changes
  useEffect(() => {
    if (selectedSession) {
      setCurrentDialogSession(selectedSession);
    }
  }, [selectedSession]);
  
  // Enhanced session selection handler
  const enhancedHandleSelectSession = (session: MeditationSession) => {
    // Set the current dialog session immediately to ensure UI consistency
    setCurrentDialogSession(session);
    // Then call the original handler
    handleSelectSession(session);
  };
  
  const recentSessions = getRecentSessions();
  const allSessions = getAllSessions();
  const allSessionsForCurrentTab = getFilteredSessions(activeTab);
  
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
          onSelectSession={enhancedHandleSelectSession}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
        
        <MeditationTabsContent
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          getFilteredSessions={() => filteredSessions.length > 0 ? filteredSessions : allSessionsForCurrentTab}
          onSelectSession={enhancedHandleSelectSession}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
      </main>
      
      <MeditationSessionDialog 
        session={currentDialogSession} 
        open={dialogOpen}
        setOpen={setDialogOpen}
        onStart={handleStartMeditation}
        isFavorite={currentDialogSession ? isFavorite(currentDialogSession.id) : false}
        onToggleFavorite={() => currentDialogSession && handleToggleFavorite(currentDialogSession)}
      />
      
      <Footer />
    </div>
  );
};

export default Meditate;
