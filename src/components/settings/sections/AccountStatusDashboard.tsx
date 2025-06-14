
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const AccountStatusDashboard = () => {
  // Mock account metrics - in real implementation, these would come from API
  const accountMetrics = {
    totalSessions: 127,
    focusTimeHours: 42,
    currentStreak: 7,
    achievements: 15,
    memberSince: 'March 2024',
    accountId: 'usr_****7891'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Account Status
        </CardTitle>
        <CardDescription>
          Your account information and membership details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{accountMetrics.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{accountMetrics.focusTimeHours}h</div>
            <div className="text-sm text-muted-foreground">Focus Time</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{accountMetrics.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{accountMetrics.achievements}</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Member since {accountMetrics.memberSince}</div>
            <div className="text-sm text-muted-foreground">Account ID: {accountMetrics.accountId}</div>
          </div>
          <Badge variant="secondary">Active</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountStatusDashboard;
