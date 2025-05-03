
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  GuidedMeditationList, 
  QuickBreaksList, 
  DeepFocusList, 
  SleepMeditationList,
  MeditationSessionDialog,
  MeditationHeader,
  MeditationFilters
} from '@/components/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { MeditationSession } from '@/types/meditation';
import { meditationSessions } from '@/data/meditationSessions';
import { useMeditationFilters } from '@/hooks/useMeditationFilters';

const Meditate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteSessions, setFavoriteSessions] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>([]);
  const { isPremium } = useSubscriptionContext();
  
  // Get tab from URL or default to 'guided'
  const initialTab = searchParams.get('tab') || 'guided';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Use the meditation filters hook
  const { 
    durationFilter, 
    setDurationFilter, 
    levelFilter, 
    setLevelFilter, 
    filterSessionsByCategory,
    filterAllSessions,
    resetFilters 
  } = useMeditationFilters();
  
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
    
    const storedRecent = localStorage.getItem('recentlyPlayedSessions');
    if (storedRecent) {
      setRecentlyPlayed(JSON.parse(storedRecent));
    }
  }, []);
  
  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favoriteSessions', JSON.stringify(favoriteSessions));
  }, [favoriteSessions]);
  
  useEffect(() => {
    localStorage.setItem('recentlyPlayedSessions', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);
  
  const handleSelectSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };
  
  const handleToggleFavorite = (session: MeditationSession) => {
    if (favoriteSessions.includes(session.id)) {
      setFavoriteSessions(favoriteSessions.filter(id => id !== session.id));
      toast.info(`Removed "${session.title}" from favorites`);
    } else {
      setFavoriteSessions([...favoriteSessions, session.id]);
      toast.success(`Added "${session.title}" to favorites`);
    }
  };
  
  const isFavorite = (sessionId: string): boolean => {
    return favoriteSessions.includes(sessionId);
  };
  
  const addToRecentlyPlayed = (session: MeditationSession) => {
    setRecentlyPlayed(prev => {
      // Remove if already exists (to move it to the front)
      const filtered = prev.filter(id => id !== session.id);
      // Add to front and limit to 5
      return [session.id, ...filtered].slice(0, 5);
    });
  };

  const getFilteredSessions = (category: string): MeditationSession[] => {
    return filterSessionsByCategory(meditationSessions, category as 'guided' | 'quick' | 'deep' | 'sleep');
  };
  
  const getRecentSessions = (): MeditationSession[] => {
    return recentlyPlayed
      .map(id => meditationSessions.find(s => s.id === id))
      .filter(s => s !== undefined) as MeditationSession[];
  };
  
  const getFavoriteSessions = (): MeditationSession[] => {
    return meditationSessions.filter(s => favoriteSessions.includes(s.id));
  };

  const handleStartMeditation = (session: MeditationSession) => {
    // Check if session is premium and user doesn't have premium
    if (session.premium && !isPremium) {
      // Show premium upsell instead of starting session
      toast.error("This is a premium session", {
        description: "Upgrade your subscription to access premium content",
        action: {
          label: "Upgrade",
          onClick: () => window.location.href = '/subscription'
        }
      });
      return;
    }
    
    // Add to recently played
    addToRecentlyPlayed(session);
    
    // Direct to meditation session page
    window.location.href = `/meditate/session/${session.id}`;
  };
  
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
        
        {getRecentSessions().length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Recently Played</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getRecentSessions().map(session => (
                <div 
                  key={session.id}
                  className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectSession(session)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{session.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(session);
                      }}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {isFavorite(session.id) ? '★' : '☆'}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.duration} min • {session.instructor}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="guided">Guided</TabsTrigger>
            <TabsTrigger value="quick">Quick Breaks</TabsTrigger>
            <TabsTrigger value="deep">Deep Focus</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guided">
            <GuidedMeditationList 
              sessions={getFilteredSessions("guided")}
              onSelectSession={handleSelectSession}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
            />
          </TabsContent>
          
          <TabsContent value="quick">
            <QuickBreaksList 
              sessions={getFilteredSessions("quick")}
              onSelectSession={handleSelectSession}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
            />
          </TabsContent>
          
          <TabsContent value="deep">
            <DeepFocusList 
              sessions={getFilteredSessions("deep")}
              onSelectSession={handleSelectSession}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
            />
          </TabsContent>
          
          <TabsContent value="sleep">
            <SleepMeditationList 
              sessions={getFilteredSessions("sleep")}
              onSelectSession={handleSelectSession}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
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
