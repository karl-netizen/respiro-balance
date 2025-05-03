
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
  MeditationHeader
} from '@/components/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { MeditationSession } from '@/types/meditation';
import { meditationSessions } from '@/data/meditationSessions';

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
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  
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

  const filterByDuration = (sessions: MeditationSession[]): MeditationSession[] => {
    if (!durationFilter) return sessions;
    
    if (durationFilter === 5) {
      return sessions.filter(session => session.duration <= 5);
    } else if (durationFilter === 10) {
      return sessions.filter(session => session.duration > 5 && session.duration <= 10);
    } else if (durationFilter === 15) {
      return sessions.filter(session => session.duration > 10 && session.duration <= 15);
    } else if (durationFilter === 30) {
      return sessions.filter(session => session.duration > 15 && session.duration <= 30);
    } else {
      return sessions.filter(session => session.duration > 30);
    }
  };
  
  const filterByLevel = (sessions: MeditationSession[]): MeditationSession[] => {
    if (!levelFilter) return sessions;
    return sessions.filter(session => session.level === levelFilter);
  };
  
  const resetFilters = () => {
    setDurationFilter(null);
    setLevelFilter(null);
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

  const getFilteredSessions = (category: string): MeditationSession[] => {
    let filteredSessions = meditationSessions.filter(s => s.category === category);
    filteredSessions = filterByDuration(filteredSessions);
    filteredSessions = filterByLevel(filteredSessions);
    return filteredSessions;
  };
  
  const getRecentSessions = (): MeditationSession[] => {
    return recentlyPlayed
      .map(id => meditationSessions.find(s => s.id === id))
      .filter(s => s !== undefined) as MeditationSession[];
  };
  
  const getFavoriteSessions = (): MeditationSession[] => {
    return meditationSessions.filter(s => favoriteSessions.includes(s.id));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <MeditationHeader />
        
        {!isPremium && <SubscriptionBanner />}
        
        <div className="mb-6 mt-6">
          <div className="flex flex-wrap gap-4">
            {/* Duration filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Duration</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 5, label: "≤ 5 min" },
                  { value: 10, label: "5-10 min" },
                  { value: 15, label: "10-15 min" },
                  { value: 30, label: "15-30 min" },
                  { value: 60, label: "> 30 min" }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setDurationFilter(durationFilter === option.value ? null : option.value)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      durationFilter === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-input hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Level filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Level</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setLevelFilter(levelFilter === option.value ? null : option.value)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      levelFilter === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-input hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Reset filters */}
            {(durationFilter || levelFilter) && (
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground self-end"
              >
                Reset filters
              </button>
            )}
          </div>
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
