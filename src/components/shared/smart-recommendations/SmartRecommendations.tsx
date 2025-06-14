
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { ContextualRecommendation } from '@/services/context-analysis/ContextAnalysisEngine';
import { crossModuleNavigation } from '@/services/CrossModuleNavigationService';
import { useNavigate } from 'react-router-dom';
import { useSmartRecommendations } from './useSmartRecommendations';
import { RecommendationCard } from './RecommendationCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';

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
  const navigate = useNavigate();
  const { recommendations, isLoading } = useSmartRecommendations({
    maxRecommendations,
    showOnlyHighPriority
  });

  useEffect(() => {
    crossModuleNavigation.setNavigate(navigate);
  }, [navigate]);

  const handleRecommendationClick = (recommendation: ContextualRecommendation) => {
    crossModuleNavigation.navigateWithContext(recommendation.route, {
      sourceModule: 'recommendations',
      recommendationReason: recommendation.title,
      userContext: { recommendationId: recommendation.id }
    });
  };

  if (isLoading) {
    return <LoadingState compact={compact} />;
  }

  if (recommendations.length === 0) {
    return <EmptyState compact={compact} />;
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
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onRecommendationClick={handleRecommendationClick}
              compact={compact}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
