import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Settings, Zap } from 'lucide-react';
import BackButton from '@/components/header/BackButton';

interface FocusPageHeaderProps {
  focusScore?: number;
  onSettingsClick: () => void;
}

export const FocusPageHeader: React.FC<FocusPageHeaderProps> = ({
  focusScore = 85,
  onSettingsClick
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-8 w-8 text-orange-500" />
              <h1 className="text-3xl font-bold">Focus Mode</h1>
            </div>
            <p className="text-muted-foreground">
              Transform your productivity with scientifically-proven focus techniques and comprehensive analytics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Focus Score: {focusScore}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSettingsClick}
          >
            <Settings className="h-4 w-4 mr-2" />
            Focus Mode Settings
          </Button>
        </div>
      </div>
    </div>
  );
};