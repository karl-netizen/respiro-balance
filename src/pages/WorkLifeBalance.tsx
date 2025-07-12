
import React from 'react';
import WorkLifeBalanceSection from '@/components/work-life-balance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Clock, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkLifeBalance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Work-Life Balance Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Maintain harmony between your professional and personal life with our integrated wellness tools
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/focus')}>
              <CardHeader className="text-center pb-2">
                <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Focus Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Deep work sessions with distraction blocking
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/breathe')}>
              <CardHeader className="text-center pb-2">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Quick Breathing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Stress relief breathing exercises
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/meditate?tab=quick')}>
              <CardHeader className="text-center pb-2">
                <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Quick Meditation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  5-minute mindfulness breaks
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/morning-ritual')}>
              <CardHeader className="text-center pb-2">
                <Briefcase className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Morning Ritual</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Start your day with intention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Work-Life Balance Section */}
          <WorkLifeBalanceSection />

          {/* Additional Resources */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Resources & Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Work Productivity</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use the Pomodoro Technique with our Focus Mode</li>
                      <li>• Take regular breathing breaks every 30 minutes</li>
                      <li>• Set clear boundaries between work and personal time</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Stress Management</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Practice mindful breathing during stressful moments</li>
                      <li>• Use guided meditations for emotional regulation</li>
                      <li>• Maintain a consistent morning routine</li>
                    </ul>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button onClick={() => navigate('/progress')} className="w-full md:w-auto">
                    Track Your Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkLifeBalance;
