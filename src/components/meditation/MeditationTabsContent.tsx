
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuidedMeditationList, QuickBreaksList, DeepFocusList, SleepMeditationList } from '@/components/meditation';
import { MeditationSession } from '@/types/meditation';

interface MeditationTabsContentProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  getFilteredSessions: () => MeditationSession[];
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
  // Track filtered sessions state
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  
  // Update filtered sessions whenever the tab changes or filters change
  useEffect(() => {
    const allSessions = getFilteredSessions();
    console.log('📋 MeditationTabsContent - all sessions:', allSessions.length);
    setSessions(allSessions);
  }, [getFilteredSessions, activeTab]);

  // Filter sessions based on category
  const filterByCategory = (tab: string) => {
    console.log(`🔍 Filtering for tab: ${tab}, total sessions: ${sessions.length}`);
    
    if (tab === 'guided') {
      const filtered = sessions.filter(session => 
        ['Mindfulness', 'Guided', 'guided', 'Breathing', 'Focus'].includes(session.category)
      );
      console.log(`🎯 Guided sessions found: ${filtered.length}`);
      return filtered;
    } else if (tab === 'quick') {
      const filtered = sessions.filter(session => 
        ['Stress Relief', 'Energy', 'quick'].includes(session.category)
      );
      console.log(`⚡ Quick sessions found: ${filtered.length}`);
      return filtered;
    } else if (tab === 'deep') {
      const filtered = sessions.filter(session => 
        ['Focus', 'Deep Focus', 'deep'].includes(session.category)
      );
      console.log(`🧘 Deep sessions found: ${filtered.length}`);
      return filtered;
    } else if (tab === 'sleep') {
      const filtered = sessions.filter(session => 
        ['Sleep', 'sleep'].includes(session.category)
      );
      console.log(`🌙 Sleep sessions found: ${filtered.length}`);
      return filtered;
    }
    console.log(`📋 All sessions returned: ${sessions.length}`);
    return sessions;
  };
  
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
          sessions={filterByCategory('guided')}
          onSelectSession={onSelectSession}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      </TabsContent>
      
      <TabsContent value="quick">
        <QuickBreaksList 
          sessions={filterByCategory('quick')}
          onSelectSession={onSelectSession}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      </TabsContent>
      
      <TabsContent value="deep">
        <DeepFocusList 
          sessions={filterByCategory('deep')}
          onSelectSession={onSelectSession}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      </TabsContent>
      
      <TabsContent value="sleep">
        <SleepMeditationList 
          sessions={filterByCategory('sleep')}
          onSelectSession={onSelectSession}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MeditationTabsContent;
