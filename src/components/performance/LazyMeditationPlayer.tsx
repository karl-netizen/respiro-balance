
import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Lazy load the heavy meditation player component
const MeditationSessionPlayer = lazy(() => import('@/components/meditation/MeditationSessionPlayer'));

interface LazyMeditationPlayerProps {
  session: any;
  onComplete?: () => void;
  onStart?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  biometricData?: {
    focusScore?: number;
    calmScore?: number;
  };
}

const LoadingFallback: React.FC = () => (
  <Card>
    <CardContent className="p-8">
      <div className="flex items-center justify-center space-y-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-muted-foreground">Loading meditation player...</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LazyMeditationPlayer: React.FC<LazyMeditationPlayerProps> = (props) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MeditationSessionPlayer {...props} />
    </Suspense>
  );
};

export default LazyMeditationPlayer;
