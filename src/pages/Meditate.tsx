
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MeditationPlayer from "@/components/MeditationPlayer";
import MeditationSessionCard from "@/components/meditation/MeditationSessionCard";
import MeditationBenefits from "@/components/meditation/MeditationBenefits";
import { useMeditationLibrary } from "@/hooks/useMeditationLibrary";

const Meditate = () => {
  const { 
    selectedSession, 
    setSelectedSession, 
    handleSelectSession,
    filterSessionsByCategory 
  } = useMeditationLibrary();
  
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
                <h2 className="text-2xl font-semibold">{selectedSession.title}</h2>
                <p className="text-foreground/70 mt-2">{selectedSession.description}</p>
              </div>
              
              <MeditationPlayer />
            </div>
          </section>
        ) : (
          <section className="py-12 px-6" id="meditation-tabs">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="guided" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="guided">Guided Sessions</TabsTrigger>
                  <TabsTrigger value="quick">Quick Breaks</TabsTrigger>
                  <TabsTrigger value="deep">Deep Focus</TabsTrigger>
                  <TabsTrigger value="sleep">Sleep</TabsTrigger>
                </TabsList>
                
                <TabsContent value="guided" className="mt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterSessionsByCategory('guided').map((session) => (
                      <MeditationSessionCard 
                        key={session.id}
                        session={session}
                        onSelect={handleSelectSession}
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
