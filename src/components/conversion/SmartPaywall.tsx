
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Crown, Star, Clock, Users, Award, TrendingUp } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useNavigate } from 'react-router-dom';

interface SmartPaywallProps {
  trigger: 'feature_limit' | 'session_limit' | 'premium_feature' | 'trial_end' | 'usage_milestone';
  featureName?: string;
  onClose: () => void;
  onUpgrade: (tier: string) => void;
  userUsage?: {
    current: number;
    limit: number;
  };
  socialProof?: string;
  urgency?: string;
}

export const SmartPaywall: React.FC<SmartPaywallProps> = ({
  trigger,
  featureName = 'Premium Features',
  onClose,
  onUpgrade,
  userUsage,
  socialProof,
  urgency
}) => {
  const { currentTier } = useFeatureAccess();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45 });
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('premium');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59 };
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getPaywallContent = () => {
    switch (trigger) {
      case 'feature_limit':
        return {
          title: `Unlock ${featureName}`,
          subtitle: 'You\'ve reached your free plan limit',
          urgency: urgency || 'Limited time: 50% off your first month!',
          icon: <Crown className="w-8 h-8 text-yellow-500" />
        };
      case 'session_limit':
        return {
          title: 'Continue Your Journey',
          subtitle: 'Weekly session limit reached',
          urgency: urgency || 'Upgrade now to continue without limits',
          icon: <TrendingUp className="w-8 h-8 text-blue-500" />
        };
      case 'premium_feature':
        return {
          title: `${featureName} - Premium Feature`,
          subtitle: 'Experience advanced capabilities',
          urgency: urgency || 'Join 10,000+ premium users',
          icon: <Star className="w-8 h-8 text-purple-500" />
        };
      case 'usage_milestone':
        return {
          title: 'You\'re Making Great Progress! 🎉',
          subtitle: 'Premium users achieve 3x better results',
          urgency: urgency || 'Celebrate with 50% off Premium',
          icon: <Award className="w-8 h-8 text-green-500" />
        };
      case 'trial_end':
        return {
          title: 'Your Trial is Ending Soon',
          subtitle: 'Continue your wellness journey',
          urgency: urgency || 'Trial ends in 2 days',
          icon: <Clock className="w-8 h-8 text-orange-500" />
        };
      default:
        return {
          title: 'Upgrade Your Experience',
          subtitle: 'Unlock premium features',
          urgency: urgency || 'Special offer available',
          icon: <Crown className="w-8 h-8 text-blue-500" />
        };
    }
  };

  const content = getPaywallContent();

  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      price: 11.99,
      originalPrice: 19.99,
      features: ['Unlimited Sessions', 'Advanced Analytics', 'Premium Content', '24/7 Support'],
      badge: 'Most Popular',
      color: 'blue'
    },
    {
      id: 'premium-pro',
      name: 'Premium Pro',
      price: 19.99,
      originalPrice: 29.99,
      features: ['Everything in Premium', 'Biofeedback Integration', 'Group Challenges', 'Sleep Stories'],
      badge: 'Best Value',
      color: 'purple'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              {content.icon}
            </div>
            
            <div>
              <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
              <p className="text-muted-foreground">{content.subtitle}</p>
            </div>

            {/* Urgency Banner */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 text-red-800">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{content.urgency}</span>
              </div>
              <div className="text-sm text-red-600 mt-1">
                Offer expires in {timeLeft.hours}h {timeLeft.minutes}m
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Usage Progress */}
          {userUsage && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Usage</span>
                <span>{userUsage.current} / {userUsage.limit}</span>
              </div>
              <Progress value={(userUsage.current / userUsage.limit) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                You've used {Math.round((userUsage.current / userUsage.limit) * 100)}% of your free limit
              </p>
            </div>
          )}

          {/* Social Proof */}
          {socialProof && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Join Successful Users</span>
              </div>
              <p className="text-sm text-green-700">{socialProof}</p>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
                <span className="ml-2 text-sm text-green-700">4.9/5 rating (2,847 reviews)</span>
              </div>
            </div>
          )}

          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-center">Choose Your Plan</h3>
            <div className="grid gap-4">
              {plans.map(plan => (
                <div 
                  key={plan.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? `border-${plan.color}-500 bg-${plan.color}-50` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        {plan.name}
                        {plan.badge && (
                          <Badge variant="default" className={`bg-${plan.color}-500 text-white`}>
                            {plan.badge}
                          </Badge>
                        )}
                      </h4>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${plan.price}/mo</div>
                      <div className="text-sm text-muted-foreground line-through">
                        ${plan.originalPrice}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Save {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Preview Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">What You'll Get</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide' : 'Show'} Features
              </Button>
            </div>

            {showPreview && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Meditation & Mindfulness</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• 500+ guided meditations</li>
                      <li>• Sleep stories & soundscapes</li>
                      <li>• Breathing exercises</li>
                      <li>• Daily mindfulness reminders</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Analytics & Progress</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Detailed progress tracking</li>
                      <li>• Personalized insights</li>
                      <li>• Goal setting & achievements</li>
                      <li>• Weekly wellness reports</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => onUpgrade(selectedPlan)}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
            >
              Start 7-Day Free Trial
            </Button>
            
            <div className="text-center text-xs text-muted-foreground">
              🔒 Secure payment • 💳 Cancel anytime • ✨ No commitment
            </div>
            
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full text-muted-foreground"
            >
              Maybe Later
            </Button>
          </div>

          {/* Scarcity Indicator */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <div className="text-orange-800 font-medium">Limited Time Offer</div>
            <div className="text-sm text-orange-600">
              Join {Math.floor(Math.random() * 50 + 450)} users who upgraded today
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
