
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Share2, Award } from 'lucide-react';

const TeamFeatures: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Users className="h-5 w-5" />
          Team Biofeedback Features
          <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium">Team Analytics</div>
              <div className="text-xs text-muted-foreground">Compare stress levels across team</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
            <Share2 className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium">Data Sharing</div>
              <div className="text-xs text-muted-foreground">Optional wellness insights</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
            <Award className="h-4 w-4 text-purple-600" />
            <div>
              <div className="text-sm font-medium">Group Challenges</div>
              <div className="text-xs text-muted-foreground">Collective wellness goals</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
            <Users className="h-4 w-4 text-orange-600" />
            <div>
              <div className="text-sm font-medium">Manager Dashboard</div>
              <div className="text-xs text-muted-foreground">Team wellness overview</div>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button variant="outline" className="w-full text-blue-700 border-blue-300 hover:bg-blue-50">
            Configure Team Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamFeatures;
