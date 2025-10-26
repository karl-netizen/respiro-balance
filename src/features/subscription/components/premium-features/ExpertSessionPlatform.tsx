
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, Star, DollarSign, User } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  totalSessions: number;
  hourlyRate: number;
  avatar: string;
  bio: string;
  availability: string[];
  languages: string[];
}

interface ExpertSession {
  id: string;
  expertId: string;
  expertName: string;
  date: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  sessionType: 'consultation' | 'guided-session' | 'follow-up';
  notes?: string;
}

export const ExpertSessionPlatform: React.FC = () => {
  const [experts] = useState<Expert[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      title: 'Mindfulness & Stress Management Expert',
      specializations: ['Anxiety', 'Workplace Stress', 'MBSR'],
      rating: 4.9,
      totalSessions: 847,
      hourlyRate: 120,
      avatar: '/avatars/dr-chen.jpg',
      bio: 'Dr. Chen is a licensed psychologist with 15 years of experience in mindfulness-based interventions.',
      availability: ['Monday', 'Wednesday', 'Friday'],
      languages: ['English', 'Mandarin']
    },
    {
      id: '2',
      name: 'Marcus Thompson',
      title: 'Meditation Teacher & Life Coach',
      specializations: ['Beginners', 'Life Transitions', 'Emotional Regulation'],
      rating: 4.8,
      totalSessions: 623,
      hourlyRate: 85,
      avatar: '/avatars/marcus.jpg',
      bio: 'Marcus has been teaching meditation for over 10 years and specializes in helping people navigate major life changes.',
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      languages: ['English', 'Spanish']
    },
    {
      id: '3',
      name: 'Priya Patel',
      title: 'Yoga & Breathwork Specialist',
      specializations: ['Breathwork', 'Trauma-Informed', 'Sleep Issues'],
      rating: 4.9,
      totalSessions: 492,
      hourlyRate: 95,
      avatar: '/avatars/priya.jpg',
      bio: 'Priya combines traditional yoga practices with modern neuroscience to help clients achieve deep relaxation.',
      availability: ['Monday', 'Tuesday', 'Thursday'],
      languages: ['English', 'Hindi']
    }
  ]);

  const [sessions] = useState<ExpertSession[]>([
    {
      id: '1',
      expertId: '1',
      expertName: 'Dr. Sarah Chen',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 60,
      status: 'scheduled',
      sessionType: 'consultation'
    },
    {
      id: '2',
      expertId: '2',
      expertName: 'Marcus Thompson',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      duration: 45,
      status: 'completed',
      sessionType: 'guided-session',
      notes: 'Excellent session on handling workplace stress. Recommended daily 10-minute practice.'
    }
  ]);

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showBooking, setShowBooking] = useState(false);

  const handleBookSession = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowBooking(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Video className="h-6 w-6" />
          Expert Sessions
        </h2>
        <Badge variant="outline" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          Premium Plus
        </Badge>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>
            Your scheduled one-on-one sessions with meditation experts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.filter(s => s.status === 'scheduled').length > 0 ? (
            <div className="space-y-3">
              {sessions.filter(s => s.status === 'scheduled').map(session => (
                <div key={session.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                    <div>
                      <h4 className="font-medium">{session.expertName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(session.date)} • {session.duration} minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                    <Button size="sm">
                      <Video className="h-4 w-4 mr-1" />
                      Join Session
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No upcoming sessions scheduled
            </p>
          )}
        </CardContent>
      </Card>

      {/* Expert Marketplace */}
      <Card>
        <CardHeader>
          <CardTitle>Find an Expert</CardTitle>
          <CardDescription>
            Book personalized sessions with certified meditation teachers and therapists
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {experts.map(expert => (
              <div key={expert.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={expert.avatar} alt={expert.name} />
                    <AvatarFallback>
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{expert.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{expert.title}</p>
                    <p className="text-sm mb-3">{expert.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {expert.specializations.map(spec => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{expert.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{expert.totalSessions} sessions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${expert.hourlyRate}/hour</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {expert.languages.map(lang => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                    <Button size="sm" onClick={() => handleBookSession(expert)}>
                      Book Session
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle>Session History</CardTitle>
          <CardDescription>
            Your completed sessions and progress notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.filter(s => s.status === 'completed').length > 0 ? (
            <div className="space-y-3">
              {sessions.filter(s => s.status === 'completed').map(session => (
                <div key={session.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                      <h4 className="font-medium">{session.expertName}</h4>
                    </div>
                    <Badge variant="outline">{session.sessionType}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDate(session.date)} • {session.duration} minutes
                  </p>
                  {session.notes && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{session.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No completed sessions yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Booking Modal */}
      {showBooking && selectedExpert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Book Session with {selectedExpert.name}</CardTitle>
              <CardDescription>
                Select your preferred date and time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Select Date</h4>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Available Times</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map(time => (
                      <Button key={time} variant="outline" size="sm">
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span>Session Duration: 60 minutes</span>
                <span className="font-medium">${selectedExpert.hourlyRate}</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBooking(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Confirm Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
