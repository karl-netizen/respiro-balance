import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [userGoal, setUserGoal] = useState('');

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleComplete = () => {
    // Mark onboarding as complete
    localStorage.setItem('onboarding_completed', 'true');
    
    // Save user preferences
    localStorage.setItem('user_goal', userGoal);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/dashboard');
  };

  // Step 0: Welcome
  if (step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="text-6xl mb-4">🧘</div>
            <h1 className="text-4xl font-bold">Welcome to Respiro Balance</h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Your journey to better focus, reduced stress, and inner peace starts here.
            </p>
            
            <div className="flex flex-col gap-4 max-w-sm mx-auto pt-8">
              <Button size="lg" onClick={() => setStep(1)}>
                Get Started
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="ghost" onClick={handleSkip}>
                Skip Tutorial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 1: Choose Your Goal
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 pb-6 space-y-6">
            <Progress value={progress} className="mb-4" />
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">What brings you here today?</h2>
              <p className="text-muted-foreground">Choose your primary goal</p>
            </div>
            
            <div className="space-y-3">
              {[
                { value: 'stress', emoji: '😌', label: 'Reduce stress & anxiety' },
                { value: 'focus', emoji: '🎯', label: 'Improve focus & productivity' },
                { value: 'sleep', emoji: '😴', label: 'Better sleep' },
                { value: 'habits', emoji: '🌅', label: 'Build healthy habits' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setUserGoal(option.value)}
                  className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-colors ${
                    userGoal === option.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="font-medium text-left">{option.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep(2)}
                disabled={!userGoal}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Complete
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold">You're All Set! 🎉</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Let's start your meditation journey!
          </p>
          
          <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
            <Badge className="mb-3">Your Goal</Badge>
            <p className="text-sm capitalize">{userGoal?.replace('_', ' ')}</p>
          </div>

          <Button size="lg" className="mt-8" onClick={handleComplete}>
            Start Your Journey
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}