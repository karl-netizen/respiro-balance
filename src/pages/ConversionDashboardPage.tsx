
import React from 'react';
import Header from '@/components/Header';

import { ConversionAnalytics } from '@/components/analytics/ConversionAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ConversionDashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Only allow admin users to access this page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <ConversionAnalytics />
        </div>
      </main>

      
    </div>
  );
};

export default ConversionDashboardPage;
