
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OfflineDownloadManager } from './offline/OfflineDownloadManager';
import { OfflineSessionsList } from './OfflineSessionsList';
import { SmartDownloadRecommendations } from './SmartDownloadRecommendations';
import { OfflineContentSync } from './offline/OfflineContentSync';
import { meditationSessions } from '@/data/meditationSessions';

interface DownloadManagementSectionProps {
  onPlaySession?: (session: any) => void;
}

export const DownloadManagementSection: React.FC<DownloadManagementSectionProps> = ({
  onPlaySession
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Offline Downloads</h2>
        <p className="text-muted-foreground">
          Download sessions to access them without an internet connection
        </p>
      </div>

      <Tabs defaultValue="downloaded" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="downloaded">Downloaded</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="sync">Sync</TabsTrigger>
        </TabsList>

        <TabsContent value="downloaded" className="mt-6">
          <OfflineSessionsList onPlaySession={onPlaySession} />
        </TabsContent>

        <TabsContent value="recommended" className="mt-6">
          <SmartDownloadRecommendations />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <OfflineDownloadManager sessions={meditationSessions} />
        </TabsContent>

        <TabsContent value="sync" className="mt-6">
          <OfflineContentSync />
        </TabsContent>
      </Tabs>
    </div>
  );
};
