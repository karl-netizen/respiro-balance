import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleStore } from '@/store/moduleStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

type OnboardingStep = 'welcome' | 'goal' | 'experience' | 'schedule' | 'complete';

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const { setSubscriptionTier } = useModuleStore();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [answers, setAnswers] = useState({
    goal: '',
    experience: '',
    schedule: ''
  });

  const steps: OnboardingStep[] = ['welcome', 'goal', 'experience', 'schedule', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = () => {
    // Save onboarding completion
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_answers', JSON.stringify(answers));
    
    // Navigate to dashboard
    navigate('/dashboard?onboarded=true');
  };

  // Welcome Screen
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-8 text-center space-y-6 p-6">
            <div className="text-6xl mb-4">🧘</div>
            <h1 className="text-3xl font-bold">Welcome to Respiro Balance</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Your journey to better focus, reduced stress, and inner peace starts here.
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Science-backed techniques</p>
                  <p className="text-sm text-muted-foreground">Proven methods for wellness</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Track your progress</p>
                  <p className="text-sm text-muted-foreground">See measurable improvements</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Personalized experience</p>
                  <p className="text-sm text-muted-foreground">Adapts to your needs</p>
                </div>
              </div>
            </div>
            <Button size="lg" className="mt-8 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleNext}>
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Goal Selection
  if (currentStep === 'goal') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 pb-6 space-y-6 p-6">
            <Progress value={progress} className="mb-4" />
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">What brings you here today?</h2>
              <p className="text-muted-foreground">This helps us personalize your experience</p>
            </div>
            
            <RadioGroup value={answers.goal} onValueChange={(value) => setAnswers({...answers, goal: value})}>
              <div className="space-y-3">
                {[
                  { value: 'stress', emoji: '😌', label: 'Reduce stress & anxiety', desc: 'Find calm in daily life' },
                  { value: 'focus', emoji: '🎯', label: 'Improve focus & productivity', desc: 'Get more done with less effort' },
                  { value: 'sleep', emoji: '😴', label: 'Better sleep', desc: 'Rest deeply and wake refreshed' },
                  { value: 'habits', emoji: '🌅', label: 'Build healthy habits', desc: 'Create lasting positive routines' },
                  { value: 'explore', emoji: '✨', label: 'Just exploring', desc: 'Curious about meditation' }
                ].map(option => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                    <Label
                      htmlFor={option.value}
                      className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-500/5 hover:bg-accent transition-colors"
                    >
                      <span className="text-3xl">{option.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleNext} disabled={!answers.goal}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Experience Level
  if (currentStep === 'experience') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 pb-6 space-y-6 p-6">
            <Progress value={progress} className="mb-4" />
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">What's your meditation experience?</h2>
              <p className="text-muted-foreground">We'll recommend the right sessions for you</p>
            </div>
            
            <RadioGroup value={answers.experience} onValueChange={(value) => setAnswers({...answers, experience: value})}>
              <div className="space-y-3">
                {[
                  { value: 'beginner', label: 'Complete beginner', desc: 'Never meditated before' },
                  { value: 'occasional', label: 'Occasional practitioner', desc: 'Tried it a few times' },
                  { value: 'regular', label: 'Regular practitioner', desc: 'Meditate weekly' },
                  { value: 'advanced', label: 'Advanced', desc: 'Daily practice for months/years' }
                ].map(option => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                    <Label
                      htmlFor={option.value}
                      className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-500/5 hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleNext} disabled={!answers.experience}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Schedule Preference
  if (currentStep === 'schedule') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 pb-6 space-y-6 p-6">
            <Progress value={progress} className="mb-4" />
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">When would you like to practice?</h2>
              <p className="text-muted-foreground">We can send you gentle reminders</p>
            </div>
            
            <RadioGroup value={answers.schedule} onValueChange={(value) => setAnswers({...answers, schedule: value})}>
              <div className="space-y-3">
                {[
                  { value: 'morning', emoji: '🌅', label: 'Morning (6-9 AM)', desc: 'Start your day centered' },
                  { value: 'midday', emoji: '☀️', label: 'Midday (12-2 PM)', desc: 'Reset during lunch' },
                  { value: 'evening', emoji: '🌙', label: 'Evening (6-9 PM)', desc: 'Unwind after work' },
                  { value: 'night', emoji: '✨', label: 'Night (9-11 PM)', desc: 'Prepare for sleep' },
                  { value: 'flexible', emoji: '🔄', label: 'Flexible', desc: 'I\'ll practice when I can' }
                ].map(option => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                    <Label
                      htmlFor={option.value}
                      className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-500/5 hover:bg-accent transition-colors"
                    >
                      <span className="text-3xl">{option.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.desc}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={handleNext} disabled={!answers.schedule}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completion Screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 text-center space-y-6 p-6">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold">You're All Set! 🎉</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Based on your answers, we've personalized your experience. 
            Let's start your first session!
          </p>
          
          <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto text-left space-y-3">
            <h3 className="font-semibold mb-3">Your personalized recommendations:</h3>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20">🎯 Goal</Badge>
              <span className="text-sm capitalize">{answers.goal?.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20">📊 Level</Badge>
              <span className="text-sm capitalize">{answers.experience}</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20">⏰ Time</Badge>
              <span className="text-sm capitalize">{answers.schedule}</span>
            </div>
          </div>

          <Button size="lg" className="mt-8 bg-green-500 hover:bg-green-600 text-white" onClick={handleComplete}>
            Start Your Journey
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
