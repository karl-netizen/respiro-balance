
import React from 'react';
import Header from '@/components/Header';

import { DownloadManagementSection } from '@/components/meditation/DownloadManagementSection';

const OfflineDownloadsPage = () => {
  const handlePlaySession = (session: any) => {
    // Navigate to session player or handle play action
    console.log('Playing session:', session.title);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <DownloadManagementSection onPlaySession={handlePlaySession} />
      </main>
      
      
    </div>
  );
};

export default OfflineDownloadsPage;
