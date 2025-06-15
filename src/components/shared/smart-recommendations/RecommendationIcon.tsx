
import React from 'react';
import { Brain, TrendingUp, Clock, Zap, Heart, Users } from 'lucide-react';

interface RecommendationIconProps {
  type: string;
}

export const RecommendationIcon: React.FC<RecommendationIconProps> = ({ type }) => {
  const iconProps = { className: "h-4 w-4" };
  
  switch (type) {
    case 'meditation': return <Brain {...iconProps} className="h-4 w-4 text-blue-500" />;
    case 'breathing': return <Heart {...iconProps} className="h-4 w-4 text-red-500" />;
    case 'focus': return <Zap {...iconProps} className="h-4 w-4 text-green-500" />;
    case 'ritual': return <Clock {...iconProps} className="h-4 w-4 text-purple-500" />;
    case 'social': return <Users {...iconProps} className="h-4 w-4 text-respiro-dark" />;
    default: return <TrendingUp {...iconProps} className="h-4 w-4 text-respiro-dark" />;
  }
};
