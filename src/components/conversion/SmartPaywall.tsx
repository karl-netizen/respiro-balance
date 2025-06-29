
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, Crown, Star, Clock, Users, Award } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useNavigate } from 'react-router-dom';

interface SmartPaywallProps {
  trigger: 'feature_limit' | 'session_limit' | 'premium_feature' | 'trial_end';
  featureName: string;
  onClose: () => void;
  onUpgrade: (tier: string) => void;
  userUsage?: {
    current: number;
    limit: number;
  };
}

export const SmartPaywall: React.FC<SmartPaywallProps> = ({
  trigger,
  featureName,
  onClose,
  onUpgrade,
  userUsage
}) => {
  const { currentTier } = useFeatureAccess();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45 });
  const [showPreview, setShowPreview] = useState(false);

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
          urgency: 'Limited time: 50% off your first month!'
        };
      case 'session_limit':
        return {
          title: 'Continue Your Journey',
          subtitle: 'Weekly session limit reached',
          urgency: 'Upgrade now to continue without limits'
        };
      case 'premium_feature':
        return {
          title: `${featureName} - Premium Feature`,
          subtitle: 'Experience advanced capabilities',
          urgency: 'Join 10,000+ premium users'
        };
      case 'trial_end':
        return {
          title: 'Your Trial is Ending Soon',
          subtitle: 'Continue your wellness journey',
          urgency: 'Trial ends in 2 days'
        };
      default:
        return {
          title: 'Upgrade Your Experience',
          subtitle: 'Unlock premium features',
          urgency: 'Special offer available'
        };
    }
  };

  const content = getPaywallContent();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
              <p className="text-muted-foreground">{content.subtitle}</p>
            </div>

            {/* Urgency Banner */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
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
            </div>
          )}

          {/* Feature Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Preview Premium Features</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>

            {showPreview && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Advanced Analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Community Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Exclusive Content</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Priority Support</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social Proof */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Join 10,000+ Happy Users</span>
            </div>
            <p className="text-sm text-green-700">
              "Respiro Balance Premium transformed my daily routine. The advanced features are exactly what I needed!" - Sarah M.
            </p>
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
              ))}
              <span className="ml-2 text-sm text-green-700">4.9/5 rating</span>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Choose Your Plan</h3>
              <p className="text-sm text-muted-foreground">7-day free trial • Cancel anytime</p>
            </div>

            <div className="grid gap-3">
              {/* Premium */}
              <div className="border-2 border-blue-500 rounded-lg p-4 relative">
                <Badge className="absolute -top-2 left-4 bg-blue-500">Most Popular</Badge>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Premium</h4>
                    <p className="text-sm text-muted-foreground">All essential features</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">$11.97/mo</div>
                    <div className="text-sm text-muted-foreground line-through">$17.99</div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-3" 
                  onClick={() => onUpgrade('premium')}
                >
                  Start Free Trial
                </Button>
              </div>

              {/* Premium Pro */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Premium Pro</h4>
                    <p className="text-sm text-muted-foreground">Advanced features + coaching</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">$19.97/mo</div>
                    <div className="text-sm text-green-600">Save 35% annually</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-3"
                  onClick={() => onUpgrade('premium-pro')}
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>

          {/* Scarcity Indicator */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <div className="text-orange-800 font-medium">Limited Time Offer</div>
            <div className="text-sm text-orange-600">Only 47 spots left at this price</div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center text-xs text-muted-foreground">
            🔒 Secure payment • 💳 No hidden fees • ✨ Cancel anytime
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
