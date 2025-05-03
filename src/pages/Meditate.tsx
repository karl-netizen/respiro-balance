
import React, { useState } from 'react';
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
  
  const recentSessions = getRecentSessions();
  
  // Get all sessions, not just for the current tab
  const allSessions = getAllSessions();
  
  // Get all sessions for the current tab
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
          onSelectSession={handleSelectSession}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
        
        <MeditationTabsContent
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          getFilteredSessions={() => filteredSessions.length > 0 ? filteredSessions : allSessionsForCurrentTab}
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
        isFavorite={selectedSession ? isFavorite(selectedSession.id) : false}
        onToggleFavorite={() => selectedSession && handleToggleFavorite(selectedSession)}
      />
      
      <Footer />
    </div>
  );
};

export default Meditate;
