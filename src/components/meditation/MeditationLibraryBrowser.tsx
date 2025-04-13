
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MeditationFilters from './MeditationFilters';
import FavoritesSection from './FavoritesSection';
import RecentlyPlayedSection from './RecentlyPlayedSection';
import MeditationTabContent from './MeditationTabContent';
import { MeditationSession } from './MeditationSessionCard';

interface MeditationLibraryBrowserProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  recentlyPlayed: MeditationSession[];
  getFavoriteSessions: () => MeditationSession[];
  handleSelectSession: (session: MeditationSession) => void;
  handleToggleFavorite: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
  filterSessionsByCategory: (category: 'guided' | 'quick' | 'deep' | 'sleep') => MeditationSession[];
  durationFilter: [number, number];
  setDurationFilter: (value: [number, number]) => void;
  levelFilter: string | null;
  setLevelFilter: (level: string | null) => void;
  resetFilters: () => void;
}

const MeditationLibraryBrowser: React.FC<MeditationLibraryBrowserProps> = ({
  activeTab,
  setActiveTab,
  recentlyPlayed,
  getFavoriteSessions,
  handleSelectSession,
  handleToggleFavorite,
  isFavorite,
  filterSessionsByCategory,
  durationFilter,
  setDurationFilter,
  levelFilter,
  setLevelFilter,
  resetFilters
}) => {
  return (
    <section className="py-8 px-4 md:py-12 md:px-6" id="meditation-tabs">
      <div className="max-w-6xl mx-auto">
        {recentlyPlayed.length > 0 && (
          <RecentlyPlayedSection 
            recentSessions={recentlyPlayed} 
            onSelectSession={handleSelectSession} 
          />
        )}
        
        <FavoritesSection 
          favorites={getFavoriteSessions()}
          onSelectSession={handleSelectSession}
          onToggleFavorite={handleToggleFavorite}
        />
        
        <Tabs 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-6 md:mb-8 text-xs md:text-sm">
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
          
          <TabsContent value="guided">
            <MeditationTabContent
              sessions={filterSessionsByCategory('guided')}
              onSelectSession={handleSelectSession}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              value="guided"
            />
          </TabsContent>
          
          <TabsContent value="quick">
            <MeditationTabContent
              sessions={filterSessionsByCategory('quick')}
              onSelectSession={handleSelectSession}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              value="quick"
            />
          </TabsContent>
          
          <TabsContent value="deep">
            <MeditationTabContent
              sessions={filterSessionsByCategory('deep')}
              onSelectSession={handleSelectSession}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              value="deep"
            />
          </TabsContent>
          
          <TabsContent value="sleep">
            <MeditationTabContent
              sessions={filterSessionsByCategory('sleep')}
              onSelectSession={handleSelectSession}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              value="sleep"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MeditationLibraryBrowser;
