
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Trophy, Medal, Award, Filter, Check } from "lucide-react";
import { Achievement } from '@/types/achievements';
import { AchievementCard } from './index';
import LucideIcon from '@/components/LucideIcon';

interface AchievementsTabProps {
  achievements: Achievement[];
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  
  // Count unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completionPercentage = Math.round((unlockedCount / achievements.length) * 100);
  
  // Filter achievements based on search and unlocked filter
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = 
      achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showUnlockedOnly) {
      return matchesSearch && achievement.unlocked;
    }
    
    return matchesSearch;
  });
  
  // Handle achievement selection
  const handleSelectAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="text"
            placeholder="Search achievements..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant={showUnlockedOnly ? "default" : "outline"}
          onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
        >
          <Trophy className="h-4 w-4 mr-2" />
          {showUnlockedOnly ? "Show All" : "Show Unlocked Only"}
        </Button>
      </div>
      
      <div className="bg-card p-6 rounded-lg border mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-3">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Total Achievements</h3>
              <p className="text-2xl font-bold">{achievements.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Unlocked</h3>
              <p className="text-2xl font-bold">{unlockedCount}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-900 rounded-full p-3">
              <Medal className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Completion</h3>
              <p className="text-2xl font-bold">{completionPercentage}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <AchievementCard 
              key={achievement.id} 
              achievement={achievement} 
              onClick={() => handleSelectAchievement(achievement)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground opacity-40" />
          <h3 className="mt-4 text-lg font-medium">No achievements found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? "Try a different search term" 
              : showUnlockedOnly 
                ? "You haven't unlocked any achievements yet" 
                : "No achievements available"}
          </p>
        </div>
      )}
      
      {/* Achievement detail dialog */}
      <Dialog open={!!selectedAchievement} onOpenChange={(open) => !open && setSelectedAchievement(null)}>
        {selectedAchievement && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className={selectedAchievement.unlocked 
                    ? "bg-primary/10 p-2 rounded-full" 
                    : "bg-gray-200 dark:bg-gray-800 p-2 rounded-full"
                  }
                >
                  <LucideIcon
                    name={selectedAchievement.icon} 
                    className={selectedAchievement.unlocked 
                      ? "h-6 w-6 text-primary" 
                      : "h-6 w-6 text-muted-foreground"
                    }
                  />
                </div>
                {selectedAchievement.unlocked && (
                  <div className="bg-green-100 dark:bg-green-900 p-1 rounded-full">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                )}
              </div>
              <DialogTitle>{selectedAchievement.name}</DialogTitle>
              <DialogDescription>
                {selectedAchievement.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{selectedAchievement.progress}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedAchievement.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {selectedAchievement.unlocked ? (
                <div className="bg-primary/10 p-4 rounded-md">
                  <h4 className="font-medium mb-1">Achievement Unlocked!</h4>
                  <p className="text-sm text-muted-foreground">
                    You unlocked this achievement {selectedAchievement.unlockedDate}.
                  </p>
                </div>
              ) : (
                <div className="bg-secondary/30 p-4 rounded-md">
                  <h4 className="font-medium mb-1">Keep Going!</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAchievement.progress > 0 
                      ? `You're ${selectedAchievement.progress}% of the way to unlocking this achievement.`
                      : "Start working towards this achievement by continuing your meditation practice."}
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setSelectedAchievement(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AchievementsTab;
