
import React, { useState, useCallback, useEffect } from 'react';
import { MeditationHeader, MeditationSessionDialog } from '@/components/meditation';
import RecentPlayedList from '@/components/meditation/RecentPlayedList';
import MeditationTabsContent from '@/components/meditation/MeditationTabsContent';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { useMeditatePage } from '@/hooks/useMeditatePage';
import { MeditationSession } from '@/types/meditation';
import { StateDebugger } from '@/components/dev';
import { MOCK_MEDITATION_SESSIONS } from '@/data/mockMeditationSessions';

const Meditate = () => {
  // const {
  //   activeTab,
  //   handleTabChange,
  //   selectedSession,
  //   dialogOpen,
  //   setDialogOpen,
  //   isFavorite,
  //   handleToggleFavorite,
  //   handleSelectSession,
  //   handleStartMeditation,
  //   getAllSessions,
  //   getFilteredSessions,
  //   getRecentSessions,
  //   isPremium
  // } = useMeditatePage();

  // MOCK DATA REPLACEMENTS
  const [activeTab, setActiveTab] = useState('guided');
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isPremium = true;

  const getAllSessions = () => MOCK_MEDITATION_SESSIONS as any;
  const getFilteredSessions = (category: string) => {
    const categoryMap: Record<string, string> = {
      'guided': 'Guided',
      'quick': 'Quick Breaks',
      'deep': 'Deep Focus',
      'sleep': 'Sleep'
    };
    return MOCK_MEDITATION_SESSIONS.filter(s => s.category === categoryMap[category]) as any;
  };
  const getRecentSessions = () => [];
  const handleTabChange = (tab: string) => setActiveTab(tab);
  const handleSelectSession = (session: any) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };
  const handleStartMeditation = () => console.log('Start meditation');
  const handleToggleFavorite = (session: any) => console.log('Toggle favorite', session);
  const isFavorite = (id: string) => false;

  // State to track filtered sessions
  const [filteredSessions, setFilteredSessions] = useState<MeditationSession[]>([]);
  
  // COMPREHENSIVE DEBUGGING SYSTEM
  useEffect(() => {
    const allSessions = getAllSessions();
    console.log(`🎯 MEDITATION DEBUG: Total sessions loaded: ${allSessions.length}`);
    
    if (allSessions.length > 0) {
      console.log(`🏷️ Categories in database:`, [...new Set(allSessions.map(s => s.category))]);
      console.log(`🔍 Testing category mapping:`);
      
      // Test all category mappings
      const categoryTests = ['guided', 'quick', 'deep', 'sleep'];
      categoryTests.forEach(category => {
        const filtered = getFilteredSessions(category);
        console.log(`  ${category}: ${filtered.length} sessions`);
      });
    }
  }, [getAllSessions, getFilteredSessions]);
  
  // Update filtered sessions when tab changes
  useEffect(() => {
    setFilteredSessions(getFilteredSessions(activeTab));
  }, [activeTab, getFilteredSessions]);
  
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
  const allSessionsForCurrentTab = getFilteredSessions(activeTab);
  
  // The sessions to display based on filters
  const displaySessions = filteredSessions.length > 0 
    ? filteredSessions 
    : allSessionsForCurrentTab;
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <MeditationHeader />
        
        {!isPremium && <SubscriptionBanner />}
        
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
