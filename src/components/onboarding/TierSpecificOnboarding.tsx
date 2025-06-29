
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Star, Crown, Sparkles, Target } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action: () => void;
}

interface TierSpecificOnboardingProps {
  tier: 'free' | 'premium' | 'premium-pro' | 'premium-plus';
  onComplete: () => void;
}

export const TierSpecificOnboarding: React.FC<TierSpecificOnboardingProps> = ({
  tier,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const getStepsForTier = (): OnboardingStep[] => {
    const baseSteps = [
      {
        id: 'welcome',
        title: 'Welcome to Respiro Balance',
        description: 'Let\'s get you started on your wellness journey',
        completed: false,
        action: () => {}
      },
      {
        id: 'profile',
        title: 'Set up your profile',
        description: 'Tell us about your meditation experience and goals',
        completed: false,
        action: () => {}
      }
    ];

    const tierSpecificSteps = {
      free: [
        {
          id: 'basic-sessions',
          title: 'Explore basic sessions',
          description: 'Try your first guided meditation',
          completed: false,
          action: () => {}
        },
        {
          id: 'breathing',
          title: 'Learn breathing techniques',
          description: 'Master the fundamentals of mindful breathing',
          completed: false,
          action: () => {}
        }
      ],
      premium: [
        {
          id: 'full-library',
          title: 'Explore the full library',
          description: 'Access all 14 meditation sessions',
          completed: false,
          action: () => {}
        },
        {
          id: 'analytics',
          title: 'Set up progress tracking',
          description: 'Enable detailed analytics and insights',
          completed: false,
          action: () => {}
        },
        {
          id: 'offline',
          title: 'Download for offline use',
          description: 'Access your favorite sessions anywhere',
          completed: false,
          action: () => {}
        }
      ],
      'premium-pro': [
        {
          id: 'extended-library',
          title: 'Discover extended content',
          description: 'Explore 18+ sessions and advanced techniques',
          completed: false,
          action: () => {}
        },
        {
          id: 'biofeedback',
          title: 'Connect biofeedback devices',
          description: 'Enhance sessions with heart rate monitoring',
          completed: false,
          action: () => {}
        },
        {
          id: 'challenges',
          title: 'Join group challenges',
          description: 'Connect with the meditation community',
          completed: false,
          action: () => {}
        }
      ],
      'premium-plus': [
        {
          id: 'complete-access',
          title: 'Full platform access',
          description: 'Unlock all 22+ sessions and exclusive content',
          completed: false,
          action: () => {}
        },
        {
          id: 'expert-booking',
          title: 'Book your first expert session',
          description: 'Schedule a 1-on-1 with a meditation expert',
          completed: false,
          action: () => {}
        },
        {
          id: 'ai-personalization',
          title: 'Set up AI coaching',
          description: 'Get personalized meditation plans',
          completed: false,
          action: () => {}
        },
        {
          id: 'family-setup',
          title: 'Family sharing setup',
          description: 'Invite family members to your plan',
          completed: false,
          action: () => {}
        }
      ]
    };

    return [...baseSteps, ...tierSpecificSteps[tier]];
  };

  const steps = getStepsForTier();
  const progress = (completedSteps.size / steps.length) * 100;

  const completeStep = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getTierIcon = () => {
    switch (tier) {
      case 'premium':
        return <Star className="w-6 h-6 text-blue-600" />;
      case 'premium-pro':
        return <Crown className="w-6 h-6 text-purple-600" />;
      case 'premium-plus':
        return <Sparkles className="w-6 h-6 text-orange-600" />;
      default:
        return <Target className="w-6 h-6 text-gray-600" />;
    }
  };

  const getTierColor = () => {
    switch (tier) {
      case 'premium':
        return 'from-blue-50 to-blue-100';
      case 'premium-pro':
        return 'from-purple-50 to-purple-100';
      case 'premium-plus':
        return 'from-orange-50 to-orange-100';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card className={`bg-gradient-to-r ${getTierColor()}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {getTierIcon()}
            <div>
              <h1 className="text-2xl font-bold capitalize">
                {tier.replace('-', ' ')} Onboarding
              </h1>
              <p className="text-muted-foreground">
                Let's get you set up with your new features
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedSteps.size} of {steps.length} complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = index === currentStep;
          const isAccessible = index <= currentStep || isCompleted;

          return (
            <Card 
              key={step.id}
              className={`transition-all duration-200 ${
                isCurrent ? 'ring-2 ring-blue-500 shadow-md' : ''
              } ${!isAccessible ? 'opacity-50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className={`w-6 h-6 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  
                  {isCurrent && !isCompleted && (
                    <Button 
                      onClick={() => completeStep(step.id)}
                      size="sm"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion */}
      {completedSteps.size === steps.length && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Welcome aboard!</h2>
            <p className="text-muted-foreground mb-4">
              You're all set up and ready to begin your {tier.replace('-', ' ')} experience.
            </p>
            <Button onClick={onComplete} className="w-full">
              Start Your Journey
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
