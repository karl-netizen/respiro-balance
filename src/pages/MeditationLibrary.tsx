
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


import { MeditationLibraryBrowser } from '@/components/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { MeditationSession } from '@/types/meditation';
import { useMeditationFilters } from '@/hooks/useMeditationFilters';
import { useMeditationFetch } from '@/hooks/meditation/useMeditationFetch';

const MeditationLibrary = () => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteSessions, setFavoriteSessions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  const { isPremium } = useSubscriptionContext();
  const { sessions: meditationSessions, isLoading } = useMeditationFetch();
  const { 
    durationFilter, 
    setDurationFilter,
    filterSessionsByCategory, 
    resetFilters 
  } = useMeditationFilters();
  
  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteSessions');
    if (storedFavorites) {
      setFavoriteSessions(JSON.parse(storedFavorites));
    }
  }, []);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favoriteSessions', JSON.stringify(favoriteSessions));
  }, [favoriteSessions]);
  
  const handleSelectSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };
  
  const handleToggleFavorite = (session: MeditationSession) => {
    if (favoriteSessions.includes(session.id)) {
      setFavoriteSessions(favoriteSessions.filter(id => id !== session.id));
    } else {
      setFavoriteSessions([...favoriteSessions, session.id]);
    }
  };
  
  const isFavorite = (sessionId: string): boolean => {
    return favoriteSessions.includes(sessionId);
  };
  
  const handleStartMeditation = (session: MeditationSession) => {
    // Check if session is premium and user doesn't have premium
    if (session.premium && !isPremium) {
      // Show premium upsell instead of starting session
      window.location.href = '/subscription';
      return;
    }
    
    // Direct to meditation session page
    window.location.href = `/meditate/session/${session.id}`;
  };

  const getFavoriteSessions = () => {
    return meditationSessions.filter(session => favoriteSessions.includes(session.id));
  };
  
  // Wrapper function to match the expected signature
  const filterByCategory = (category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    return filterSessionsByCategory(meditationSessions, category);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meditation Library</h1>
        </div>
        
        {!isPremium && <SubscriptionBanner />}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="recommended">For You</TabsTrigger>
          </TabsList>
          
          <MeditationLibraryBrowser
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            recentlyPlayed={meditationSessions.slice(0, 3)}
            getFavoriteSessions={getFavoriteSessions}
            handleSelectSession={handleSelectSession}
            handleToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            filterSessionsByCategory={filterByCategory}
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
            resetFilters={resetFilters}
          />
        </Tabs>
      </main>
      
      
    </div>
  );
};

export default MeditationLibrary;
