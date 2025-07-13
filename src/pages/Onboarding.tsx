import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useDemoMode } from '@/hooks/useDemoMode';

const Onboarding = () => {
  const navigate = useNavigate();
  const { loginDemo, isDemoMode, toggleDemoMode } = useDemoMode();
  const [isDemo, setIsDemo] = useState(isDemoMode);

  const handleDemoToggle = (checked: boolean) => {
    setIsDemo(checked);
    if (checked !== isDemoMode) {
      toggleDemoMode();
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Welcome to Respiro Balance</CardTitle>
            <p className="text-lg text-muted-foreground mt-4">
              Choose how you'd like to experience your wellness journey
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Demo/Live Mode Toggle */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700">Experience Mode:</span>
                  <Badge 
                    variant={isDemo ? "default" : "secondary"} 
                    className={`text-xs ${isDemo ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {isDemo ? "🎭 DEMO" : "🔐 LIVE"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium transition-colors ${!isDemo ? "text-blue-600" : "text-gray-500"}`}>
                    Live
                  </span>
                  <Switch
                    checked={isDemo}
                    onCheckedChange={handleDemoToggle}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className={`text-sm font-medium transition-colors ${isDemo ? "text-blue-600" : "text-gray-500"}`}>
                    Demo
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {isDemo ? (
                  <>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      🎭 <strong>Demo Mode:</strong> Instant access with premium features, sample meditation data, and a fully functional interface. Perfect for exploring Respiro Balance without creating an account.
                    </p>
                    <Button
                      onClick={handleDemoLogin}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      size="lg"
                    >
                      🎭 Enter Demo Mode - Start Exploring
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      🔐 <strong>Live Mode:</strong> Create a real account with email verification, personalized progress tracking, and full access to your meditation journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => navigate('/register')}
                        className="bg-primary text-white hover:bg-primary/90 px-8 py-3 flex-1"
                        size="lg"
                      >
                        Create Account
                      </Button>
                      
                      <Button
                        onClick={() => navigate('/login')}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/10 px-8 py-3 flex-1"
                        size="lg"
                      >
                        Sign In
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-muted-foreground"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;