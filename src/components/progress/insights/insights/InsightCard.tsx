
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InsightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  relevanceScore?: number; // New prop for personalization
  tags?: string[]; // New prop for categorizing insights
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  title, 
  description, 
  icon, 
  action, 
  relevanceScore = 0,
  tags = []
}) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <div className="p-2 rounded-full bg-primary/10 mr-2">
              {icon}
            </div>
            {title}
          </CardTitle>
          {relevanceScore > 0 && (
            <div className="bg-primary/10 px-2 py-1 rounded-full text-xs font-medium">
              {relevanceScore}% match
            </div>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
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
