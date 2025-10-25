
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Users, Target, X } from 'lucide-react';

interface UpgradePromptProps {
  type: 'usage_based' | 'feature_discovery' | 'goal_achievement' | 'social_proof';
  userData?: {
    sessionsCompleted: number;
    daysActive: number;
    favoriteFeatures: string[];
    goals: string[];
  };
  onUpgrade: (tier: string) => void;
  onDismiss: () => void;
}

export const UpgradePrompts: React.FC<UpgradePromptProps> = ({
  type,
  userData,
  onUpgrade,
  onDismiss
}) => {
  const getPromptContent = () => {
    switch (type) {
      case 'usage_based':
        return {
          icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
          title: 'You\'re making great progress! 🌟',
          message: `${userData?.sessionsCompleted || 0} sessions in ${userData?.daysActive || 0} days! Explore what's next on your journey with advanced features when you're ready.`,
          cta: 'Explore Premium'
        };
      
      case 'feature_discovery':
        return {
          icon: <Sparkles className="w-6 h-6 text-purple-600" />,
          title: 'Personalized for You',
          message: 'Based on your meditation style, we think you might enjoy advanced breathing techniques and personalized coaching.',
          cta: 'Learn More'
        };
      
      case 'goal_achievement':
        return {
          icon: <Target className="w-6 h-6 text-green-600" />,
          title: 'Enhance Your Journey',
          message: 'Premium members enjoy advanced tracking and personalized coaching to support their wellness goals.',
          cta: 'See What\'s Included'
        };
      
      case 'social_proof':
        return {
          icon: <Users className="w-6 h-6 text-orange-600" />,
          title: 'Join 10,000+ Premium Users',
          message: '92% of our Premium users report better sleep and reduced stress within the first week.',
          cta: 'Join Premium Community'
        };
      
      default:
        return {
          icon: <Sparkles className="w-6 h-6 text-blue-600" />,
          title: 'Upgrade Your Experience',
          message: 'Unlock premium features designed for serious meditators.',
          cta: 'Go Premium'
        };
    }
  };

  const content = getPromptContent();

  return (
    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              {content.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {content.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {content.message}
              </p>
              
              {type === 'usage_based' && userData?.favoriteFeatures && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {userData.favoriteFeatures.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => onUpgrade('premium')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {content.cta}
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={onDismiss}
                  className="text-gray-500"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
          
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
