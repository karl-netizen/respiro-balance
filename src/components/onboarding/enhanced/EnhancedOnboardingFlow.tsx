import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Trophy,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface OnboardingData {
  goals: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  availableTime: number;
  preferredTime: string;
  challenges: string[];
  personalityType: 'focused' | 'creative' | 'anxious' | 'busy';
}

interface EnhancedOnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const EnhancedOnboardingFlow: React.FC<EnhancedOnboardingFlowProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    experience: 'beginner',
    availableTime: 10,
    preferredTime: 'morning',
    challenges: [],
    personalityType: 'focused'
  });

  const steps = [
    {
      id: 'welcome',
      title: '🌟 Welcome to Respiro',
      subtitle: 'Your personalized journey to mindfulness starts here',
      component: 'welcome'
    },
    {
      id: 'goals',
      title: '🎯 What brings you here?',
      subtitle: 'Select your main goals (choose 2-3)',
      component: 'goals'
    },
    {
      id: 'experience',
      title: '🧘 Your meditation experience',
      subtitle: 'Help us tailor your sessions',
      component: 'experience'
    },
    {
      id: 'lifestyle',
      title: '⏰ Your lifestyle',
      subtitle: 'When and how long can you meditate?',
      component: 'lifestyle'
    },
    {
      id: 'challenges',
      title: '💭 Current challenges',
      subtitle: 'What would you like help with?',
      component: 'challenges'
    },
    {
      id: 'personalization',
      title: '✨ Almost ready!',
      subtitle: 'We\'re creating your personalized experience',
      component: 'personalization'
    }
  ];

  const goalOptions = [
    { id: 'stress', label: 'Reduce Stress', icon: '😌', description: 'Find calm in daily chaos' },
    { id: 'sleep', label: 'Better Sleep', icon: '😴', description: 'Improve sleep quality' },
    { id: 'focus', label: 'Increase Focus', icon: '🎯', description: 'Enhance concentration' },
    { id: 'anxiety', label: 'Manage Anxiety', icon: '🕊️', description: 'Find peace of mind' },
    { id: 'happiness', label: 'Build Happiness', icon: '😊', description: 'Cultivate joy and positivity' },
    { id: 'habits', label: 'Healthy Habits', icon: '🌱', description: 'Create lasting routines' },
    { id: 'relationships', label: 'Better Relationships', icon: '❤️', description: 'Improve connections' },
    { id: 'productivity', label: 'Boost Productivity', icon: '⚡', description: 'Enhance performance' }
  ];

  const challengeOptions = [
    { id: 'racing_thoughts', label: 'Racing thoughts', icon: '🌪️' },
    { id: 'trouble_sleeping', label: 'Trouble sleeping', icon: '😴' },
    { id: 'work_stress', label: 'Work stress', icon: '💼' },
    { id: 'overthinking', label: 'Overthinking', icon: '🤯' },
    { id: 'procrastination', label: 'Procrastination', icon: '⏰' },
    { id: 'relationship_issues', label: 'Relationship stress', icon: '💔' },
    { id: 'time_management', label: 'Time management', icon: '📅' },
    { id: 'burnout', label: 'Feeling burned out', icon: '🔥' }
  ];

  const experienceOptions = [
    {
      id: 'beginner',
      label: 'New to meditation',
      description: 'Never meditated or just starting',
      icon: '🌱'
    },
    {
      id: 'intermediate',
      label: 'Some experience',
      description: 'Meditated occasionally or for a few months',
      icon: '🌿'
    },
    {
      id: 'advanced',
      label: 'Experienced',
      description: 'Regular practice for months/years',
      icon: '🌳'
    }
  ];

  const timeOptions = [
    { value: 'morning', label: 'Morning', icon: '🌅', description: 'Start your day mindfully' },
    { value: 'afternoon', label: 'Afternoon', icon: '☀️', description: 'Mid-day reset' },
    { value: 'evening', label: 'Evening', icon: '🌙', description: 'Wind down peacefully' },
    { value: 'flexible', label: 'Flexible', icon: '⏰', description: 'Whenever works' }
  ];

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleArrayItem = (array: string[], item: string, maxItems?: number) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      if (maxItems && array.length >= maxItems) {
        return [...array.slice(1), item];
      }
      return [...array, item];
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.component) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Respiro</h2>
              <p className="text-muted-foreground text-lg">
                In just 2 minutes, we'll create a personalized meditation experience that fits your unique needs and lifestyle.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                ✨ Personalized recommendations<br/>
                🎯 Goal-based content<br/>
                📈 Progress tracking<br/>
                🏆 Achievement system
              </p>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <motion.div
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      data.goals.includes(goal.id) 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => updateData({ 
                      goals: toggleArrayItem(data.goals, goal.id, 3) 
                    })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{goal.icon}</div>
                      <h3 className="font-semibold text-sm mb-1">{goal.label}</h3>
                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {data.goals.length > 0 && (
              <div className="text-center">
                <Badge variant="secondary">
                  {data.goals.length}/3 goals selected
                </Badge>
              </div>
            )}
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4">
            {experienceOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    data.experience === option.id 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => updateData({ experience: option.id as OnboardingData['experience'] })}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="text-2xl">{option.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">When do you prefer to meditate?</h3>
              <div className="grid grid-cols-2 gap-3">
                {timeOptions.map((option) => (
                  <Card 
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      data.preferredTime === option.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => updateData({ preferredTime: option.value })}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-xl mb-1">{option.icon}</div>
                      <h4 className="font-medium text-sm">{option.label}</h4>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">How much time can you dedicate daily?</h3>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((minutes) => (
                  <Button
                    key={minutes}
                    variant={data.availableTime === minutes ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateData({ availableTime: minutes })}
                    className="h-12"
                  >
                    {minutes}min
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'challenges':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challengeOptions.map((challenge) => (
                <Card 
                  key={challenge.id}
                  className={`cursor-pointer transition-all ${
                    data.challenges.includes(challenge.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => updateData({ 
                    challenges: toggleArrayItem(data.challenges, challenge.id) 
                  })}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="text-lg">{challenge.icon}</div>
                    <span className="text-sm font-medium">{challenge.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'personalization':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Your Journey Awaits!</h2>
              <p className="text-muted-foreground">
                Based on your preferences, we've created a personalized meditation program just for you.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Main goals:</span>
                <span className="font-medium">{data.goals.length} selected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Experience level:</span>
                <span className="font-medium capitalize">{data.experience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Daily commitment:</span>
                <span className="font-medium">{data.availableTime} minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Preferred time:</span>
                <span className="font-medium capitalize">{data.preferredTime}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].component) {
      case 'goals':
        return data.goals.length > 0;
      case 'experience':
        return data.experience !== undefined;
      case 'lifestyle':
        return data.preferredTime && data.availableTime;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-foreground mb-1">
              {steps[currentStep].title}
            </h1>
            <p className="text-muted-foreground text-sm">
              {steps[currentStep].subtitle}
            </p>
          </div>
          
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="ghost" onClick={onSkip} size="sm">
              Skip
            </Button>
          )}
          
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Start Journey' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOnboardingFlow;