import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Sparkles, 
  Clock, 
  TrendingUp,
  Play,
  Bookmark,
  Star,
  Zap,
  Moon,
  Sun,
  Coffee
} from 'lucide-react';

interface MeditationContent {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'stress' | 'sleep' | 'focus' | 'anxiety' | 'happiness';
  instructor: string;
  rating: number;
  tags: string[];
  isBookmarked: boolean;
  completionCount: number;
  recommendationScore: number;
  reasonForRecommendation: string;
}

interface UserContext {
  currentMood: 'stressed' | 'anxious' | 'tired' | 'energetic' | 'calm' | 'neutral';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  availableTime: number;
  recentCompletions: string[];
  goals: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
}

interface IntelligentRecommendationsProps {
  userContext: UserContext;
  onStartSession: (content: MeditationContent) => void;
  onBookmark: (contentId: string) => void;
}

const IntelligentRecommendations: React.FC<IntelligentRecommendationsProps> = ({
  userContext,
  onStartSession,
  onBookmark
}) => {
  const [recommendations, setRecommendations] = useState<MeditationContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in a real app, this would come from an AI recommendation engine
  const mockContent: MeditationContent[] = [
    {
      id: '1',
      title: 'Morning Energy Boost',
      description: 'Start your day with focused intention and gentle energy',
      duration: 10,
      difficulty: 'beginner',
      category: 'focus',
      instructor: 'Sarah Chen',
      rating: 4.8,
      tags: ['energizing', 'morning', 'focus'],
      isBookmarked: false,
      completionCount: 0,
      recommendationScore: 95,
      reasonForRecommendation: 'Perfect for your morning routine and energy goals'
    },
    {
      id: '2',
      title: 'Stress Relief in 5 Minutes',
      description: 'Quick tension release for busy moments',
      duration: 5,
      difficulty: 'beginner',
      category: 'stress',
      instructor: 'Marcus Rivera',
      rating: 4.9,
      tags: ['quick', 'stress-relief', 'workplace'],
      isBookmarked: true,
      completionCount: 3,
      recommendationScore: 92,
      reasonForRecommendation: 'Based on your stress management goals and limited time'
    },
    {
      id: '3',
      title: 'Deep Sleep Preparation',
      description: 'Wind down peacefully and prepare for restful sleep',
      duration: 15,
      difficulty: 'intermediate',
      category: 'sleep',
      instructor: 'Luna Rodriguez',
      rating: 4.7,
      tags: ['sleep', 'bedtime', 'relaxation'],
      isBookmarked: false,
      completionCount: 1,
      recommendationScore: 88,
      reasonForRecommendation: 'Helps with your sleep quality goals'
    },
    {
      id: '4',
      title: 'Anxiety Release Breathing',
      description: 'Gentle breathing techniques to ease anxious thoughts',
      duration: 8,
      difficulty: 'beginner',
      category: 'anxiety',
      instructor: 'Dr. James Thompson',
      rating: 4.9,
      tags: ['breathing', 'anxiety', 'calming'],
      isBookmarked: false,
      completionCount: 0,
      recommendationScore: 85,
      reasonForRecommendation: 'Tailored for anxiety management and current mood'
    }
  ];

  const categories = [
    { id: 'all', label: 'For You', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { id: 'stress', label: 'Stress Relief', icon: Heart, color: 'from-red-500 to-orange-500' },
    { id: 'focus', label: 'Focus', icon: Brain, color: 'from-blue-500 to-cyan-500' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: 'from-indigo-500 to-purple-500' },
    { id: 'anxiety', label: 'Anxiety', icon: Zap, color: 'from-green-500 to-teal-500' },
    { id: 'happiness', label: 'Happiness', icon: Sun, color: 'from-yellow-500 to-orange-500' }
  ];

  // Simulate AI recommendation generation
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      let filteredContent = [...mockContent];
      
      // Filter by category
      if (selectedCategory !== 'all') {
        filteredContent = filteredContent.filter(content => content.category === selectedCategory);
      }
      
      // Sort by recommendation score and user context
      filteredContent.sort((a, b) => {
        let scoreA = a.recommendationScore;
        let scoreB = b.recommendationScore;
        
        // Boost score based on user context
        if (userContext.currentMood === 'stressed' && a.category === 'stress') scoreA += 10;
        if (userContext.currentMood === 'stressed' && b.category === 'stress') scoreB += 10;
        
        if (userContext.timeOfDay === 'morning' && a.tags.includes('morning')) scoreA += 5;
        if (userContext.timeOfDay === 'morning' && b.tags.includes('morning')) scoreB += 5;
        
        if (a.duration <= userContext.availableTime) scoreA += 5;
        if (b.duration <= userContext.availableTime) scoreB += 5;
        
        return scoreB - scoreA;
      });
      
      setRecommendations(filteredContent.slice(0, 6));
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, userContext]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getMoodIcon = () => {
    switch (userContext.currentMood) {
      case 'stressed': return <Heart className="w-4 h-4 text-red-500" />;
      case 'anxious': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'tired': return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'energetic': return <Sun className="w-4 h-4 text-orange-500" />;
      default: return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  const getTimeOfDayIcon = () => {
    switch (userContext.timeOfDay) {
      case 'morning': return <Coffee className="w-4 h-4 text-orange-500" />;
      case 'afternoon': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'evening': return <Moon className="w-4 h-4 text-indigo-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Context Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Personalized for You</h2>
          <div className="flex items-center gap-2">
            {getMoodIcon()}
            {getTimeOfDayIcon()}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on your current mood ({userContext.currentMood}), 
          available time ({userContext.availableTime} min), and goals
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Recommendations Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 border hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                        {content.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {content.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onBookmark(content.id)}
                      className="p-1 h-8 w-8"
                    >
                      <Bookmark 
                        className={`w-4 h-4 ${content.isBookmarked ? 'fill-current text-primary' : ''}`} 
                      />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Recommendation reason */}
                    <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-full px-2 py-1">
                      <TrendingUp className="w-3 h-3" />
                      {content.reasonForRecommendation}
                    </div>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{content.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{content.rating}</span>
                      </div>
                    </div>
                    
                    {/* Tags and difficulty */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {content.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Badge className={`text-xs ${getDifficultyColor(content.difficulty)}`}>
                        {content.difficulty}
                      </Badge>
                    </div>
                    
                    {/* Progress indicator if previously completed */}
                    {content.completionCount > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Progress value={100} className="h-1 flex-1" />
                        <span>Completed {content.completionCount}x</span>
                      </div>
                    )}
                    
                    {/* Action button */}
                    <Button 
                      onClick={() => onStartSession(content)}
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      size="sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && recommendations.length === 0 && (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No recommendations yet</h3>
          <p className="text-muted-foreground">
            Complete a few sessions to get personalized recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default IntelligentRecommendations;