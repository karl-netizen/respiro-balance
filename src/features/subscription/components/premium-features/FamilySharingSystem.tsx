
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Users, UserPlus, Shield, Calendar, Award, Settings } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'child' | 'teen';
  age?: number;
  avatar: string;
  joinedAt: Date;
  lastActive: Date;
  meditationStreak: number;
  totalSessions: number;
  restrictions: {
    maxDailyMinutes: number;
    allowedCategories: string[];
    bedTimeRestriction: boolean;
  };
}

export const FamilySharingSystem: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'parent',
      avatar: '👩‍💼',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date(),
      meditationStreak: 15,
      totalSessions: 89,
      restrictions: {
        maxDailyMinutes: 0,
        allowedCategories: [],
        bedTimeRestriction: false
      }
    },
    {
      id: '2',
      name: 'Emma Johnson',
      email: 'emma@example.com',
      role: 'teen',
      age: 16,
      avatar: '👧',
      joinedAt: new Date('2024-02-01'),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      meditationStreak: 7,
      totalSessions: 23,
      restrictions: {
        maxDailyMinutes: 30,
        allowedCategories: ['kids', 'teens', 'stress-relief'],
        bedTimeRestriction: true
      }
    },
    {
      id: '3',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'child',
      age: 12,
      avatar: '👦',
      joinedAt: new Date('2024-02-10'),
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
      meditationStreak: 3,
      totalSessions: 12,
      restrictions: {
        maxDailyMinutes: 20,
        allowedCategories: ['kids', 'bedtime-stories'],
        bedTimeRestriction: true
      }
    }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleInviteMember = () => {
    if (inviteEmail && familyMembers.length < 4) {
      // Simulate sending invite
      console.log('Sending invite to:', inviteEmail);
      setInviteEmail('');
      setShowInviteForm(false);
    }
  };

  const updateMemberRestrictions = (memberId: string, restrictions: any) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, restrictions: { ...member.restrictions, ...restrictions } }
        : member
    ));
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Family Sharing
        </h2>
        <Badge variant="outline" className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          Premium Plus
        </Badge>
      </div>

      {/* Family Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Family Overview</CardTitle>
          <CardDescription>
            Manage your family's meditation journey together ({familyMembers.length}/4 members)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {familyMembers.reduce((sum, member) => sum + member.totalSessions, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Family Sessions</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.max(...familyMembers.map(m => m.meditationStreak))}
              </div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {familyMembers.filter(m => m.meditationStreak > 0).length}
              </div>
              <p className="text-sm text-muted-foreground">Active Streaks</p>
            </div>
          </div>

          {/* Invite New Member */}
          {familyMembers.length < 4 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {showInviteForm ? (
                <div className="space-y-3">
                  <Input
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleInviteMember} size="sm">
                      Send Invite
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowInviteForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowInviteForm(true)}
                  className="w-full border-dashed"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Family Member
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Members */}
      <div className="grid gap-4">
        {familyMembers.map(member => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{member.avatar}</span>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      {member.age && ` • ${member.age} years old`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {formatLastActive(member.lastActive)}
                  </Badge>
                  {member.role === 'parent' && (
                    <Badge variant="default">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {member.meditationStreak} day streak
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    {member.totalSessions} total sessions
                  </span>
                </div>
              </div>

              {/* Parental Controls */}
              {member.role !== 'parent' && (
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4" />
                    <h4 className="font-medium text-sm">Parental Controls</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily time limit</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={member.restrictions.maxDailyMinutes}
                          onChange={(e) => updateMemberRestrictions(member.id, {
                            maxDailyMinutes: parseInt(e.target.value) || 0
                          })}
                          className="w-16 h-8 text-xs"
                          min="0"
                          max="120"
                        />
                        <span className="text-xs">min</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bedtime restrictions</span>
                      <Switch
                        checked={member.restrictions.bedTimeRestriction}
                        onCheckedChange={(checked) => updateMemberRestrictions(member.id, {
                          bedTimeRestriction: checked
                        })}
                      />
                    </div>

                    <div>
                      <span className="text-sm">Allowed categories:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.restrictions.allowedCategories.map(category => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                {member.role === 'parent' && (
                  <Button size="sm" variant="outline">
                    View Family Report
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Family Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Family Goals</CardTitle>
          <CardDescription>
            Set collective meditation goals for your family
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Weekly Family Challenge</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Complete 50 total meditation minutes as a family this week
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>32/50 minutes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: '64%' }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Monthly Streak Goal</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Every family member maintains a 7-day streak
              </p>
              <div className="flex gap-2">
                {familyMembers.map(member => (
                  <div key={member.id} className="text-center">
                    <span className="text-lg">{member.avatar}</span>
                    <div className="text-xs mt-1">
                      {member.meditationStreak >= 7 ? '✅' : `${member.meditationStreak}/7`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
