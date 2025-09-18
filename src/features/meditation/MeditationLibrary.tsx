import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Heart, Clock, User, Crown, Headphones } from 'lucide-react';
// Import from the hook to use the correct type
import { useMeditationContent, MeditationContent as HookMeditationContent, UserProgress } from '@/hooks/useMeditationContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Import typed interfaces and utilities
import {
  AudioFile,
  LoadingState,
  CategoryTab
} from './types/meditation.types';

// Use the hook's MeditationContent type for compatibility
type ComponentMeditationContent = HookMeditationContent;
import { SupabaseStorageResponse, SupabaseFileObject } from './types/supabase.types';
import { handleError, withErrorHandling } from './utils/errorHandlers';
import { isValidAudioFileType, isValidFileSize } from './utils/typeGuards';

// Types are now imported from dedicated type files

interface LocalLoadingState {
  audioFiles: boolean;
  uploadingFile: boolean;
}

// Lazy-loaded components for better performance
const PremiumBanner = React.lazy(() => import('./components/PremiumBanner'));

// Memoized child components with proper typing
const MeditationCard = React.memo<{
  item: ComponentMeditationContent;
  progress: UserProgress | undefined;
  selectedContent: ComponentMeditationContent | null;
  onPlay: (item: ComponentMeditationContent) => Promise<void>;
  onToggleFavorite: (id: string) => Promise<void>;
}>(({ 
  item, 
  progress, 
  selectedContent, 
  onPlay, 
  onToggleFavorite 
}) => {
  const isSelected = selectedContent?.id === item.id;
  
  const handlePlay = useCallback(async () => {
    try {
      await onPlay(item);
    } catch (error) {
      handleError(error, { 
        component: 'MeditationCard', 
        action: 'play',
        contentId: item.id 
      });
    }
  }, [item, onPlay]);

  const handleToggleFavorite = useCallback(async () => {
    try {
      await onToggleFavorite(item.id);
    } catch (error) {
      handleError(error, { 
        component: 'MeditationCard', 
        action: 'toggleFavorite',
        contentId: item.id 
      });
    }
  }, [item.id, onToggleFavorite]);
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {item.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                progress?.is_favorite && "fill-red-500 text-red-500"
              )} 
            />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{item.duration} min</span>
            </div>
            {item.instructor && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{item.instructor}</span>
              </div>
            )}
          </div>
          {item.subscription_tier !== 'free' && (
            <Badge variant="secondary" className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {item.difficulty_level}
          </Badge>
        </div>
        
        {progress && progress.progress_seconds > 0 && (
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ 
                width: `${Math.min((progress.progress_seconds / (item.duration * 60)) * 100, 100)}%`
              }}
            />
          </div>
        )}

        <Button 
          onClick={handlePlay}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant={isSelected ? "default" : "outline"}
        >
          <Play className="h-4 w-4 mr-2" />
          {isSelected ? 'Now Playing' : 'Start Session'}
        </Button>
      </CardContent>
    </Card>
  );
});

const AudioFileItem = React.memo<{
  file: AudioFile;
  onPlay: (file: AudioFile) => void;
}>(({ file, onPlay }) => {
  const handlePlay = useCallback(() => {
    try {
      onPlay(file);
    } catch (error) {
      handleError(error, { 
        component: 'AudioFileItem', 
        action: 'play' 
      });
    }
  }, [file, onPlay]);

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <Play className="h-4 w-4 text-primary" />
        <div>
          <p className="font-medium">{file.name.replace(/\.[^/.]+$/, "")}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / (1024 * 1024)).toFixed(1)} MB
          </p>
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={handlePlay}>
        Play
      </Button>
    </div>
  );
});

