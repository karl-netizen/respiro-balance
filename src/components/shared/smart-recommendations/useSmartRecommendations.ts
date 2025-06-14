
import { useState, useEffect } from 'react';
import { contextAnalysisEngine, ContextualRecommendation } from '@/services/context-analysis/ContextAnalysisEngine';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { useBiometricData } from '@/hooks/useBiometricData';

interface UseSmartRecommendationsProps {
  maxRecommendations?: number;
  showOnlyHighPriority?: boolean;
}

export const useSmartRecommendations = ({
  maxRecommendations = 3,
  showOnlyHighPriority = false
}: UseSmartRecommendationsProps = {}) => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { biometricData } = useBiometricData();
  const [recommendations, setRecommendations] = useState<ContextualRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const updateRecommendations = () => {
      setIsLoading(true);
      
      // Get recent sessions from storage or fetch them
      const sessions = JSON.parse(sessionStorage.getItem('recentSessions') || '[]');
      
      // Update context and generate recommendations
      contextAnalysisEngine.updateContext(preferences, biometricData, sessions);
      let recs = contextAnalysisEngine.generateRecommendations();
      
      // Filter by priority if requested
      if (showOnlyHighPriority) {
        recs = recs.filter(rec => rec.priority === 'high' || rec.priority === 'urgent');
      }
      
      // Limit number of recommendations
      recs = recs.slice(0, maxRecommendations);
      
      setRecommendations(recs);
      setIsLoading(false);
    };
    
    updateRecommendations();
    
    // Update recommendations every 2 minutes
    const interval = setInterval(updateRecommendations, 120000);
    
    return () => clearInterval(interval);
  }, [user, preferences, biometricData, maxRecommendations, showOnlyHighPriority]);

  return {
    recommendations,
    isLoading
  };
};
