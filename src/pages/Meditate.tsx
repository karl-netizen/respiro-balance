
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  GuidedMeditationList, 
  QuickBreaksList, 
  DeepFocusList, 
  SleepMeditationList,
  MeditationSessionDialog,
  MeditationHeader
} from '@/components/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { MeditationSession } from '@/types/meditation';

const Meditate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteSessions, setFavoriteSessions] = useState<string[]>([]);
  const { isPremium } = useSubscriptionContext();
  
  // Get tab from URL or default to 'guided'
  const initialTab = searchParams.get('tab') || 'guided';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };
  
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

  const filterByDuration = (sessions: MeditationSession[], duration: number): MeditationSession[] => {
    if (!duration) return sessions;
    if (duration === 5) {
      return sessions.filter(session => session.duration <= 5 * 60);
    } else if (duration === 10) {
      return sessions.filter(session => session.duration > 5 * 60 && session.duration <= 10 * 60);
    } else if (duration === 15) {
      return sessions.filter(session => session.duration > 10 * 60 && session.duration <= 15 * 60);
    } else if (duration === 30) {
      return sessions.filter(session => session.duration > 15 * 60 && session.duration <= 30 * 60);
    } else {
      return sessions.filter(session => session.duration > 30 * 60);
    }
  };
  
  const filterByLevel = (sessions: MeditationSession[], level: string): MeditationSession[] => {
    if (!level || level === 'all') return sessions;
    return sessions.filter(session => session.level === level);
  };
  
  const handleStartMeditation = (session: MeditationSession) => {
    // Check if session is premium and user doesn't have premium
    if (session.premium && !isPremium) {
      // Show premium upsell instead of starting session
      // Direct to subscription page
      window.location.href = '/subscription';
      return;
    }
    
    // Direct to meditation session page
    window.location.href = `/meditate/session/${session.id}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <MeditationHeader />
        
        {!isPremium && <SubscriptionBanner />}
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="guided">Guided</TabsTrigger>
            <TabsTrigger value="quick">Quick Breaks</TabsTrigger>
            <TabsTrigger value="deep">Deep Focus</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guided">
            <GuidedMeditationList 
              handleSelectSession={handleSelectSession}
              handleToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              isPremium={isPremium}
            />
          </TabsContent>
          
          <TabsContent value="quick">
            <QuickBreaksList 
              handleSelectSession={handleSelectSession}
              handleToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              isPremium={isPremium}
            />
          </TabsContent>
          
          <TabsContent value="deep">
            <DeepFocusList 
              handleSelectSession={handleSelectSession}
              handleToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              isPremium={isPremium}
            />
          </TabsContent>
          
          <TabsContent value="sleep">
            <SleepMeditationList 
              handleSelectSession={handleSelectSession}
              handleToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              isPremium={isPremium}
            />
          </TabsContent>
        </Tabs>
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
