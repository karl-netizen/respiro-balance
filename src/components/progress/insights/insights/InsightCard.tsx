
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, description, icon, action }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <div className="p-2 rounded-full bg-primary/10 mr-2">
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="bg-secondary/40 p-3 rounded-md text-sm font-medium">
          Recommendation: {action}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
