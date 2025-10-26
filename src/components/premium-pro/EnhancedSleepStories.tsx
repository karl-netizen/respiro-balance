
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Moon, Play, Pause, Timer, Star, Volume2 } from 'lucide-react';

interface SleepStory {
  id: string;
  title: string;
  narrator: string;
  duration: number;
  category: string;
  description: string;
  rating: number;
  plays: number;
  audioUrl: string;
  imageUrl: string;
  premium: boolean;
}

export const EnhancedSleepStories: React.FC = () => {
  const [stories] = useState<SleepStory[]>([
    {
      id: '1',
      title: 'Enchanted Forest Journey',
      narrator: 'Sarah Mitchell',
      duration: 1800, // 30 minutes
      category: 'Nature',
      description: 'A peaceful walk through a magical forest with gentle sounds of nature',
      rating: 4.8,
      plays: 15420,
      audioUrl: '/audio/forest-journey.mp3',
      imageUrl: '/images/forest.jpg',
      premium: false
    },
    {
      id: '2',
      title: 'Ocean Waves Meditation',
      narrator: 'David Chen',
      duration: 2400, // 40 minutes
      category: 'Ocean',
      description: 'Drift away with the rhythmic sounds of ocean waves on a secluded beach',
      rating: 4.9,
      plays: 23100,
      audioUrl: '/audio/ocean-waves.mp3',
      imageUrl: '/images/ocean.jpg',
      premium: true
    },
    {
      id: '3',
      title: 'Mountain Cabin Retreat',
      narrator: 'Emma Thompson',
      duration: 2100, // 35 minutes
      category: 'Mountains',
      description: 'Cozy up in a warm mountain cabin with crackling fireplace sounds',
      rating: 4.7,
      plays: 18750,
      audioUrl: '/audio/mountain-cabin.mp3',
      imageUrl: '/images/cabin.jpg',
      premium: true
    },
    {
      id: '4',
      title: 'Ancient Library Tales',
      narrator: 'Professor Williams',
      duration: 3000, // 50 minutes
      category: 'Fantasy',
      description: 'Discover mystical stories in an ancient library filled with wisdom',
      rating: 4.6,
      plays: 12300,
      audioUrl: '/audio/ancient-library.mp3',
      imageUrl: '/images/library.jpg',
      premium: true
    },
    {
      id: '5',
      title: 'Desert Oasis Dreams',
      narrator: 'Layla Hassan',
      duration: 2700, // 45 minutes
      category: 'Desert',
      description: 'Journey to a peaceful oasis under the starlit desert sky',
      rating: 4.8,
      plays: 9870,
      audioUrl: '/audio/desert-oasis.mp3',
      imageUrl: '/images/desert.jpg',
      premium: true
    }
  ]);

  const [currentStory, setCurrentStory] = useState<SleepStory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sleepTimer, setSleepTimer] = useState(30); // minutes
  const [volume, setVolume] = useState(70);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Nature', 'Ocean', 'Mountains', 'Fantasy', 'Desert'];

  const filteredStories = selectedCategory === 'All' 
    ? stories 
    : stories.filter(story => story.category === selectedCategory);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const handlePlayStory = (story: SleepStory) => {
    setCurrentStory(story);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePauseStory = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStory) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentStory.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStory]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Moon className="h-6 w-6" />
          Sleep Stories
        </h2>
        <Badge variant="outline" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          Premium Pro
        </Badge>
      </div>

      {/* Sleep Timer & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Sleep Timer & Audio Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sleep Timer (minutes)</label>
              <Slider
                value={[sleepTimer]}
                onValueChange={(value) => setSleepTimer(value[0])}
                max={120}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground mt-1">
                Audio will fade out after {sleepTimer} minutes
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Volume
              </label>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground mt-1">
                Current volume: {volume}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Playing Story */}
      {currentStory && (
        <Card>
          <CardHeader>
            <CardTitle>Now Playing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Moon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{currentStory.title}</h3>
                <p className="text-sm text-muted-foreground">by {currentStory.narrator}</p>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / currentStory.duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(currentStory.duration)}</span>
                </div>
              </div>
              <Button
                onClick={isPlaying ? handlePauseStory : () => setIsPlaying(true)}
                size="lg"
                className="rounded-full w-12 h-12"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStories.map(story => (
          <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Moon className="h-12 w-12 text-white" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{story.title}</h3>
                {story.premium && (
                  <Badge variant="secondary" className="text-xs">Pro</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">by {story.narrator}</p>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {story.description}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>{formatDuration(story.duration)}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{story.rating}</span>
                </div>
              </div>
              <Button 
                onClick={() => handlePlayStory(story)}
                size="sm" 
                className="w-full"
                disabled={currentStory?.id === story.id && isPlaying}
              >
                {currentStory?.id === story.id && isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Playing
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
