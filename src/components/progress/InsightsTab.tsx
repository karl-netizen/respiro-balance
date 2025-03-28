
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const InsightsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meditation Insights</CardTitle>
        <CardDescription>
          Personalized analytics and patterns from your practice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] border rounded-md bg-white p-4 flex items-center justify-center">
          <p className="text-muted-foreground">Monthly trend visualization will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsTab;
