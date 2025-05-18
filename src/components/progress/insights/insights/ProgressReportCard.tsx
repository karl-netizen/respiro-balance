
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight } from "lucide-react";
import { useMeditationStats } from "../../useMeditationStats";
import { useAuth } from "@/hooks/useAuth";

const ProgressReportCard = () => {
  const { meditationStats } = useMeditationStats();
  const { user } = useAuth();
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <div className="p-2 rounded-full bg-primary/10 mr-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Meditation Report
        </CardTitle>
        <CardDescription>Generate and share your progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>Total Sessions</span>
            <span className="font-medium">{meditationStats.totalSessions}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span>Weekly Rate</span>
            <span className="font-medium">{meditationStats.completionRate}%</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span>Current Streak</span>
            <span className="font-medium">{meditationStats.streak} days</span>
          </div>
        </div>
        
        <div className="pt-3 border-t">
          <Button variant="outline" className="w-full justify-between">
            <span>View Full Report</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressReportCard;
