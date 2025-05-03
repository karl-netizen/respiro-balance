
import React, { useEffect, useState } from 'react';
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
  resetFilters
}) => {
  // Track filtered sessions for each category
  const [guidedSessions, setGuidedSessions] = useState<MeditationSession[]>([]);
  const [quickSessions, setQuickSessions] = useState<MeditationSession[]>([]);
  const [deepSessions, setDeepSessions] = useState<MeditationSession[]>([]);
  const [sleepSessions, setSleepSessions] = useState<MeditationSession[]>([]);
  
  // Update filtered sessions whenever filters change
  useEffect(() => {
    setGuidedSessions(filterSessionsByCategory('guided'));
    setQuickSessions(filterSessionsByCategory('quick'));
    setDeepSessions(filterSessionsByCategory('deep'));
    setSleepSessions(filterSessionsByCategory('sleep'));
  }, [durationFilter, filterSessionsByCategory]);
  
  return (
    <Card className="w-full">
      <MeditationFilters 
        durationFilter={durationFilter}
        setDurationFilter={setDurationFilter}
        resetFilters={resetFilters}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="p-4">
          <TabsTrigger value="guided">Guided</TabsTrigger>
          <TabsTrigger value="quick">Quick Breaks</TabsTrigger>
          <TabsTrigger value="deep">Deep Focus</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guided" className="pt-0 border-none outline-none p-4">
          <GuidedMeditationList 
            sessions={guidedSessions}
            onSelectSession={handleSelectSession}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        </TabsContent>
        
        <TabsContent value="quick" className="pt-0 border-none outline-none p-4">
          <QuickBreaksList 
            sessions={quickSessions}
            onSelectSession={handleSelectSession}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        </TabsContent>
        
        <TabsContent value="deep" className="pt-0 border-none outline-none p-4">
          <DeepFocusList 
            sessions={deepSessions}
            onSelectSession={handleSelectSession}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />
        </TabsContent>
        
        <TabsContent value="sleep" className="pt-0 border-none outline-none p-4">
          <SleepMeditationList 
            sessions={sleepSessions}
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
