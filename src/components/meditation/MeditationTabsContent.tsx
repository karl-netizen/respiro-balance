
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuidedMeditationList, QuickBreaksList, DeepFocusList, SleepMeditationList } from '@/components/meditation';
import { MeditationSession } from '@/types/meditation';

interface MeditationTabsContentProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  getFilteredSessions: (category: string) => MeditationSession[];
  onSelectSession: (session: MeditationSession) => void;
  onToggleFavorite: (session: MeditationSession) => void;
  isFavorite: (sessionId: string) => boolean;
}

const MeditationTabsContent: React.FC<MeditationTabsContentProps> = ({ 
  activeTab,
  handleTabChange,
  getFilteredSessions,
  onSelectSession,
  onToggleFavorite,
  isFavorite
}) => {
  return (
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
          onSelectSession={onSelectSession}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      </TabsContent>
      
      <TabsContent value="quick">
        <QuickBreaksList 
          sessions={getFilteredSessions("quick")}
          onSelectSession={onSelectSession}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      </TabsContent>
      
      <TabsContent value="deep">
        <DeepFocusList 
          sessions={getFilteredSessions("deep")}
          onSelectSession={onSelectSession}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      </TabsContent>
      
      <TabsContent value="sleep">
        <SleepMeditationList 
          sessions={getFilteredSessions("sleep")}
          onSelectSession={onSelectSession}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MeditationTabsContent;
