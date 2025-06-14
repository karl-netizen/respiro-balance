import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Clock, Zap, Heart, Users } from 'lucide-react';
import { contextAnalysisEngine, ContextualRecommendation } from '@/services/context-analysis/ContextAnalysisEngine';
import { crossModuleNavigation } from '@/services/CrossModuleNavigationService';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { useBiometricData } from '@/hooks/useBiometricData';
import { useNavigate } from 'react-router-dom';

interface SmartRecommendationsProps {
  maxRecommendations?: number;
  showOnlyHighPriority?: boolean;
  compact?: boolean;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  maxRecommendations = 3,
  showOnlyHighPriority = false,
  compact = false
}) => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { biometricData } = useBiometricData();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<ContextualRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    crossModuleNavigation.setNavigate(navigate);
  }, [navigate]);

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

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'meditation': return <Brain className="h-4 w-4" />;
      case 'breathing': return <Heart className="h-4 w-4" />;
      case 'focus': return <Zap className="h-4 w-4" />;
      case 'ritual': return <Clock className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRecommendationClick = (recommendation: ContextualRecommendation) => {
    crossModuleNavigation.navigateWithContext(recommendation.route, {
      sourceModule: 'recommendations',
      recommendationReason: recommendation.title,
      userContext: { recommendationId: recommendation.id }
    });
  };

  if (isLoading) {
    return (
      <Card className={compact ? "border-0 shadow-none" : ""}>
        <CardHeader className={compact ? "pb-2" : ""}>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-blue-500" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className={compact ? "border-0 shadow-none" : ""}>
        <CardHeader className={compact ? "pb-2" : ""}>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-blue-500" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Brain className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Keep using the app to get personalized recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      <CardHeader className={compact ? "pb-2" : ""}>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-500" />
          Smart Recommendations
          <Badge variant="outline" className="ml-auto text-xs">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div 
              key={rec.id}
              className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)} cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handleRecommendationClick(rec)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getRecommendationIcon(rec.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <div className="flex items-center gap-1">
                      {rec.timeRelevant && (
                        <Clock className="h-3 w-3 text-blue-500" />
                      )}
                      {rec.biometricTrigger && (
                        <Heart className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                  
                  {!compact && rec.reasons.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Why:</p>
                      <ul className="text-xs space-y-0.5">
                        {rec.reasons.slice(0, 2).map((reason, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-blue-500">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="outline" className="text-xs">
                      {rec.action}
                    </Button>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(rec.confidence * 100)}% match
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
