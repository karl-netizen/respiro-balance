
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Plus, MessageCircle } from 'lucide-react';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  isJoined: boolean;
  isPrivate: boolean;
  activity: string;
  recentPosts: number;
}

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  role: 'admin' | 'moderator' | 'member';
}

export const CommunityGroups: React.FC = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');

  const availableGroups: CommunityGroup[] = [
    {
      id: '1',
      name: 'Mindful Professionals',
      description: 'A community for working professionals incorporating mindfulness into their daily routine',
      memberCount: 1247,
      category: 'Workplace Wellness',
      isJoined: false,
      isPrivate: false,
      activity: 'Very Active',
      recentPosts: 23
    },
    {
      id: '2',
      name: 'Morning Meditation Circle',
      description: 'Early risers who start their day with meditation and positive energy',
      memberCount: 856,
      category: 'Daily Practice',
      isJoined: false,
      isPrivate: false,
      activity: 'Active',
      recentPosts: 12
    },
    {
      id: '3',
      name: 'Focus Warriors',
      description: 'Dedicated to mastering deep work and eliminating distractions',
      memberCount: 634,
      category: 'Productivity',
      isJoined: false,
      isPrivate: false,
      activity: 'Active',
      recentPosts: 18
    },
    {
      id: '4',
      name: 'Zen Masters',
      description: 'Advanced practitioners sharing wisdom and techniques',
      memberCount: 342,
      category: 'Advanced Practice',
      isJoined: false,
      isPrivate: true,
      activity: 'Moderate',
      recentPosts: 8
    }
  ];

  const joinedGroups: CommunityGroup[] = [
    {
      id: '5',
      name: 'Beginner\'s Mindfulness',
      description: 'Safe space for meditation newcomers to learn and grow together',
      memberCount: 2341,
      category: 'Beginner Friendly',
      isJoined: true,
      isPrivate: false,
      activity: 'Very Active',
      recentPosts: 45
    },
    {
      id: '6',
      name: 'Work-Life Balance Hub',
      description: 'Balancing career demands with personal wellness and growth',
      memberCount: 987,
      category: 'Lifestyle',
      isJoined: true,
      isPrivate: false,
      activity: 'Active',
      recentPosts: 19
    }
  ];

  const groupMembers: GroupMember[] = [
    { id: '1', name: 'Sarah Chen', level: 18, role: 'admin' },
    { id: '2', name: 'Mike Johnson', level: 12, role: 'moderator' },
    { id: '3', name: 'Emma Wilson', level: 15, role: 'member' },
    { id: '4', name: 'David Kim', level: 10, role: 'member' },
    { id: '5', name: 'Alex Rivera', level: 20, role: 'member' }
  ];

  const joinGroup = (groupId: string) => {
    console.log('Joining group:', groupId);
  };

  const leaveGroup = (groupId: string) => {
    console.log('Leaving group:', groupId);
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'Very Active':
        return 'bg-green-100 text-green-800';
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderGroup = (group: CommunityGroup) => (
    <Card key={group.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{group.name}</CardTitle>
              {group.isPrivate && <Badge variant="outline">Private</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{group.description}</p>
            <Badge variant="secondary">{group.category}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{group.memberCount.toLocaleString()} members</span>
          </div>
          <div>
            <Badge className={getActivityColor(group.activity)}>
              {group.activity}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span>{group.recentPosts} recent posts</span>
          </div>
          <div className="flex justify-end">
            {group.isJoined ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => leaveGroup(group.id)}>
                  Leave
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => joinGroup(group.id)}>
                <Plus className="h-4 w-4 mr-2" />
                Join
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Groups</h2>
          <p className="text-muted-foreground">Connect with like-minded wellness enthusiasts</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="joined">My Groups</TabsTrigger>
          <TabsTrigger value="members">Group Members</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {availableGroups.map(renderGroup)}
          </div>
        </TabsContent>

        <TabsContent value="joined" className="space-y-4">
          {joinedGroups.length > 0 ? (
            <div className="space-y-4">
              {joinedGroups.map(renderGroup)}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Groups Joined Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Join communities to connect with others on similar wellness journeys.
                </p>
                <Button onClick={() => setActiveTab('discover')}>
                  Discover Groups
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Beginner's Mindfulness Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{member.name}</h4>
                        <Badge variant="secondary" className="text-xs">Level {member.level}</Badge>
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
