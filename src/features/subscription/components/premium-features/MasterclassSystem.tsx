
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Play, Radio, Download, MessageCircle } from 'lucide-react';
import { FeatureGate } from '../management/FeatureGate';

interface Masterclass {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  description: string;
  scheduledAt: string;
  duration: number;
  isLive: boolean;
  isUpcoming: boolean;
  recordingUrl?: string;
  thumbnailUrl: string;
  attendeeCount: number;
  maxAttendees: number;
  tags: string[];
  resources: Array<{
    title: string;
    type: 'pdf' | 'worksheet' | 'audio';
    url: string;
  }>;
}

const MasterclassSystem: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');

  // Mock data
  const masterclasses: Masterclass[] = [
    {
      id: '1',
      title: 'Advanced Mindfulness for Stress Management',
      instructor: {
        name: 'Dr. Sarah Chen',
        avatar: '/api/placeholder/150/150',
        bio: 'Leading mindfulness researcher and practitioner'
      },
      description: 'Deep dive into advanced mindfulness techniques specifically designed for managing chronic stress and anxiety.',
      scheduledAt: '2024-02-15T19:00:00Z',
      duration: 90,
      isLive: false,
      isUpcoming: true,
      thumbnailUrl: '/api/placeholder/400/225',
      attendeeCount: 45,
      maxAttendees: 100,
      tags: ['Stress Management', 'Advanced', 'Mindfulness'],
      resources: [
        { title: 'Stress Management Workbook', type: 'worksheet', url: '#' },
        { title: 'Guided Meditation Audio', type: 'audio', url: '#' }
      ]
    },
    {
      id: '2',
      title: 'The Science of Sleep and Meditation',
      instructor: {
        name: 'Dr. Michael Torres',
        avatar: '/api/placeholder/150/150',
        bio: 'Sleep specialist and meditation expert'
      },
      description: 'Understanding how meditation affects sleep quality and learning techniques for better rest.',
      scheduledAt: '2024-02-10T18:00:00Z',
      duration: 75,
      isLive: true,
      isUpcoming: false,
      recordingUrl: '#',
      thumbnailUrl: '/api/placeholder/400/225',
      attendeeCount: 89,
      maxAttendees: 100,
      tags: ['Sleep', 'Science', 'Health'],
      resources: [
        { title: 'Sleep Study Research', type: 'pdf', url: '#' },
        { title: 'Evening Routine Worksheet', type: 'worksheet', url: '#' }
      ]
    }
  ];

  const upcomingClasses = masterclasses.filter(c => c.isUpcoming);
  const pastClasses = masterclasses.filter(c => !c.isUpcoming);
  const liveClasses = masterclasses.filter(c => c.isLive);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MasterclassCard: React.FC<{ masterclass: Masterclass; showJoinButton?: boolean }> = ({ 
    masterclass, 
    showJoinButton = false 
  }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={masterclass.thumbnailUrl} 
          alt={masterclass.title}
          className="w-full h-48 object-cover"
        />
        {masterclass.isLive && (
          <Badge className="absolute top-2 left-2 bg-red-600 text-white">
            <Radio className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        )}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
          {masterclass.duration} min
        </div>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{masterclass.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {masterclass.description}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={masterclass.instructor.avatar} />
            <AvatarFallback>{masterclass.instructor.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{masterclass.instructor.name}</div>
            <div className="text-xs text-muted-foreground">{masterclass.instructor.bio}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(masterclass.scheduledAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{masterclass.attendeeCount}/{masterclass.maxAttendees}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {masterclass.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            {masterclass.resources.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Download className="w-3 h-3" />
                <span>{masterclass.resources.length} resources</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            {showJoinButton && masterclass.isUpcoming && (
              <Button size="sm">
                {masterclass.isLive ? 'Join Live' : 'Register'}
              </Button>
            )}
            {masterclass.recordingUrl && (
              <Button size="sm" variant="outline">
                <Play className="w-4 h-4 mr-1" />
                Watch
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <FeatureGate
      requiredTier="premium"
      featureName="Exclusive Masterclasses"
      featureDescription="Access expert-led masterclasses and interactive learning sessions"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Exclusive Masterclasses</h2>
          <p className="text-muted-foreground">
            Expert-led sessions covering advanced meditation techniques and wellness topics
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingClasses.length})
            </TabsTrigger>
            <TabsTrigger value="live">
              Live ({liveClasses.length})
            </TabsTrigger>
            <TabsTrigger value="recordings">
              Recordings ({pastClasses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingClasses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingClasses.map((masterclass) => (
                  <MasterclassCard 
                    key={masterclass.id} 
                    masterclass={masterclass} 
                    showJoinButton={true}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Masterclasses</h3>
                  <p className="text-muted-foreground">
                    Check back soon for new expert-led sessions and masterclasses.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            {liveClasses.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-800">
                    <Radio className="w-5 h-5" />
                    <span className="font-medium">Live Sessions Available</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Join these live masterclasses happening right now!
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {liveClasses.map((masterclass) => (
                    <MasterclassCard 
                      key={masterclass.id} 
                      masterclass={masterclass} 
                      showJoinButton={true}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Radio className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Live Sessions</h3>
                  <p className="text-muted-foreground">
                    There are no live masterclasses at the moment. Check the upcoming tab for scheduled sessions.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recordings" className="space-y-6">
            {pastClasses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {pastClasses.map((masterclass) => (
                  <MasterclassCard 
                    key={masterclass.id} 
                    masterclass={masterclass}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Recordings Available</h3>
                  <p className="text-muted-foreground">
                    Recordings of past masterclasses will appear here after they're completed.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Interactive Chat Feature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Masterclass Community</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Connect with other Premium Plus members, ask questions, and share insights from masterclasses.
            </p>
            <Button variant="outline" className="w-full">
              Join Community Discussion
            </Button>
          </CardContent>
        </Card>
      </div>
    </FeatureGate>
  );
};

export default MasterclassSystem;
