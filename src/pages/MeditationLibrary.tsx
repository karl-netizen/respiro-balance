
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { MeditationLibraryBrowser } from '@/components/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { MeditationSession } from '@/types/meditation';
import { useMeditationFilters } from '@/hooks/useMeditationFilters';
// import { useMeditationFetch } from '@/hooks/meditation/useMeditationFetch'; // Temporarily commented out

// MOCK DATA FOR TESTING
const mockMeditationSessions: MeditationSession[] = [
  {
    id: '1',
    title: 'Morning Mindfulness',
    duration: 10,
    category: 'mindfulness',
    description: 'Start your day with calm awareness',
    premium: false,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    session_type: 'mindfulness',
    level: 'beginner',
    instructor: 'Test Instructor',
    tags: ['mindfulness'],
    started_at: new Date().toISOString(),
    completed: false,
    favorite: false
  },
  {
    id: '2',
    title: 'Quick Stress Relief',
    duration: 5,
    category: 'stress relief',
    description: 'Brief session to release tension',
    premium: false,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    session_type: 'stress relief',
    level: 'beginner',
    instructor: 'Test Instructor',
    tags: ['stress'],
    started_at: new Date().toISOString(),
    completed: false,
    favorite: false
  },
  {
    id: '3',
    title: 'Deep Body Scan',
    duration: 20,
    category: 'body scan',
    description: 'Comprehensive body awareness practice',
    premium: true,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    session_type: 'body scan',
    level: 'intermediate',
    instructor: 'Test Instructor',
    tags: ['body scan'],
    started_at: new Date().toISOString(),
    completed: false,
    favorite: false
  },
  {
    id: '4',
    title: 'Sleep Preparation',
    duration: 15,
    category: 'sleep',
    description: 'Wind down for peaceful rest',
    premium: false,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    session_type: 'sleep',
    level: 'beginner',
    instructor: 'Test Instructor',
    tags: ['sleep'],
    started_at: new Date().toISOString(),
    completed: false,
    favorite: false
  },
  {
    id: '5',
    title: 'Energy Boost',
    duration: 8,
    category: 'energy',
    description: 'Revitalize your mind and body',
    premium: true,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    session_type: 'energy',
    level: 'beginner',
    instructor: 'Test Instructor',
    tags: ['energy'],
    started_at: new Date().toISOString(),
    completed: false,
    favorite: false
  },
  {
    id: '6',
    title: 'Breathing Exercise',
    duration: 6,
    category: 'mindfulness',
    description: 'Simple breathing meditation',
    premium: false,
    audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    session_type: 'mindfulness',
    level: 'beginner',
    instructor: 'Test Instructor',
    tags: ['breathing'],
    started_at: new Date().toISOString(),
    completed: false,
    favorite: false
  }
];

const MeditationLibrary = () => {
  // ADD THESE LINES RIGHT AT THE TOP:
  console.log('🔥 MeditationLibrary component is rendering!');
  
  // Test with hardcoded data first
  const testSessions = [
    { id: '1', title: 'Test Session', duration: 10, category: 'mindfulness', description: 'Test description', premium: false, audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', session_type: 'mindfulness', level: 'beginner', instructor: 'Test', tags: ['test'], started_at: new Date().toISOString(), completed: false, favorite: false }
  ];
  console.log('🔥 Test sessions created:', testSessions);

  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [favoriteSessions, setFavoriteSessions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  const { isPremium } = useSubscriptionContext();
  
  // COMMENT OUT THE REAL FETCH AND USE TEST DATA:
  // const { sessions: meditationSessions, isLoading, error } = useMeditationFetch();
  
  // REPLACE WITH THIS:
  const meditationSessions = testSessions;
  const isLoading = false;
  const error = null;
  
  console.log('🔥 Final meditationSessions to be used:', meditationSessions);
  console.log('🔥 Session count:', meditationSessions.length);
  
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
    console.log('🎯 Session selected:', session);
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
    console.log('🚀 Starting meditation:', session);
    
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
    const favorites = meditationSessions.filter(session => favoriteSessions.includes(session.id));
    console.log('💖 Favorite sessions:', favorites.length);
    return favorites;
  };
  
  // Wrapper function to match the expected signature with proper category mapping
  const filterByCategory = (category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    let filtered: MeditationSession[] = [];
    
    switch (category) {
      case 'guided':
        // Include mindfulness, body scan sessions
        filtered = meditationSessions.filter(s => 
          ['mindfulness', 'body scan'].includes(s.category.toLowerCase())
        );
        break;
      case 'quick':
        // Include short sessions (under 10 minutes) or stress relief
        filtered = meditationSessions.filter(s => 
          s.duration <= 10 || s.category.toLowerCase() === 'stress relief'
        );
        break;
      case 'deep':
        // Include longer mindfulness sessions or stress relief
        filtered = meditationSessions.filter(s => 
          (s.category.toLowerCase() === 'mindfulness' && s.duration > 10) ||
          s.category.toLowerCase() === 'stress relief'
        );
        break;
      case 'sleep':
        // Include sleep category sessions
        filtered = meditationSessions.filter(s => 
          s.category.toLowerCase() === 'sleep'
        );
        break;
      default:
        filtered = meditationSessions;
    }
    
    console.log(`🏷️ Filtered by ${category}:`, filtered.length, filtered.map(s => s.title));
    return filtered;
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
          <div className="text-sm text-gray-600">
            📊 {meditationSessions.length} sessions loaded
          </div>
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
        
        {/* Debug info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-800">🔧 Debug Info (Remove in production)</h3>
          <p className="text-blue-700">Mock sessions loaded: {meditationSessions.length}</p>
          <p className="text-blue-700">Favorites: {favoriteSessions.length}</p>
          <p className="text-blue-700">Active tab: {activeTab}</p>
          <p className="text-blue-700">Premium user: {isPremium ? 'Yes' : 'No'}</p>
        </div>
      </main>
    </div>
  );
};

export default MeditationLibrary;
