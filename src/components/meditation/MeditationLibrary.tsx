import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMeditationContent } from '@/hooks/useMeditationContent';
import { MeditationCard } from '@/components/meditation/MeditationCard';
import { AudioPlayer } from '@/components/meditation/AudioPlayer';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Play,
  TrendingUp,
  Star,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MeditationLibrary = () => {
  const {
    content,
    categories,
    isLoading,
    hasAccessToContent,
    getContentByCategory,
    getFeaturedContent,
    incrementPlayCount,
    updateProgress,
    toggleFavorite,
    rateContent,
    getProgressForContent
  } = useMeditationContent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<any>(null);

  // Filter and sort content
  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || item.difficulty_level === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'duration':
        return a.duration - b.duration;
      case 'play_count':
        return b.play_count - a.play_count;
      case 'rating':
        return b.average_rating - a.average_rating;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handlePlay = (contentItem: any) => {
    setCurrentlyPlaying(contentItem);
    incrementPlayCount(contentItem.id);
  };

  const handleProgress = (progressSeconds: number) => {
    if (currentlyPlaying) {
      updateProgress(currentlyPlaying.id, progressSeconds);
    }
  };

  const handleComplete = () => {
    if (currentlyPlaying) {
      updateProgress(currentlyPlaying.id, currentlyPlaying.duration, true);
    }
  };

  const handleClosePlayer = () => {
    setCurrentlyPlaying(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Currently Playing */}
      {currentlyPlaying && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-background/95 backdrop-blur border-t">
          <AudioPlayer
            content={currentlyPlaying}
            onProgress={handleProgress}
            onComplete={handleComplete}
            onClose={handleClosePlayer}
          />
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Meditation Library
          </CardTitle>
          <CardDescription>
            Discover guided meditations, breathing exercises, and mindfulness practices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search meditations, instructors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              <option value="created_at">Newest First</option>
              <option value="title">Alphabetical</option>
              <option value="duration">Duration</option>
              <option value="play_count">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Sessions</p>
                <p className="text-xl font-bold">{content.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Featured</p>
                <p className="text-xl font-bold">{getFeaturedContent().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Duration</p>
                <p className="text-xl font-bold">
                  {Math.round(content.reduce((acc, item) => acc + item.duration, 0) / 60)} min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Categories</p>
                <p className="text-xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredContent.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No content found matching your criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            )}>
              {filteredContent.map(item => (
                <MeditationCard
                  key={item.id}
                  content={item}
                  userProgress={getProgressForContent(item.id)}
                  hasAccess={hasAccessToContent(item)}
                  onPlay={handlePlay}
                  onToggleFavorite={toggleFavorite}
                  onRate={rateContent}
                  className={viewMode === 'list' ? 'max-w-none' : ''}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured">
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}>
            {getFeaturedContent().map(item => (
              <MeditationCard
                key={item.id}
                content={item}
                userProgress={getProgressForContent(item.id)}
                hasAccess={hasAccessToContent(item)}
                onPlay={handlePlay}
                onToggleFavorite={toggleFavorite}
                onRate={rateContent}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="space-y-8">
            {categories.map(category => {
              const categoryContent = getContentByCategory(category.name);
              if (categoryContent.length === 0) return null;

              return (
                <div key={category.id}>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    {category.name}
                    <Badge variant="secondary">{categoryContent.length}</Badge>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryContent.slice(0, 6).map(item => (
                      <MeditationCard
                        key={item.id}
                        content={item}
                        userProgress={getProgressForContent(item.id)}
                        hasAccess={hasAccessToContent(item)}
                        onPlay={handlePlay}
                        onToggleFavorite={toggleFavorite}
                        onRate={rateContent}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};