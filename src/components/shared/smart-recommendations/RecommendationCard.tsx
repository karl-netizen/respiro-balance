
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart } from 'lucide-react';
import { ContextualRecommendation } from '@/services/context-analysis/ContextAnalysisEngine';
import { RecommendationIcon } from './RecommendationIcon';

interface RecommendationCardProps {
  recommendation: ContextualRecommendation;
  onRecommendationClick: (recommendation: ContextualRecommendation) => void;
  compact?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onRecommendationClick,
  compact = false
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      className={`p-3 rounded-lg border ${getPriorityColor(recommendation.priority)} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => onRecommendationClick(recommendation)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <RecommendationIcon type={recommendation.type} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm">{recommendation.title}</h4>
            <div className="flex items-center gap-1">
              {recommendation.timeRelevant && (
                <Clock className="h-3 w-3 text-blue-500" />
              )}
              {recommendation.biometricTrigger && (
                <Heart className="h-3 w-3 text-red-500" />
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{recommendation.description}</p>
          
          {!compact && recommendation.reasons.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground mb-1">Why:</p>
              <ul className="text-xs space-y-0.5">
                {recommendation.reasons.slice(0, 2).map((reason, i) => (
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
              {recommendation.action}
            </Button>
            <Badge variant="outline" className="text-xs">
              {Math.round(recommendation.confidence * 100)}% match
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
