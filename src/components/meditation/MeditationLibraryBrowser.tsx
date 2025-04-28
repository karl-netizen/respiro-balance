
import React from 'react';
import { MeditationSession } from '@/types/meditation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MeditationFilters from './MeditationFilters';
import GuidedMeditationList from './GuidedMeditationList';
import QuickBreaksList from './QuickBreaksList';
import DeepFocusList from './DeepFocusList';
import SleepMeditationList from './SleepMeditationList';
import RecentlyPlayedSection from './RecentlyPlayedSection';
import FavoritesSection from './FavoritesSection';

export interface MeditationLibraryBrowserProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  recentlyPlayed: MeditationSession[];
  getFavoriteSessions: () => MeditationSession[];
  handleSelectSession: (session: MeditationSession) => void;
  handleToggleFavorite: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
  filterSessionsByCategory: (category: 'guided' | 'quick' | 'deep' | 'sleep') => MeditationSession[];
  durationFilter: number | null;
  setDurationFilter: (duration: number | null) => void;
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
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="p-4">
          <TabsTrigger value="guided">Guided</TabsTrigger>
          <TabsTrigger value="quick">Quick Breaks</TabsTrigger>
          <TabsTrigger value="deep">Deep Focus</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
        </TabsList>
        
        <Card className="border-none shadow-none">
          <MeditationFilters 
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            resetFilters={resetFilters}
          />
        </Card>
        
        <TabsContent value="guided" className="pt-0 border-none outline-none">
          <GuidedMeditationList 
            sessions={filterSessionsByCategory('guided')}
            onSelectSession={handleSelectSession}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        </TabsContent>
        
        <TabsContent value="quick" className="pt-0 border-none outline-none">
          <QuickBreaksList 
            sessions={filterSessionsByCategory('quick')}
            onSelectSession={handleSelectSession}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        </TabsContent>
        
        <TabsContent value="deep" className="pt-0 border-none outline-none">
          <DeepFocusList 
            sessions={filterSessionsByCategory('deep')}
            onSelectSession={handleSelectSession}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        </TabsContent>
        
        <TabsContent value="sleep" className="pt-0 border-none outline-none">
          <SleepMeditationList 
            sessions={filterSessionsByCategory('sleep')}
            onSelectSession={handleSelectSession}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        </TabsContent>
      </Tabs>
      
      <RecentlyPlayedSection 
        recentlyPlayed={recentlyPlayed}
        onSelectSession={handleSelectSession}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
      />
      
      <FavoritesSection 
        favoriteSessions={getFavoriteSessions()}
        onSelectSession={handleSelectSession}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
      />
    </Card>
  );
};

export default MeditationLibraryBrowser;
