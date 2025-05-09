
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Share2, Lock } from 'lucide-react';

export const TeamFeatures: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-sm text-muted-foreground">
          Share your biofeedback data with your wellness team for better insights and coaching.
        </p>
      </div>
      
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start" size="sm">
          <UserPlus className="h-4 w-4 mr-2" /> 
          Invite Team Member
        </Button>
        
        <Button variant="outline" className="w-full justify-start" size="sm">
          <Share2 className="h-4 w-4 mr-2" /> 
          Share Report
        </Button>
        
        <Button variant="outline" className="w-full justify-start" size="sm">
          <Lock className="h-4 w-4 mr-2" /> 
          Privacy Settings
        </Button>
      </div>
      
      <div className="bg-muted/40 p-3 rounded text-xs text-muted-foreground">
        <p>Premium feature: Upgrade your plan for advanced team collaboration features.</p>
      </div>
    </div>
  );
};

export default TeamFeatures;
