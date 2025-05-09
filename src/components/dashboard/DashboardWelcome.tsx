
import React from 'react';
import { TimePeriod } from '@/services/TimeAwarenessService';
import { Sun, Moon, Sunset, Cloud } from 'lucide-react';

interface DashboardWelcomeProps {
  userName: string;
  greeting?: string;
  timePeriod?: TimePeriod;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ 
  userName, 
  greeting,
  timePeriod = 'morning' 
}) => {
  // Get appropriate icon based on time period
  const getTimeIcon = () => {
    switch (timePeriod) {
      case 'morning':
        return <Sun className="h-6 w-6 text-amber-500" />;
      case 'afternoon':
        return <Cloud className="h-6 w-6 text-blue-500" />;
      case 'evening':
        return <Sunset className="h-6 w-6 text-orange-500" />;
      case 'night':
        return <Moon className="h-6 w-6 text-indigo-600" />;
      default:
        return <Sun className="h-6 w-6 text-amber-500" />;
    }
  };

  // Generate greeting if not provided
  const greetingMessage = greeting || `Good ${timePeriod}, ${userName}`;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {getTimeIcon()}
        <h1 className="text-3xl font-bold">{greetingMessage}</h1>
      </div>
      <p className="text-muted-foreground">
        Welcome to your personal wellness dashboard. Here's your progress at a glance.
      </p>
    </div>
  );
};

export default DashboardWelcome;
