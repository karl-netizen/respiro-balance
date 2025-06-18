
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { OfflineDownloadManager, OfflineContentSync } from '@/components/meditation/offline';
import { meditationSessions } from '@/data/meditationSessions';

const OfflineDownloadsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Offline Downloads</h1>
            <p className="text-muted-foreground">
              Download meditation sessions for offline access. Perfect for commutes, travel, or areas with poor connectivity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <OfflineDownloadManager sessions={meditationSessions} />
            </div>
            <div>
              <OfflineContentSync />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OfflineDownloadsPage;
