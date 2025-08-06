import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Heart, Clock, User, Crown, Headphones } from 'lucide-react';
import { useMeditationContent } from '@/hooks/useMeditationContent';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AudioFile {
  name: string;
  url: string;
  size: number;
}

const MeditationLibrary = () => {
  const { 
    content, 
    categories, 
    isLoading, 
    getContentByCategory, 
    toggleFavorite, 
    getProgressForContent,
    incrementPlayCount
  } = useMeditationContent();
  
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [audioLoading, setAudioLoading] = useState(false);

  // Fetch audio files from Supabase storage
  const fetchAudioFiles = async () => {
    try {
      setAudioLoading(true);
      const { data, error } = await supabase.storage
        .from('meditation-audio')
        .list('', {
          limit: 100,
          offset: 0
        });

      if (error) throw error;

      const audioFilesData = await Promise.all(
        (data || []).map(async (file) => {
          const { data: signedUrl } = await supabase.storage
            .from('meditation-audio')
            .createSignedUrl(file.name, 60 * 60 * 24); // 24 hours

          return {
            name: file.name,
            url: signedUrl?.signedUrl || '',
            size: file.metadata?.size || 0
          };
        })
      );

      setAudioFiles(audioFilesData);
      console.log('✅ Loaded audio files from Supabase:', audioFilesData.length);
    } catch (error) {
      console.error('Failed to fetch audio files:', error);
      toast.error('Failed to load audio files from storage');
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const filteredContent = selectedCategory === 'all' 
    ? content 
    : getContentByCategory(selectedCategory);

  const categoryTabs = [
    { value: 'all', label: 'All Sessions', count: content.length },
    { value: 'guided', label: 'Guided', count: getContentByCategory('Mindfulness').length },
    { value: 'quick', label: 'Quick Breaks', count: getContentByCategory('Focus').length },
    { value: 'deep', label: 'Deep Focus', count: getContentByCategory('Body Scan').length },
    { value: 'sleep', label: 'Sleep', count: getContentByCategory('Sleep').length }
  ];

  const handlePlayContent = async (contentItem: any) => {
    setSelectedContent(contentItem);
    await incrementPlayCount(contentItem.id);
    toast.success(`Playing: ${contentItem.title}`);
  };

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
        <h1 className="text-4xl font-bold text-foreground">Meditation Library</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our diverse collection of guided meditations, quick breaks, and deep focus sessions
          designed to help you find balance in your busy day.
        </p>
      </div>

      {/* Premium Upgrade Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Crown className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">Upgrade to Premium</h3>
              <p className="text-muted-foreground">
                Unlock advanced analytics, data export, and more meditation content.
              </p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            View Plans
          </Button>
        </CardContent>
      </Card>

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
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Play className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{file.name.replace(/\.[^/.]+$/, "")}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Play
                  </Button>
                </div>
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
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categoryTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => {
                const progress = getProgressForContent(item.id);
                
                return (
                  <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
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
                          onClick={() => toggleFavorite(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart 
                            className={`h-4 w-4 ${progress?.is_favorite ? 'fill-red-500 text-red-500' : ''}`} 
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
                        onClick={() => handlePlayContent(item)}
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant={selectedContent?.id === item.id ? "default" : "outline"}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {selectedContent?.id === item.id ? 'Now Playing' : 'Start Session'}
                      </Button>
                    </CardContent>
                  </Card>
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

      {/* Selected Content Player */}
      {selectedContent && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Now Playing: {selectedContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{selectedContent.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span>Duration: {selectedContent.duration} minutes</span>
              <span>Category: {selectedContent.category}</span>
              <span>Instructor: {selectedContent.instructor}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeditationLibrary;