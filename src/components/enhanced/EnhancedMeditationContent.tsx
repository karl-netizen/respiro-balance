import React, { Suspense } from 'react';
import { useApiCall } from '@/hooks/useAsync';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import LoadingState, { Skeleton } from '@/components/LoadingState';
import ErrorBoundary from '@/components/ErrorBoundary';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MeditationContent {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty_level: string;
  average_rating: number;
  instructor: string;
  thumbnail_url?: string;
}

const MeditationContentSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardHeader className="space-y-3">
          <Skeleton variant="card" className="h-32" />
          <Skeleton lines={2} />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Skeleton variant="button" className="h-6 w-16" />
            <Skeleton variant="button" className="h-6 w-20" />
          </div>
          <Skeleton variant="button" className="w-full h-10" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const MeditationCard: React.FC<{ content: MeditationContent }> = ({ content }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="aspect-video bg-gradient-to-br from-respiro-light/20 to-respiro-default/10 rounded-lg mb-3 flex items-center justify-center">
          <Play className="h-8 w-8 text-respiro-dark opacity-60" />
        </div>
        <CardTitle className="text-lg group-hover:text-respiro-dark transition-colors">
          {content.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {content.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {content.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {content.difficulty_level}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDuration(content.duration)}
          </div>
          {content.average_rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {content.average_rating.toFixed(1)}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            by {content.instructor}
          </p>
          <Button 
            asChild 
            size="sm" 
            className="group-hover:scale-105 transition-transform"
          >
            <Link to={`/meditate/session/${content.id}`}>
              Start
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const EnhancedMeditationContent: React.FC = () => {
  const { data, loading, error, execute } = useApiCall(
    async () => {
      const { data, error } = await supabase
        .from('meditation_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MeditationContent[];
    },
    'meditation_content',
    {
      cacheDuration: 10 * 60 * 1000, // 10 minutes
      retryAttempts: 2,
      refetchOnWindowFocus: true
    }
  );

  const { handleError } = useErrorHandler({
    showToast: true,
    onError: (error) => {
      console.error('Meditation content error:', error);
    }
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Unable to load meditation content
        </p>
        <Button onClick={execute} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <LoadingState
      isLoading={loading}
      fallback={<MeditationContentSkeleton />}
      delay={150}
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Guided Meditation Library
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover a variety of meditation sessions designed to help you find peace, 
            focus, and balance in your daily life.
          </p>
        </div>

        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {data.map((content) => (
              <ErrorBoundary key={content.id} level="component">
                <MeditationCard content={content} />
              </ErrorBoundary>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No meditation content available at the moment.
            </p>
          </div>
        )}
      </div>
    </LoadingState>
  );
};

export default EnhancedMeditationContent;