
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Activity } from "lucide-react";

const RecommendationsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
        <CardDescription>
          Based on your progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="bg-secondary/40 p-3 rounded flex items-start">
            <div className="p-1 rounded-full bg-primary/20 mr-2 mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-sm">
              Try a <span className="font-medium">focus meditation</span> tomorrow morning to improve your workday concentration.
            </div>
          </li>
          <li className="bg-secondary/40 p-3 rounded flex items-start">
            <div className="p-1 rounded-full bg-primary/20 mr-2 mt-0.5">
              <Activity className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="text-sm">
              Increase your meditation duration gradually to <span className="font-medium">15 minutes</span> for deeper benefits.
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
