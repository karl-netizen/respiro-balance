
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MeditationHeader, MeditationSessionDialog, MeditationFilters } from '@/components/meditation';
import RecentPlayedList from '@/components/meditation/RecentPlayedList';
import MeditationTabsContent from '@/components/meditation/MeditationTabsContent';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { useMeditatePage } from '@/hooks/useMeditatePage';

const Meditate = () => {
  const {
    activeTab,
    handleTabChange,
    selectedSession,
    setSelectedSession,
    dialogOpen,
    setDialogOpen,
    durationFilter,
    setDurationFilter,
    levelFilter,
    setLevelFilter,
    resetFilters,
    isFavorite,
    handleToggleFavorite,
    handleSelectSession,
    handleStartMeditation,
    getFilteredSessions,
    getRecentSessions,
    isPremium
  } = useMeditatePage();

  const recentSessions = getRecentSessions();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <MeditationHeader />
        
        {!isPremium && <SubscriptionBanner />}
        
        <div className="mb-6 mt-6">
          <MeditationFilters
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            resetFilters={resetFilters}
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
          getFilteredSessions={getFilteredSessions}
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
