
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Calendar, 
  Award, 
  Clock, 
  Sparkles, 
  Target, 
  Anchor, 
  Wind, 
  Brain, 
  Sunrise, 
  Footprints,
  Trophy,
  Filter
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  name: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  icon?: string;
  progress?: number;
}

interface AchievementsTabProps {
  achievements: Achievement[];
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Count unlocked achievements for progress calculation
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;
  
  // Get achievement categories
  const categories = [
    { name: 'Consistency', color: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400' },
    { name: 'Duration', color: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' },
    { name: 'Technique', color: 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400' },
    { name: 'Milestone', color: 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400' }
  ];
  
  // Get the icon component based on the icon name
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'award': return <Award />;
      case 'calendar': return <Calendar />;
      case 'target': return <Target />;
      case 'anchor': return <Anchor />;
      case 'wind': return <Wind />;
      case 'brain': return <Brain />;
      case 'sunrise': return <Sunrise />;
      case 'footprints': return <Footprints />;
      case 'clock': return <Clock />;
      case 'trophy': return <Trophy />;
      default: return <Sparkles />;
    }
  };
  
  // Filter achievements based on current filters
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked' && !achievement.unlocked) return false;
    if (filter === 'locked' && achievement.unlocked) return false;
    
    // Category filtering logic would go here - for now we'll assume all achievements match
    return true;
  });
  
  // Get the category for an achievement (mock implementation)
  const getAchievementCategory = (achievement: Achievement): string => {
    if (achievement.name.includes('Streak') || achievement.name.includes('Person')) return 'Consistency';
    if (achievement.name.includes('Minutes') || achievement.name.includes('Deep')) return 'Duration';
    if (achievement.name.includes('Breath') || achievement.name.includes('Focus')) return 'Technique';
    return 'Milestone';
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Progress</CardTitle>
              <CardDescription>Track your meditation journey milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Overall completion</span>
                  <span>{unlockedCount}/{totalCount} achievements</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <h3 className="text-xl font-bold">{unlockedCount}</h3>
                  <p className="text-sm text-muted-foreground">Unlocked</p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4 text-center">
                  <h3 className="text-xl font-bold">{totalCount - unlockedCount}</h3>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
              
              {/* Most recent achievement */}
              {unlockedCount > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-3">Most Recent Achievement</h3>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                          {getIconComponent(achievements.find(a => a.unlocked)?.icon)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{achievements.find(a => a.unlocked)?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {achievements.find(a => a.unlocked)?.description}
                          </p>
                          <div className="text-xs text-primary mt-1">
                            Unlocked {achievements.find(a => a.unlocked)?.unlockedDate}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Achievement categories */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Categories</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(category => (
                    <div 
                      key={category.name}
                      className="border rounded-lg p-3 flex items-center gap-3 hover:bg-secondary/10 transition cursor-pointer"
                      onClick={() => {
                        setCategoryFilter(category.name);
                        setFilter('all');
                      }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${category.color.split(' ')[0]}`}>
                        {category.name === 'Consistency' && <Calendar className="h-4 w-4" />}
                        {category.name === 'Duration' && <Clock className="h-4 w-4" />}
                        {category.name === 'Technique' && <Wind className="h-4 w-4" />}
                        {category.name === 'Milestone' && <Trophy className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {achievements.filter(a => getAchievementCategory(a) === category.name && a.unlocked).length}/
                          {achievements.filter(a => getAchievementCategory(a) === category.name).length} unlocked
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="mb-4 flex justify-between items-center">
            <div className="space-x-2">
              <Button 
                variant={filter === 'all' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'unlocked' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('unlocked')}
              >
                Unlocked
              </Button>
              <Button 
                variant={filter === 'locked' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('locked')}
              >
                Locked
              </Button>
            </div>
            
            {categoryFilter && (
              <Badge 
                variant="outline" 
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setCategoryFilter(null)}
              >
                {categoryFilter}
                <Filter className="h-3 w-3" />
              </Badge>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAchievements.map((achievement, i) => (
              <Card 
                key={i} 
                className={!achievement.unlocked ? "opacity-60" : ""}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    {achievement.unlocked ? (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3 text-white">
                        {getIconComponent(achievement.icon)}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                        <span className="text-foreground/50">?</span>
                      </div>
                    )}
                    {achievement.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 mb-2">
                    {achievement.description}
                  </p>
                  
                  {/* Show progress for locked achievements if progress is available */}
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="mt-2 mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-1.5" />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${getAchievementCategory(achievement) === 'Consistency' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400' : ''}
                          ${getAchievementCategory(achievement) === 'Duration' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' : ''}
                          ${getAchievementCategory(achievement) === 'Technique' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400' : ''}
                          ${getAchievementCategory(achievement) === 'Milestone' ? 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400' : ''}
                        `}
                      >
                        {getAchievementCategory(achievement)}
                      </Badge>
                    </div>
                    
                    {achievement.unlocked ? (
                      <div className="text-sm text-primary font-medium flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        Unlocked
                        {achievement.unlockedDate && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({achievement.unlockedDate})
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Lock className="h-4 w-4 mr-1" />
                        Locked
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Lock icon component
const Lock = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default AchievementsTab;
