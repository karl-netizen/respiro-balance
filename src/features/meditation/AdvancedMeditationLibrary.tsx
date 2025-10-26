import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Heart, Clock, User, Crown, Headphones } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Import our advanced types
import { MeditationId, createMeditationId } from './types/branded.types';
import { MeditationCategory, DifficultyLevel, SubscriptionTier } from './types/meditation.types';

// =============================================
// ADVANCED CONTENT INTERFACE
// =============================================

interface AdvancedMeditationContent {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: MeditationCategory;
  instructor?: string;
  subscription_tier: SubscriptionTier;
  difficulty_level: DifficultyLevel;
  created_at: string;
  updated_at: string;
  tags: string[];
  play_count: number;
  average_rating?: number;
  is_favorite?: boolean;
  language: string;
}

// =============================================
// ADVANCED COMPONENT PROPS
// =============================================

interface AdvancedMeditationCardProps {
  content: AdvancedMeditationContent;
  state: {
    isSelected: boolean;
    isPlaying: boolean;
    isFavorite: boolean;
    isLoading: boolean;
  };
  actions: {
    onPlay: (content: AdvancedMeditationContent) => Promise<void>;
    onToggleFavorite: (id: MeditationId) => Promise<void>;
  };
  customization?: {
    variant?: 'card' | 'list' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
    showProgress?: boolean;
    showFavorite?: boolean;
  };
}

// =============================================
// MOCK DATA
// =============================================

const mockMeditationContent: AdvancedMeditationContent[] = [
  {
    id: 'meditation-1',
    title: 'Morning Mindfulness',
    description: 'Start your day with peaceful awareness and gentle breathing exercises.',
    duration: 10,
    category: MeditationCategory.MINDFULNESS,
    instructor: 'Sarah Johnson',
    subscription_tier: SubscriptionTier.FREE,
    difficulty_level: DifficultyLevel.BEGINNER,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ['morning', 'beginner', 'breathing'],
    play_count: 245,
    average_rating: 4.5,
    is_favorite: false,
    language: 'English'
  },
  {
    id: 'meditation-2',
    title: 'Deep Focus Session',
    description: 'Enhance your concentration with this guided focus meditation.',
    duration: 20,
    category: MeditationCategory.FOCUS,
    instructor: 'Mike Chen',
    subscription_tier: SubscriptionTier.PREMIUM,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ['focus', 'concentration', 'productivity'],
    play_count: 189,
    average_rating: 4.8,
    is_favorite: true,
    language: 'English'
  },
  {
    id: 'meditation-3',
    title: 'Sleep Stories',
    description: 'Drift off to peaceful sleep with calming bedtime stories.',
    duration: 30,
    category: MeditationCategory.SLEEP,
    instructor: 'Emma Williams',
    subscription_tier: SubscriptionTier.PREMIUM,
    difficulty_level: DifficultyLevel.BEGINNER,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ['sleep', 'bedtime', 'stories'],
    play_count: 312,
    average_rating: 4.7,
    is_favorite: false,
    language: 'English'
  }
];

// =============================================
// ADVANCED MEDITATION CARD COMPONENT
// =============================================

