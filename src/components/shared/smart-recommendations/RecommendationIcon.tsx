
import React from 'react';
import { Brain, TrendingUp, Clock, Zap, Heart, Users } from 'lucide-react';

interface RecommendationIconProps {
  type: string;
}

export const RecommendationIcon: React.FC<RecommendationIconProps> = ({ type }) => {
  switch (type) {
    case 'meditation': return <Brain className="h-4 w-4" />;
    case 'breathing': return <Heart className="h-4 w-4" />;
    case 'focus': return <Zap className="h-4 w-4" />;
    case 'ritual': return <Clock className="h-4 w-4" />;
    case 'social': return <Users className="h-4 w-4" />;
    default: return <TrendingUp className="h-4 w-4" />;
  }
};
