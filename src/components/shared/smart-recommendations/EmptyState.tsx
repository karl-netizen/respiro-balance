
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface EmptyStateProps {
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ compact = false }) => {
  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      <CardHeader className={compact ? "pb-2" : ""}>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-500" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <Brain className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Keep using the app to get personalized recommendations
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
