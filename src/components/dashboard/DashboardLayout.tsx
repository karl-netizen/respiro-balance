
import React from 'react';
import SmartRecommendations from '@/components/shared/smart-recommendations';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {children}
    </div>
  );
};

interface DashboardTopSectionProps {
  welcomeSection: React.ReactNode;
}

export const DashboardTopSection: React.FC<DashboardTopSectionProps> = ({
  welcomeSection
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        {welcomeSection}
      </div>
      
      {/* Smart Recommendations Panel */}
      <div className="lg:w-80">
        <SmartRecommendations maxRecommendations={2} compact={true} />
      </div>
    </div>
  );
};

export default DashboardLayout;
