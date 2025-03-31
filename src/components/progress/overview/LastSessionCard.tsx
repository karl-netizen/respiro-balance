
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity, BarChart } from "lucide-react";

interface LastSessionCardProps {
  lastSession: string;
  lastSessionDate: string;
}

const LastSessionCard: React.FC<LastSessionCardProps> = ({ lastSession, lastSessionDate }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Last Session</CardTitle>
        <CardDescription>
          {lastSessionDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="bg-primary/10 p-4 rounded-md">
            <h4 className="font-medium">{lastSession}</h4>
            <p className="text-sm text-foreground/70 mt-1">
              15 minute guided meditation
            </p>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <Activity className="h-4 w-4 mr-1 text-primary" />
              Focus increase
            </span>
            <span>+12%</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center">
              <BarChart className="h-4 w-4 mr-1 text-primary" />
              Stress reduction
            </span>
            <span>-15%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastSessionCard;
