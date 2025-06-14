
import React from 'react';
import { useUserPreferences } from '@/context';
import { useTimeAwareness } from '@/hooks/useTimeAwareness';

interface DashboardHeaderProps {
  welcomeMessage: string;
  currentPeriod: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  welcomeMessage,
  currentPeriod
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {welcomeMessage}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        {currentPeriod === 'morning' && "Start your day with intention"}
        {currentPeriod === 'afternoon' && "Take a moment to reset and refocus"}
        {currentPeriod === 'evening' && "Unwind and reflect on your day"}
        {currentPeriod === 'night' && "Prepare for restful sleep"}
      </p>
    </div>
  );
};

export default DashboardHeader;