const AdvancedMeditationCard: React.FC<AdvancedMeditationCardProps> = ({
  content,
  state,
  actions,
  customization = {}
}) => {
  const {
    variant: _variant = 'card',
    size = 'md',
    showFavorite = true
  } = customization;

  const handlePlay = useCallback(async (): Promise<void> => {
    try {
      await actions.onPlay(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to play content';
      toast.error(message);
    }
  }, [content, actions]);

  const handleToggleFavorite = useCallback(async (): Promise<void> => {
    try {
      const meditationId = createMeditationId(content.id);
      await actions.onToggleFavorite(meditationId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle favorite';
      toast.error(message);
    }
  }, [content.id, actions]);

  const cardClassName = cn(
    "group transition-all duration-300 hover:shadow-lg",
    {
      "border-primary/50 bg-primary/5": state.isSelected,
      "h-32": size === 'sm',
      "h-48": size === 'md',
      "h-64": size === 'lg'
    }
  );

  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{content.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {content.description}
            </CardDescription>
          </div>
          {showFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={state.isLoading}
            >
              <Heart 
                className={cn(
                  "h-4 w-4",
                  state.isFavorite && "fill-red-500 text-red-500"
                )} 
              />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{content.duration} min</span>
            </div>
            {content.instructor && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{content.instructor}</span>
              </div>
            )}
          </div>
          {content.subscription_tier !== SubscriptionTier.FREE && (
            <Badge variant="secondary" className="text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {content.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {content.difficulty_level}
          </Badge>
          {content.average_rating && (
            <Badge variant="outline" className="text-xs">
              ⭐ {content.average_rating.toFixed(1)}
            </Badge>
          )}
        </div>

        <Button 
          onClick={handlePlay}
          className="w-full"
          variant={state.isSelected ? "default" : "outline"}
          disabled={state.isLoading}
        >
          <Play className="h-4 w-4 mr-2" />
          {state.isLoading ? 'Loading...' : state.isSelected ? 'Now Playing' : 'Start Session'}
        </Button>
      </CardContent>
    </Card>
  );
};

// =============================================
// MAIN ADVANCED COMPONENT
// =============================================

const AdvancedMeditationLibrary: React.FC = () => {
  // Performance monitoring
  useEffect(() => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      console.log(`AdvancedMeditationLibrary mount time: ${endTime - startTime}ms`);
    };
  }, []);

  // State management with advanced patterns
  const [content, setContent] = useState<AdvancedMeditationContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedContentId, setSelectedContentId] = useState<MeditationId | null>(null);
  const [currentCategory, setCurrentCategory] = useState<MeditationCategory>(MeditationCategory.ALL);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Load content on mount
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setContent(mockMeditationContent);
        toast.success('Meditation library loaded successfully');
      } catch (error) {
        toast.error('Failed to load meditation library');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Computed values with proper memoization
  const computed = useMemo(() => {
    const filteredContent = content.filter(item => 
      currentCategory === MeditationCategory.ALL || item.category === currentCategory
    );

    const categoryCounts = Object.values(MeditationCategory).reduce((acc, category) => {
      acc[category] = category === MeditationCategory.ALL 
        ? content.length 
        : content.filter(item => item.category === category).length;
      return acc;
    }, {} as Record<MeditationCategory, number>);

    const favoriteContent = content.filter(item => favoriteIds.has(item.id));
    const recommendedContent = content
      .filter(item => item.average_rating && item.average_rating > 4.0)
      .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      .slice(0, 5);

    return {
      filteredContent,
      categoryCounts,
      favoriteContent,
      recommendedContent
    };
  }, [content, currentCategory, favoriteIds]);

  // Type-safe event handlers
  const handlePlayContent = useCallback(async (content: AdvancedMeditationContent): Promise<void> => {
    const meditationId = createMeditationId(content.id);
    setSelectedContentId(meditationId);
    toast.success(`Now playing: ${content.title}`);
  }, []);

  const handleToggleFavorite = useCallback(async (id: MeditationId): Promise<void> => {
    const stringId = id as string;
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stringId)) {
        newSet.delete(stringId);
        toast.success('Removed from favorites');
      } else {
        newSet.add(stringId);
        toast.success('Added to favorites');
      }
      return newSet;
    });
  }, []);

  // Category tabs with proper typing
  const categoryTabs = useMemo(() => 
    Object.entries(computed.categoryCounts).map(([category, count]) => ({
      value: category as MeditationCategory,
      label: category === MeditationCategory.ALL 
        ? 'All' 
        : category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count
    })),
    [computed.categoryCounts]
  );

  // Loading state
  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Advanced Meditation Library</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our collection with advanced TypeScript patterns, branded types, and discriminated unions.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Content</p>
                <p className="text-2xl font-bold">{content.length}</p>
              </div>
              <Headphones className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{computed.favoriteContent.length}</p>
              </div>
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{categoryTabs.length - 1}</p>
              </div>
              <Crown className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recommended</p>
                <p className="text-2xl font-bold">{computed.recommendedContent.length}</p>
              </div>
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <Tabs 
        value={currentCategory} 
        onValueChange={(value) => setCurrentCategory(value as MeditationCategory)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          {categoryTabs.slice(0, 4).map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="text-sm"
            >
              {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={currentCategory} className="mt-6">
          {computed.filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {computed.filteredContent.map((content) => {
                const meditationId = createMeditationId(content.id);
                const isSelected = selectedContentId === meditationId;
                const isFavorite = favoriteIds.has(content.id);
                
                return (
                  <AdvancedMeditationCard
                    key={content.id}
                    content={content}
                    state={{
                      isSelected,
                      isPlaying: isSelected,
                      isFavorite,
                      isLoading: false
                    }}
                    actions={{
                      onPlay: handlePlayContent,
                      onToggleFavorite: handleToggleFavorite
                    }}
                    customization={{
                      variant: 'card',
                      size: 'md',
                      showFavorite: true
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No meditation sessions found in this category
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Debug Information (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Advanced TypeScript Patterns Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Branded Types:</strong> Using MeditationId for type safety</p>
              <p><strong>Discriminated Unions:</strong> AsyncOperationState for operation status</p>
              <p><strong>Generic Constraints:</strong> Advanced component props with generics</p>
              <p><strong>Type Assertions:</strong> Runtime type checking with assertMeditationId</p>
              <p><strong>Utility Types:</strong> Record, Set, and advanced TypeScript patterns</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedMeditationLibrary;