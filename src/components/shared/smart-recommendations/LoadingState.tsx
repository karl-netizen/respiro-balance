
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { MobileSkeleton } from '@/components/ui/mobile-skeleton';

interface LoadingStateProps {
  compact?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ compact = false }) => {
  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      <CardHeader className={compact ? "pb-2" : ""}>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-500" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <MobileSkeleton variant="text" className="w-3/4 mb-2" />
              <MobileSkeleton variant="text" className="w-1/2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
