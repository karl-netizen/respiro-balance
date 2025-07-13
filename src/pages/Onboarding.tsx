import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AuthModeToggle from '@/components/auth/AuthModeToggle';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Welcome to Respiro Balance</CardTitle>
            <p className="text-lg text-muted-foreground mt-4">
              Start your wellness journey with guided meditation, breathing exercises, and mindfulness practices.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Ready to transform your daily routine with mindful meditation and balanced living?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-primary text-white hover:bg-primary/90 px-8 py-3"
                  size="lg"
                >
                  Create Account
                </Button>
                
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 px-8 py-3"
                  size="lg"
                >
                  Sign In
                </Button>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  ← Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AuthModeToggle />
    </div>
  );
};

export default Onboarding;