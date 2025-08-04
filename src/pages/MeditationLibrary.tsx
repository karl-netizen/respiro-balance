
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Plus } from 'lucide-react';

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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [userSessions, setUserSessions] = useState<MeditationSession[]>([]);
  
  const { isPremium } = useSubscriptionContext();
  const { sessions: meditationSessions, isLoading, error } = useMeditationFetch();
  
  // Debug: Check session structure
  useEffect(() => {
    if (meditationSessions && meditationSessions.length > 0) {
      console.log('Session structure:', meditationSessions[0]);
      console.log('Session keys:', Object.keys(meditationSessions[0]));
      
      // Check for audio-related fields
      const audioFields = Object.keys(meditationSessions[0]).filter(key => 
        key.toLowerCase().includes('audio') || 
        key.toLowerCase().includes('url') || 
        key.toLowerCase().includes('file')
      );
      console.log('Audio-related fields found:', audioFields);
    }
  }, [meditationSessions]);
  
  const { 
    durationFilter, 
    setDurationFilter,
    filterSessionsByCategory, 
    resetFilters 
  } = useMeditationFilters();
  
  // Combine user uploaded sessions with fetched sessions
  const allSessions = [...meditationSessions, ...userSessions];
  
  // Load favorites and user sessions from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteSessions');
    if (storedFavorites) {
      setFavoriteSessions(JSON.parse(storedFavorites));
    }
    
    const storedUserSessions = localStorage.getItem('userMeditationSessions');
    if (storedUserSessions) {
      setUserSessions(JSON.parse(storedUserSessions));
    }
  }, []);
  
  // Save to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favoriteSessions', JSON.stringify(favoriteSessions));
  }, [favoriteSessions]);
  
  useEffect(() => {
    localStorage.setItem('userMeditationSessions', JSON.stringify(userSessions));
  }, [userSessions]);
  
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
    if (session.premium && !isPremium) {
      window.location.href = '/subscription';
      return;
    }
    
    window.location.href = `/meditate/session/${session.id}`;
  };

  const getFavoriteSessions = () => {
    return allSessions.filter(session => favoriteSessions.includes(session.id));
  };
  
  const filterByCategory = (category: 'guided' | 'quick' | 'deep' | 'sleep') => {
    return filterSessionsByCategory(allSessions, category);
  };
  
  // Handle audio file upload
  const handleAudioUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const audioFile = formData.get('audioFile') as File;
    const title = formData.get('title') as string;
    const duration = parseInt(formData.get('duration') as string);
    const category = formData.get('category') as string;
    
    if (!audioFile || !title || !duration || !category) {
      alert('Please fill in all fields and select an audio file');
      return;
    }
    
    // Create object URL for the audio file
    const audioUrl = URL.createObjectURL(audioFile);
    
    const newSession: MeditationSession = {
      id: `user-${Date.now()}`,
      title,
      duration,
      category,
      audio_url: audioUrl,
      description: `User uploaded meditation - ${title}`,
      premium: false,
      session_type: category,
      level: 'beginner',
      instructor: 'User Upload',
      tags: [category],
      started_at: new Date().toISOString(),
      completed: false,
      favorite: false
    };
    
    setUserSessions(prev => [...prev, newSession]);
    setUploadDialogOpen(false);
    
    // Reset form
    (event.target as HTMLFormElement).reset();
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
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Audio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Audio File</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAudioUpload} className="space-y-4">
                <div>
                  <label htmlFor="audioFile" className="block text-sm font-medium mb-2">
                    Audio File
                  </label>
                  <Input
                    id="audioFile"
                    name="audioFile"
                    type="file"
                    accept="audio/*"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    placeholder="Enter meditation title"
                  />
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium mb-2">
                    Duration (minutes)
                  </label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    required
                    min="1"
                    placeholder="Enter duration in minutes"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select category</option>
                    <option value="mindfulness">Mindfulness</option>
                    <option value="stress relief">Stress Relief</option>
                    <option value="body scan">Body Scan</option>
                    <option value="sleep">Sleep</option>
                    <option value="energy">Energy</option>
                  </select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Upload
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setUploadDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
            recentlyPlayed={allSessions.slice(0, 3)}
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
        
        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="font-bold">Debug Info:</h3>
            <p>Total sessions: {allSessions.length}</p>
            <p>Fetched sessions: {meditationSessions.length}</p>
            <p>User sessions: {userSessions.length}</p>
            <p>Sessions with audio: {allSessions.filter(s => s.audio_url).length}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MeditationLibrary;
