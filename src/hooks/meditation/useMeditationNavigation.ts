
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MeditationSession } from '@/types/meditation';
import { meditationSessions } from '@/data/meditationSessions';

export const useMeditationNavigation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get tab from URL or default to 'guided'
  const initialTab = searchParams.get('tab') || 'guided';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Sync activeTab with URL parameter on component mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    } else if (!tabParam && activeTab !== 'guided') {
      setSearchParams({ tab: activeTab });
    }
  }, [searchParams, activeTab, setSearchParams]);
  
  // Check for session ID in URL on component mount
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId) {
      const session = meditationSessions.find(s => s.id === sessionId);
      if (session) {
        handleSelectSession(session);
      }
    }
  }, [searchParams]);
  
  // Update URL when tab changes
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  }, [setSearchParams]);
  
  const handleSelectSession = useCallback((session: MeditationSession) => {
    setSelectedSession(session);
    setTimeout(() => {
      setDialogOpen(true);
    }, 0);
  }, []);

  const handleStartMeditation = useCallback((session: MeditationSession) => {
    setDialogOpen(false);
    // Scroll to top before navigation to ensure player is visible
    window.scrollTo({ top: 0, behavior: 'auto' });
    navigate(`/meditate/session/${session.id}`);
  }, [navigate]);

  return {
    activeTab,
    selectedSession,
    dialogOpen,
    setSelectedSession,
    setDialogOpen,
    handleTabChange,
    handleSelectSession,
    handleStartMeditation
  };
};
