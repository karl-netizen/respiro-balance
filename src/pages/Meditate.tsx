
import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MeditationPlayer from "@/components/MeditationPlayer";
import { 
  MeditationSessionCard, 
  MeditationFilters, 
  RecentlyPlayedSection,
  SessionRatingDialog
} from "@/components/meditation";
import MeditationBenefits from "@/components/meditation/MeditationBenefits";
import { useMeditationLibrary } from "@/hooks/useMeditationLibrary";

const Meditate = () => {
  const { 
    selectedSession, 
    setSelectedSession, 
    handleSelectSession,
    filterSessionsByCategory,
    recentlyPlayed,
    handleToggleFavorite,
    getFavoriteSessions,
    isFavorite,
    showRatingDialog,
    setShowRatingDialog,
    handleSubmitRating,
    durationFilter,
    setDurationFilter,
    levelFilter,
    setLevelFilter,
    resetFilters
  } = useMeditationLibrary();
  
  const [activeTab, setActiveTab] = useState('guided');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-background to-secondary/20 pt-24 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Meditation Library</h1>
              <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
                Explore our diverse collection of guided meditations, quick breaks, and deep focus sessions
                designed to help you find balance in your busy day.
              </p>
            </div>
          </div>
        </section>
        
        {selectedSession ? (
          <section className="py-12 px-6" id="player">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedSession(null)}
                  className="mb-4"
                >
                  ← Back to Library
                </Button>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedSession.title}</h2>
                    <p className="text-foreground/70 mt-2">{selectedSession.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleToggleFavorite(selectedSession)}
                  >
                    {isFavorite(selectedSession.id) ? (
                      <span className="text-red-500">❤</span>
                    ) : (
                      <span>♡</span>
                    )}
                  </Button>
                </div>
              </div>
              
              <MeditationPlayer />
              
              {showRatingDialog && selectedSession && (
                <SessionRatingDialog
                  isOpen={showRatingDialog}
                  onClose={() => setShowRatingDialog(false)}
                  sessionId={selectedSession.id}
                  sessionTitle={selectedSession.title}
                  onSubmitRating={handleSubmitRating}
                />
              )}
            </div>
          </section>
        ) : (
          <section className="py-12 px-6" id="meditation-tabs">
            <div className="max-w-6xl mx-auto">
              {recentlyPlayed.length > 0 && (
                <RecentlyPlayedSection 
                  recentSessions={recentlyPlayed} 
                  onSelectSession={handleSelectSession} 
                />
              )}
              
              {getFavoriteSessions().length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Favorites</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFavoriteSessions().map((session) => (
                      <MeditationSessionCard 
                        key={session.id}
                        session={session}
                        onSelect={handleSelectSession}
                        isFavorite={true}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <Tabs 
                defaultValue="guided" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="guided">Guided Sessions</TabsTrigger>
                  <TabsTrigger value="quick">Quick Breaks</TabsTrigger>
                  <TabsTrigger value="deep">Deep Focus</TabsTrigger>
                  <TabsTrigger value="sleep">Sleep</TabsTrigger>
                </TabsList>
                
                <MeditationFilters
                  durationRange={durationFilter}
                  onDurationChange={setDurationFilter}
                  selectedLevel={levelFilter}
                  onLevelChange={setLevelFilter}
                  onResetFilters={resetFilters}
                />
                
                <TabsContent value="guided" className="mt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterSessionsByCategory('guided').map((session) => (
                      <MeditationSessionCard 
                        key={session.id}
                        session={session}
                        onSelect={handleSelectSession}
                        isFavorite={isFavorite(session.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="quick" className="mt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterSessionsByCategory('quick').map((session) => (
                      <MeditationSessionCard 
                        key={session.id}
                        session={session}
                        onSelect={handleSelectSession}
                        isFavorite={isFavorite(session.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="deep" className="mt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterSessionsByCategory('deep').map((session) => (
                      <MeditationSessionCard 
                        key={session.id}
                        session={session}
                        onSelect={handleSelectSession}
                        isFavorite={isFavorite(session.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="sleep" className="mt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterSessionsByCategory('sleep').map((session) => (
                      <MeditationSessionCard 
                        key={session.id}
                        session={session}
                        onSelect={handleSelectSession}
                        isFavorite={isFavorite(session.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}
        
        <MeditationBenefits />
      </main>
      
      <Footer />
    </div>
  );
};

export default Meditate;
