
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';

interface DashboardWelcomeProps {
  userName: string;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ userName }) => {
  const hour = new Date().getHours();
  
  // Determine greeting and icon based on time of day
  let greeting = '';
  let Icon = Sun;
  
  if (hour < 6) {
    greeting = 'Good night';
    Icon = Moon;
  } else if (hour < 12) {
    greeting = 'Good morning';
    Icon = Sunrise;
  } else if (hour < 18) {
    greeting = 'Good afternoon';
    Icon = Sun;
  } else {
    greeting = 'Good evening';
    Icon = Sunset;
  }
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Icon className="mr-2 h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">{greeting}, {userName}</h1>
      </div>
      <p className="text-muted-foreground">
        Your mindfulness journey continues. Let's take a moment to check in.
      </p>
    </div>
  );
};

export default DashboardWelcome;
