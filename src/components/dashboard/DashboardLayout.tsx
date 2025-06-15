
import React from 'react';

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
    <div className="mb-6">
      {welcomeSection}
    </div>
  );
};

export default DashboardLayout;
