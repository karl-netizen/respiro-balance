
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
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Social Hub</h1>
              <p className="text-muted-foreground mt-2">
                Connect, compete, and celebrate your wellness journey with others
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Rank: #15
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Friends: 23
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="leaderboards" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboards
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="sharing" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Groups
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
