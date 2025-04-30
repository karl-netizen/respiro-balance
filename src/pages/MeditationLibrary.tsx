
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MeditationLibraryBrowser } from '@/components/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { MeditationSession } from '@/types/meditation';

const MeditationLibrary = () => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteSessions, setFavoriteSessions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [durationFilter, setDurationFilter] = useState<number | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  
  const { isPremium } = useSubscriptionContext();
  
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

  // Mock data for sessions (should come from an API or context)
  const mockSessions: MeditationSession[] = [
    {
      id: "1",
      title: "Guided Morning Meditation",
      description: "Start your day with calm focus",
      duration: 10,
      level: "beginner",
      category: "guided",
      session_type: "guided",
      tags: [],
      instructor: "Sam Lee"
    },
    {
      id: "2",
      title: "Quick Focus Break",
      description: "Regain concentration quickly",
      duration: 5,
      level: "beginner",
      category: "quick",
      session_type: "quick",
      tags: [],
      instructor: "Alex Wang"
    }
  ];
  
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
      return sessions.filter(session => session.duration <= 5);
    } else if (duration === 10) {
      return sessions.filter(session => session.duration > 5 && session.duration <= 10);
    } else if (duration === 15) {
      return sessions.filter(session => session.duration > 10 && session.duration <= 15);
    } else if (duration === 30) {
      return sessions.filter(session => session.duration > 15 && session.duration <= 30);
    } else {
      return sessions.filter(session => session.duration > 30);
    }
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

  const resetFilters = () => {
    setDurationFilter(null);
    setLevelFilter(null);
  };

  const filterSessionsByCategory = (category: 'guided' | 'quick' | 'deep' | 'sleep'): MeditationSession[] => {
    return mockSessions.filter(session => session.category === category);
  };

  const getFavoriteSessions = () => {
    return mockSessions.filter(session => favoriteSessions.includes(session.id));
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
            recentlyPlayed={mockSessions.slice(0, 3)}
            getFavoriteSessions={getFavoriteSessions}
            handleSelectSession={handleSelectSession}
            handleToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            filterSessionsByCategory={filterSessionsByCategory}
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            resetFilters={resetFilters}
          />
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default MeditationLibrary;
