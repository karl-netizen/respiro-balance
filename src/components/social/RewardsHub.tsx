
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Coins, Trophy, Crown, Star, Zap } from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'badge' | 'avatar' | 'theme' | 'feature';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  owned: boolean;
  image?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  completed: boolean;
  icon: string;
}

export const RewardsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shop');
  const [userCoins] = useState(1250);

  const shopItems: Reward[] = [
    {
      id: '1',
      name: 'Zen Master Badge',
      description: 'Exclusive badge for meditation masters',
      cost: 500,
      type: 'badge',
      rarity: 'epic',
      owned: false
    },
    {
      id: '2',
      name: 'Focus Champion Avatar',
      description: 'Special avatar frame for focus experts',
      cost: 750,
      type: 'avatar',
      rarity: 'rare',
      owned: false
    },
    {
      id: '3',
      name: 'Midnight Theme',
      description: 'Beautiful dark theme with gradient accents',
      cost: 300,
      type: 'theme',
      rarity: 'common',
      owned: true
    },
    {
      id: '4',
      name: 'Premium Analytics',
      description: 'Unlock advanced progress analytics',
      cost: 1000,
      type: 'feature',
      rarity: 'legendary',
      owned: false
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first meditation session',
      progress: 1,
      target: 1,
      reward: '50 coins',
      completed: true,
      icon: 'footprints'
    },
    {
      id: '2',
      name: 'Weekly Warrior',
      description: 'Meditate for 7 consecutive days',
      progress: 4,
      target: 7,
      reward: '200 coins',
      completed: false,
      icon: 'target'
    },
    {
      id: '3',
      name: 'Focus Master',
      description: 'Complete 50 focus sessions',
      progress: 23,
      target: 50,
      reward: 'Focus Champion Badge',
      completed: false,
      icon: 'zap'
    },
    {
      id: '4',
      name: 'Time Traveler',
      description: 'Accumulate 100 hours of meditation',
      progress: 45,
      target: 100,
      reward: 'Zen Master Badge',
      completed: false,
      icon: 'clock'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100';
      case 'rare':
        return 'text-blue-600 bg-blue-100';
      case 'epic':
        return 'text-purple-600 bg-purple-100';
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'badge':
        return <Trophy className="h-4 w-4" />;
      case 'avatar':
        return <Crown className="h-4 w-4" />;
      case 'theme':
        return <Star className="h-4 w-4" />;
      case 'feature':
        return <Zap className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const purchaseItem = (itemId: string, cost: number) => {
    if (userCoins >= cost) {
      console.log('Purchasing item:', itemId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rewards Hub</h2>
          <p className="text-muted-foreground">Earn coins and unlock exclusive rewards</p>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="text-lg font-bold">{userCoins.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">coins</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="shop">Shop</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="inventory">My Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </div>
                    <Badge className={getRarityColor(item.rarity)}>
                      {item.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold">{item.cost}</span>
                    </div>
                    
                    {item.owned ? (
                      <Badge variant="outline">Owned</Badge>
                    ) : (
                      <Button 
                        size="sm"
                        disabled={userCoins < item.cost}
                        onClick={() => purchaseItem(item.id, item.cost)}
                      >
                        Purchase
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${achievement.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Trophy className={`h-6 w-6 ${achievement.completed ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      {achievement.completed && <Badge>Completed</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    
                    {!achievement.completed && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress} / {achievement.target}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Gift className="h-4 w-4 text-yellow-500" />
                      <span>Reward: {achievement.reward}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.filter(item => item.owned).map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Equipped
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {shopItems.filter(item => item.owned).length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Rewards Yet</h3>
                <p className="text-muted-foreground">
                  Complete achievements and purchase items to build your collection!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