const CategoryTabs = React.memo<{
  categories: CategoryTab[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}>(({ categories, selectedCategory, onCategoryChange }) => (
  <TabsList className="grid w-full grid-cols-5">
    {categories.map((tab) => (
      <TabsTrigger 
        key={tab.value} 
        value={tab.value} 
        className="text-sm"
        onClick={() => onCategoryChange(tab.value)}
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
));

const NowPlayingCard = React.memo<{ 
  content: ComponentMeditationContent;
}>(({ content }) => (
  <Card className="border-primary/50 bg-primary/5">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Play className="h-5 w-5 text-primary" />
        Now Playing: {content.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">{content.description}</p>
      <div className="flex items-center gap-4 text-sm">
        <span>Duration: {content.duration} minutes</span>
        <span>Category: {content.category}</span>
        {content.instructor && <span>Instructor: {content.instructor}</span>}
      </div>
    </CardContent>
  </Card>
));

const LoadingSkeleton = React.memo(() => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded-md w-1/3 mb-4"></div>
      <div className="h-4 bg-muted rounded-md w-2/3 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-muted rounded-lg"></div>
        ))}
      </div>
    </div>
  </div>
));

// Custom hook for loading state management with proper typing
const useLoadingState = () => {
  const [loading, setLoading] = useState<LocalLoadingState>({
    audioFiles: false,
    uploadingFile: false
  });

  const setLoadingState = useCallback((key: keyof LocalLoadingState, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  return { loading, setLoadingState };
};

// Custom hook for audio file management with comprehensive typing
const useAudioFiles = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const { loading, setLoadingState } = useLoadingState();

  const fetchAudioFiles = useCallback(async (): Promise<void> => {
    await withErrorHandling(async () => {
      setLoadingState('audioFiles', true);
      
      const { data, error }: SupabaseStorageResponse = await supabase.storage
        .from('meditation-audio')
        .list('', {
          limit: 100,
          offset: 0
        });

      if (error) throw error;
      if (!data) return;

      const audioFilesData: AudioFile[] = await Promise.all(
        data.map(async (file: SupabaseFileObject): Promise<AudioFile> => {
          const { data: signedUrl } = await supabase.storage
            .from('meditation-audio')
            .createSignedUrl(file.name, 60 * 60 * 24);

          return {
            id: file.id || crypto.randomUUID(),
            name: file.name,
            url: signedUrl?.signedUrl || '',
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'audio/unknown',
            uploadDate: new Date(file.created_at || Date.now()),
            isProcessing: false
          };
        })
      );

      setAudioFiles(audioFilesData);
      console.log('✅ Loaded audio files from Supabase:', audioFilesData.length);
    }, { component: 'useAudioFiles', action: 'fetchAudioFiles' })();
    
    setLoadingState('audioFiles', false);
  }, [setLoadingState]);

  useEffect(() => {
    fetchAudioFiles();
  }, [fetchAudioFiles]);

  return { 
    audioFiles, 
    loading: loading.audioFiles, 
    refetch: fetchAudioFiles 
  };
};

// Main component
const MeditationLibrary: React.FC = () => {
  // Performance measurement
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      console.log(`MeditationLibrary mount time: ${endTime - startTime}ms`);
    };
  }, []);

  const { 
    content, 
    categories, 
    isLoading, 
    getContentByCategory, 
    toggleFavorite, 
    getProgressForContent,
    incrementPlayCount
  } = useMeditationContent();
  
  const { audioFiles, loading: audioLoading } = useAudioFiles();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedContent, setSelectedContent] = useState<ComponentMeditationContent | null>(null);

  // Memoized filtered content to prevent unnecessary recalculations
  const filteredContent = useMemo(() => {
    if (selectedCategory === 'all') return content;
    return getContentByCategory(selectedCategory);
  }, [content, selectedCategory, getContentByCategory]);

  // Memoized category tabs with proper typing to prevent recalculation
  const categoryTabs = useMemo((): CategoryTab[] => [
    { value: 'all', label: 'All Sessions', count: content.length },
    { value: 'guided', label: 'Guided', count: getContentByCategory('Mindfulness').length },
    { value: 'quick', label: 'Quick Breaks', count: getContentByCategory('Focus').length },
    { value: 'deep', label: 'Deep Focus', count: getContentByCategory('Body Scan').length },
    { value: 'sleep', label: 'Sleep', count: getContentByCategory('Sleep').length }
  ], [content.length, getContentByCategory]);

  // Memoized event handlers with proper error handling
  const handlePlayContent = useCallback(async (contentItem: ComponentMeditationContent): Promise<void> => {
    await withErrorHandling(async () => {
      setSelectedContent(contentItem);
      await incrementPlayCount(contentItem.id);
      toast.success(`Playing: ${contentItem.title}`);
    }, { 
      component: 'MeditationLibrary', 
      action: 'playContent',
      contentId: contentItem.id 
    })();
  }, [incrementPlayCount]);

  const handleToggleFavorite = useCallback(async (contentId: string): Promise<void> => {
    await withErrorHandling(async () => {
      await toggleFavorite(contentId);
    }, { 
      component: 'MeditationLibrary', 
      action: 'toggleFavorite',
      contentId 
    })();
  }, [toggleFavorite]);

  const handleCategoryChange = useCallback((category: string): void => {
    setSelectedCategory(category);
  }, []);

  const handlePlayAudioFile = useCallback((file: AudioFile): void => {
    try {
      toast.success(`Playing: ${file.name}`);
      console.log('Playing audio file:', file);
    } catch (error) {
      handleError(error, { 
        component: 'MeditationLibrary', 
        action: 'playAudioFile' 
      });
    }
  }, []);

  // Early return for loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Meditation Library</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our diverse collection of guided meditations, quick breaks, and deep focus sessions
          designed to help you find balance in your busy day.
        </p>
      </div>

      {/* Lazy-loaded Premium Banner */}
      <Suspense fallback={<div className="h-24 bg-muted animate-pulse rounded-lg" />}>
        <PremiumBanner />
      </Suspense>

      {/* Audio Files from Supabase Storage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Audio Files from Storage
          </CardTitle>
          <CardDescription>
            {audioLoading ? 'Loading audio files...' : `${audioFiles.length} audio files available`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audioLoading ? (
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : audioFiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {audioFiles.map((file, index) => (
                <AudioFileItem 
                  key={`${file.name}-${index}`}
                  file={file} 
                  onPlay={handlePlayAudioFile}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No audio files found in storage bucket
            </p>
          )}
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
        <CategoryTabs
          categories={categoryTabs}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        <TabsContent value={selectedCategory} className="mt-6">
          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => {
                const progress = getProgressForContent(item.id);
                
                return (
                  <MeditationCard
                    key={item.id}
                    item={item}
                    progress={progress}
                    selectedContent={selectedContent}
                    onPlay={handlePlayContent}
                    onToggleFavorite={handleToggleFavorite}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {selectedCategory === 'sleep' 
                  ? 'No sleep meditations available' 
                  : `No ${selectedCategory} sessions found`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Now Playing Card */}
      {selectedContent && (
        <NowPlayingCard content={selectedContent} />
      )}
    </div>
  );
};

// Set display name for debugging
MeditationLibrary.displayName = 'MeditationLibrary';

export default MeditationLibrary;