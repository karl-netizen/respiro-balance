import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useMeditationLibrary } from '@/hooks/useMeditationLibrary';
import MeditationSessionCard, { MeditationSession } from '@/components/meditation/MeditationSessionCard';
import MeditationSessionDialog from '@/components/meditation/MeditationSessionDialog';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { useSubscriptionContext } from '@/context/SubscriptionProvider';

const adaptSessionForUI = (session: any): MeditationSession => {
  return {
    id: session.id,
    title: session.title || session.session_type || 'Unnamed Session',
    description: session.description || '',
    duration: session.duration || 5,
    category: session.category || 'guided',
    level: session.difficulty,
    audioUrl: session.audioUrl || session.audio_url,
    imageUrl: session.imageUrl || session.image_url,
    instructor: session.instructor,
    tags: session.tags || [],
    premium: session.premium || false
  };
};

const MeditationLibrary = () => {
  const {
    meditationSessions,
    selectedSession,
    setSelectedSession,
    handleSelectSession,
    filterSessionsByCategory,
    isFavorite,
    handleToggleFavorite,
    getFavoriteSessions,
    recentlyPlayed,
  } = useMeditationLibrary();
  
  const { hasExceededUsageLimit, isPremium, getFeatureAccess } = useSubscriptionContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSessions = (sessions: any[]) => {
    if (!searchQuery.trim()) return sessions.map(adaptSessionForUI);
    const query = searchQuery.toLowerCase();
    return sessions
      .filter(
        (session) =>
          (session.title || session.session_type || '').toLowerCase().includes(query) ||
          (session.category || '').toLowerCase().includes(query) ||
          (session.description || '').toLowerCase().includes(query)
      )
      .map(adaptSessionForUI);
  };
  
  const onSelectSession = (session: MeditationSession) => {
    handleSelectSession(session);
  };
  
  const onToggleFavorite = (session: MeditationSession) => {
    handleToggleFavorite(session);
  };
  
  const favoriteSessions = getFavoriteSessions().map(adaptSessionForUI);
  
  const adaptedSelectedSession = selectedSession ? adaptSessionForUI(selectedSession) : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meditation Library</h1>
            <p className="text-muted-foreground">
              Discover guided meditations to help you relax, focus, and sleep better
            </p>
          </div>
          
          <SubscriptionBanner />
          
          {hasExceededUsageLimit && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-destructive">
                You've reached your monthly meditation minutes limit. 
                <Button 
                  variant="link" 
                  className="text-destructive underline p-0 h-auto"
                  onClick={() => window.location.href = '/subscription'}
                >
                  Upgrade to Premium
                </Button> 
                for unlimited access.
              </p>
            </div>
          )}
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for meditation sessions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="quick">
            <TabsList className="mb-4">
              <TabsTrigger value="quick">Quick</TabsTrigger>
              <TabsTrigger value="guided">Guided</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="deep">Deep Focus</TabsTrigger>
              {isPremium && <TabsTrigger value="favorites">Favorites</TabsTrigger>}
              {isPremium && <TabsTrigger value="recent">Recent</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="quick" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSessions(filterSessionsByCategory('quick')).map((session) => (
                  <MeditationSessionCard
                    key={session.id}
                    session={session}
                    onSelect={onSelectSession}
                    isFavorite={isFavorite(session.id)}
                    onToggleFavorite={onToggleFavorite}
                    disabled={hasExceededUsageLimit && !isPremium}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="guided" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSessions(filterSessionsByCategory('guided')).map((session) => (
                  <MeditationSessionCard
                    key={session.id}
                    session={session}
                    onSelect={onSelectSession}
                    isFavorite={isFavorite(session.id)}
                    onToggleFavorite={onToggleFavorite}
                    disabled={hasExceededUsageLimit && !isPremium}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="sleep" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSessions(filterSessionsByCategory('sleep')).map((session) => {
                  const isPremiumSession = session.premium && !isPremium;
                  
                  return (
                    <MeditationSessionCard
                      key={session.id}
                      session={session}
                      onSelect={onSelectSession}
                      isFavorite={isFavorite(session.id)}
                      onToggleFavorite={onToggleFavorite}
                      isPremiumLocked={isPremiumSession}
                      disabled={hasExceededUsageLimit && !isPremium || isPremiumSession}
                    />
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="deep" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSessions(filterSessionsByCategory('deep')).map((session) => {
                  const isPremiumSession = (session.premium || session.duration > 15) && !isPremium;
                  
                  return (
                    <MeditationSessionCard
                      key={session.id}
                      session={session}
                      onSelect={onSelectSession}
                      isFavorite={isFavorite(session.id)}
                      onToggleFavorite={onToggleFavorite}
                      isPremiumLocked={isPremiumSession}
                      disabled={hasExceededUsageLimit && !isPremium || isPremiumSession}
                    />
                  );
                })}
              </div>
            </TabsContent>
            
            {isPremium && (
              <TabsContent value="favorites" className="space-y-4">
                {favoriteSessions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No favorites added yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSessions(favoriteSessions).map((session) => (
                      <MeditationSessionCard
                        key={session.id}
                        session={session}
                        onSelect={onSelectSession}
                        isFavorite={true}
                        onToggleFavorite={onToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
            
            {isPremium && (
              <TabsContent value="recent" className="space-y-4">
                {recentlyPlayed.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No recent sessions</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSessions(recentlyPlayed).map((session) => (
                      <MeditationSessionCard
                        key={session.id}
                        session={session}
                        onSelect={onSelectSession}
                        isFavorite={isFavorite(session.id)}
                        onToggleFavorite={onToggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      {adaptedSelectedSession && (
        <MeditationSessionDialog
          session={adaptedSelectedSession}
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          onStart={onSelectSession}
          disabled={hasExceededUsageLimit && !isPremium}
        />
      )}
    </div>
  );
};

export default MeditationLibrary;
