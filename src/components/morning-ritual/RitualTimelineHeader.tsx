
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, BarChart3, Bell, Plus } from 'lucide-react';

interface RitualTimelineHeaderProps {
  ritualCount: number;
  onShowAnalytics?: () => void;
  onShowNotificationSettings?: () => void;
  onCreateRitual?: () => void;
}

const RitualTimelineHeader: React.FC<RitualTimelineHeaderProps> = ({
  ritualCount,
  onShowAnalytics,
  onShowNotificationSettings,
  onCreateRitual
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full">
          <Calendar className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Today's Ritual Timeline</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">
              {ritualCount} ritual{ritualCount !== 1 ? 's' : ''} scheduled
            </p>
            <Badge variant="outline" className="text-xs">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onShowAnalytics && (
          <Button
            onClick={onShowAnalytics}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
        )}
        
        {onShowNotificationSettings && (
          <Button
            onClick={onShowNotificationSettings}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </Button>
        )}
        
        {onCreateRitual && (
          <Button
            onClick={onCreateRitual}
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Ritual
          </Button>
        )}
      </div>
    </div>
  );
};

export default RitualTimelineHeader;
