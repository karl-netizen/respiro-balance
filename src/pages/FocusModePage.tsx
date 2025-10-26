import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FocusPageHeader } from '@/components/focus-mode/FocusPageHeader';
import { FocusOverviewCards } from '@/components/focus-mode/FocusOverviewCards';
import { FocusTabs } from '@/components/focus-mode/FocusTabs';
import { FocusSettingsDialog } from '@/components/focus-mode/FocusSettingsDialog';
import { useFocus } from '@/context/FocusProvider';

const FocusModePage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'timer';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { timerState, startSession, remaining, stats } = useFocus();
  
  // Update activeTab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  // Mock data for trend analysis
  const trendData = [
    { date: '2024-01-01', focusScore: 75, sessions: 3, distractions: 5, productivity: 80 },
    { date: '2024-01-02', focusScore: 82, sessions: 4, distractions: 3, productivity: 85 },
    { date: '2024-01-03', focusScore: 78, sessions: 2, distractions: 4, productivity: 75 },
    { date: '2024-01-04', focusScore: 88, sessions: 5, distractions: 2, productivity: 90 },
    { date: '2024-01-05', focusScore: 85, sessions: 3, distractions: 3, productivity: 88 },
  ];

  const insights = [
    {
      type: 'positive' as const,
      title: 'Peak Performance Window',
      description: 'Your focus scores are highest between 9-11 AM. Schedule important tasks during this time.',
    },
    {
      type: 'suggestion' as const,
      title: 'Reduce Afternoon Distractions',
      description: 'Consider using Focus Mode notifications or finding a quieter environment for afternoon sessions.',
      action: 'Enable Focus Mode'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <FocusPageHeader 
          focusScore={85}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        <FocusOverviewCards 
          todaysFocus="2h 45m"
          totalSessions={stats?.totalSessions || 6}
          currentStreak={stats?.currentStreak || 12}
          efficiency={87}
        />

        <FocusTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          timerState={timerState}
          remaining={remaining || 1500}
          onStartSession={startSession}
          trendData={trendData}
          insights={insights}
        />

        <FocusSettingsDialog 
          open={settingsOpen} 
          onOpenChange={setSettingsOpen} 
        />
      </div>
    </div>
  );
};

export default FocusModePage;
