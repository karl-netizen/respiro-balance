
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Timer, Calendar } from "lucide-react";

interface LastSessionCardProps {
  lastSession: string;
  lastSessionDate: string;
}

const LastSessionCard: React.FC<LastSessionCardProps> = ({ lastSession, lastSessionDate }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Last Session</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-primary/20 mr-3">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{lastSession}</p>
              <p className="text-xs text-muted-foreground">{lastSessionDate}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-primary/20 mr-3">
              <Timer className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">10 minutes</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">How you felt:</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">😌</span>
              <span className="text-sm">Calm</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastSessionCard;
