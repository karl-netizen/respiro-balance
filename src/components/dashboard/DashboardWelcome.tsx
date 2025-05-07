
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, PlusCircle } from 'lucide-react';

interface DashboardWelcomeProps {
  userName?: string;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ userName = 'there' }) => {
  // Get current time to determine greeting
  const currentHour = new Date().getHours();
  let greeting = '';
  
  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-primary/20 rounded-full mr-3">
            <Sun className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{greeting}, {userName}!</h1>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Welcome to your personal mindfulness dashboard. Track your progress and continue your journey.
        </p>
        
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" /> New Meditation
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardWelcome;
