
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Settings, 
  TrendingUp, 
  Users, 
  Zap,
  Heart,
  Shield
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const SubscriptionStatusDashboard: React.FC = () => {
  const { currentTier, getSessionLimits, getMeditationLibraryAccess, getFeatureFlags } = useFeatureAccess();
  const { isPremium, subscriptionData, manageSubscription } = useSubscriptionContext();
  const navigate = useNavigate();

  const sessionLimits = getSessionLimits();
  const libraryAccess = getMeditationLibraryAccess();
  const features = getFeatureFlags();

  const getTierIcon = () => {
    switch (currentTier) {
      case 'standard':
        return <Zap className="h-5 w-5 text-blue-500" />;
      case 'premium':
        return <Crown className="h-5 w-5 text-amber-500" />;
      default:
        return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTierColor = () => {
    switch (currentTier) {
      case 'standard':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      case 'premium':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTierName = () => {
    switch (currentTier) {
      case 'standard':
        return 'Standard';
      case 'premium':
        return 'Premium';
      default:
        return 'Free';
    }
  };

  const handleManageSubscription = async () => {
    if (isPremium) {
      try {
        const portalUrl = await manageSubscription();
        window.location.href = portalUrl;
      } catch (error) {
        console.error('Error opening portal:', error);
      }
    } else {
      navigate('/subscription');
    }
  };

  const getActiveFeatures = () => {
    const activeFeatures = [];
    if (features.adFree) activeFeatures.push('Ad-Free Experience');
    if (features.offlineMode) activeFeatures.push('Offline Mode');
    if (features.advancedAnalytics) activeFeatures.push('Advanced Analytics');
    if (features.communityAccess) activeFeatures.push('Community Access');
    if (features.sleepStories) activeFeatures.push('Sleep Stories');
    if (features.moodTracking) activeFeatures.push('Mood Tracking');
    if (features.focusMode) activeFeatures.push('Focus Mode');
    if (features.habitTracking) activeFeatures.push('Habit Tracking');
    if (features.biofeedbackIntegration) activeFeatures.push('Biofeedback');
    if (features.groupChallenges) activeFeatures.push('Group Challenges');
    if (features.expertSessions) activeFeatures.push('Expert Sessions');
    if (features.aiPersonalization) activeFeatures.push('AI Personalization');
    if (features.familySharing) activeFeatures.push('Family Sharing');
    return activeFeatures;
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTierIcon()}
            Current Plan: {getTierName()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Badge className={`${getTierColor()} text-white px-3 py-1 text-sm`}>
                  {getTierName()}
                </Badge>
                {subscriptionData?.subscription_period_end && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Renews {format(new Date(subscriptionData.subscription_period_end), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>
              <Button onClick={handleManageSubscription} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                {isPremium ? 'Manage' : 'Upgrade'}
              </Button>
            </div>

            {/* Usage Stats for Free Tier */}
            {currentTier === 'free' && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Weekly Sessions</span>
                    <span>1 / {sessionLimits.weekly} used</span>
                  </div>
                  <Progress value={(1/sessionLimits.weekly) * 100} className="h-2" />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Free Plan:</strong> Limited to 2 sessions per week. 
                    Upgrade for unlimited access!
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            Your Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">{libraryAccess.sessions === Infinity ? '22+' : libraryAccess.sessions}</div>
              <div className="text-sm text-teal-700">Meditation Sessions</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{libraryAccess.breathingTechniques === Infinity ? '∞' : libraryAccess.breathingTechniques}</div>
              <div className="text-sm text-blue-700">Breathing Techniques</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{getActiveFeatures().length}</div>
              <div className="text-sm text-purple-700">Premium Features</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-3">Active Features</h4>
            <div className="flex flex-wrap gap-2">
              {getActiveFeatures().map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {getActiveFeatures().length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Upgrade to unlock premium features
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt for Free Users */}
      {currentTier === 'free' && (
        <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-700">
              <Crown className="h-5 w-5" />
              Unlock Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Unlimited Sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>14+ Guided Meditations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Advanced Analytics</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Offline Mode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Sleep Stories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Community Access</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/subscription')} 
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Starting at $6.99/month
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionStatusDashboard;
