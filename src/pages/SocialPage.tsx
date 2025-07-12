
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Gift, MessageSquare, Share2, Target } from 'lucide-react';
import { SocialFeed } from '@/components/social/SocialFeed';
import { Leaderboards } from '@/components/social/Leaderboards';
import { ChallengesSection } from '@/components/social/ChallengesSection';
import { RewardsHub } from '@/components/social/RewardsHub';
import { SharingCenter } from '@/components/social/SharingCenter';
import { CommunityGroups } from '@/components/social/CommunityGroups';

const SocialPage = () => {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">Social Hub</h1>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                Connect, compete, and celebrate your wellness journey with others
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Trophy className="h-3 w-3" />
                <span className="hidden xs:inline">Rank: </span>#15
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3" />
                <span className="hidden xs:inline">Friends: </span>23
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="feed" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Feed</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboards" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm hidden xs:inline sm:inline">Leaderboards</span>
              <span className="text-xs sm:text-sm xs:hidden sm:hidden">Ranks</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 sm:col-span-1 lg:col-span-1">
              <Target className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Challenges</span>
              <span className="text-xs sm:text-sm sm:hidden">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 sm:col-span-1 lg:col-span-1">
              <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Rewards</span>
            </TabsTrigger>
            <TabsTrigger value="sharing" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 sm:col-span-1 lg:col-span-1">
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Share</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 sm:col-span-1 lg:col-span-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Groups</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <SocialFeed />
          </TabsContent>

          <TabsContent value="leaderboards">
            <Leaderboards />
          </TabsContent>

          <TabsContent value="challenges">
            <ChallengesSection />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsHub />
          </TabsContent>

          <TabsContent value="sharing">
            <SharingCenter />
          </TabsContent>

          <TabsContent value="groups">
            <CommunityGroups />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialPage;
