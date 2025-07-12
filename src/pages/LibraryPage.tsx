import React from 'react';
import { MeditationLibrary } from '@/components/meditation/MeditationLibrary';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const LibraryPage = () => {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Meditation Library
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore our comprehensive collection of guided meditations and mindfulness practices
          </p>
        </div>
        
        <MeditationLibrary />
      </div>
    </div>
  );
};

export default LibraryPage;