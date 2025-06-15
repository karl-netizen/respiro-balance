
import React from 'react';
import { Brain, TrendingUp, Clock, Zap, Heart, Users } from 'lucide-react';

interface RecommendationIconProps {
  type: string;
}

export const RecommendationIcon: React.FC<RecommendationIconProps> = ({ type }) => {
  const iconProps = { className: "h-4 w-4 text-respiro-dark" };
  
  switch (type) {
    case 'meditation': return <Brain {...iconProps} />;
    case 'breathing': return <Heart {...iconProps} />;
    case 'focus': return <Zap {...iconProps} />;
    case 'ritual': return <Clock {...iconProps} />;
    case 'social': return <Users {...iconProps} />;
    default: return <TrendingUp {...iconProps} />;
  }
};
