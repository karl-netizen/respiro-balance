import React, { useState, useEffect } from 'react';
import { useUserPreferences } from "@/context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Coffee, 
  Book, 
  Droplets, 
  PenLine, 
  HeartPulse, 
  ListTodo, 
  Smartphone, 
  Moon, 
  Plus, 
  Info
} from "lucide-react";
import { MorningRitual, RitualRecurrence } from "@/context/types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateRitualId } from "@/components/morning-ritual/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SuggestedRitual {
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  tags: string[];
  category: "mindfulness" | "productivity" | "wellness" | "digital" | "energy";
  timeOffset: number; // minutes after waking
  benefits: string[];
}

const SuggestionsSection = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  
  const morningEnergyLevel = preferences.morningEnergyLevel || 5;
  const wakeTime = preferences.weekdayWakeTime || "07:00";
  
  // Helper function to add minutes to a time string
  const addMinutesToTime = (timeStr: string, minutes: number): string => {
    const [hours, mins] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  // Suggested rituals catalog
  const suggestedRituals: SuggestedRitual[] = [
    {
      title: "Mindful Meditation",
      description: "Start your day with a short meditation session to center yourself and set intentions",
      icon: <Sun className="h-8 w-8 text-amber-500" />,
      duration: 10,
      tags: ["meditation", "mindfulness"],
      category: "mindfulness",
      timeOffset: 5,
      benefits: ["Reduced stress", "Improved focus", "Mental clarity"]
    },
    {
      title: "Hydration Ritual",
      description: "Drink a full glass of water to rehydrate after sleep and kickstart metabolism",
      icon: <Droplets className="h-8 w-8 text-blue-500" />,
      duration: 5,
      tags: ["hydration", "health"],
      category: "wellness",
      timeOffset: 0,
      benefits: ["Metabolism boost", "Hydration", "Brain function"]
    },
    {
      title: "Morning Pages",
      description: "Write three pages of stream-of-consciousness thoughts to clear your mind",
      icon: <PenLine className="h-8 w-8 text-violet-500" />,
      duration: 15,
      tags: ["journaling", "creativity"],
      category: "mindfulness",
      timeOffset: 15,
      benefits: ["Mental clarity", "Creativity boost", "Stress reduction"]
    },
    {
      title: "Gentle Stretching",
      description: "Gentle stretches to wake up your body and increase blood flow",
      icon: <HeartPulse className="h-8 w-8 text-red-500" />,
      duration: 10,
      tags: ["exercise", "stretching"],
      category: "wellness",
      timeOffset: 10,
      benefits: ["Improved circulation", "Reduced stiffness", "Increased energy"]
    },
    {
      title: "Gratitude Practice",
      description: "Write down three things you're grateful for to start the day positively",
      icon: <Book className="h-8 w-8 text-emerald-500" />,
      duration: 5,
      tags: ["gratitude", "journaling"],
      category: "mindfulness",
      timeOffset: 20,
      benefits: ["Positive mindset", "Improved mood", "Resilience"]
    },
    {
      title: "Day Planning",
      description: "Outline your top priorities and schedule for the day",
      icon: <ListTodo className="h-8 w-8 text-indigo-500" />,
      duration: 10,
      tags: ["planning", "productivity"],
      category: "productivity",
      timeOffset: 25,
      benefits: ["Reduced stress", "Better focus", "Improved productivity"]
    },
    {
      title: "Digital Detox",
      description: "Spend the first 30 minutes of your day without looking at screens",
      icon: <Smartphone className="h-8 w-8 text-slate-500" />,
      duration: 30,
      tags: ["digital_wellbeing", "mindfulness"],
      category: "digital",
      timeOffset: 0,
      benefits: ["Reduced anxiety", "Better focus", "Eye health"]
    },
    {
      title: "Morning Coffee Ritual",
      description: "Mindfully prepare and enjoy your first cup of coffee or tea",
      icon: <Coffee className="h-8 w-8 text-yellow-800" />,
      duration: 15,
      tags: ["mindfulness", "energy"],
      category: "energy",
      timeOffset: 10,
      benefits: ["Energy boost", "Mindful pause", "Enjoyment"]
    }
  ];
  
  // Filter rituals based on user preferences
  const filterRitualsByEnergyLevel = (rituals: SuggestedRitual[]) => {
    if (morningEnergyLevel <= 3) {
      // Low energy - suggest gentle, easy rituals
      return rituals.filter(r => 
        r.category === "mindfulness" || 
        r.category === "wellness" ||
        r.duration <= 10
      );
    } else if (morningEnergyLevel >= 8) {
      // High energy - include more active rituals
      return rituals;
    }
    // Medium energy - balanced selection
    return rituals;
  };

  const filteredRituals = filterRitualsByEnergyLevel(suggestedRituals);
  
  // Add a suggested ritual to your morning routine
  const addSuggestedRitual = (ritual: SuggestedRitual) => {
    // Create new ritual object
    const newRitual: MorningRitual = {
      id: generateRitualId(),
      title: ritual.title,
      description: ritual.description,
      timeOfDay: addMinutesToTime(wakeTime, ritual.timeOffset),
      duration: ritual.duration,
      recurrence: "daily" as RitualRecurrence,
      status: "planned",
      streak: 0,
      tags: ritual.tags,
      createdAt: new Date().toISOString() // Use the correct property name 'createdAt' instead of 'created'
    };
    
    // Get current rituals or initialize empty array
    const currentRituals = preferences.morningRituals || [];
    
    // Check if ritual with same title already exists
    const exists = currentRituals.some(r => r.title === ritual.title);
    if (exists) {
      toast({
        title: "Ritual already exists",
        description: "You already have a ritual with this name",
        variant: "destructive"
      });
      return;
    }
    
    // Add new ritual
    updatePreferences({
      morningRituals: [...currentRituals, newRitual]
    });
    
    // Show success message
    toast({
      title: "Ritual added",
      description: `"${ritual.title}" has been added to your morning routine`,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Ritual Suggestions</h2>
        <p className="text-muted-foreground">
          Personalized recommendations based on your morning energy level ({morningEnergyLevel}/10) and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="space-y-8">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRituals.map((ritual, index) => (
              <SuggestionCard 
                key={index} 
                ritual={ritual} 
                onAdd={() => addSuggestedRitual(ritual)} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mindfulness" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRituals
              .filter(r => r.category === "mindfulness")
              .map((ritual, index) => (
                <SuggestionCard 
                  key={index} 
                  ritual={ritual} 
                  onAdd={() => addSuggestedRitual(ritual)} 
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="wellness" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRituals
              .filter(r => r.category === "wellness")
              .map((ritual, index) => (
                <SuggestionCard 
                  key={index} 
                  ritual={ritual} 
                  onAdd={() => addSuggestedRitual(ritual)} 
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="productivity" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRituals
              .filter(r => r.category === "productivity")
              .map((ritual, index) => (
                <SuggestionCard 
                  key={index} 
                  ritual={ritual} 
                  onAdd={() => addSuggestedRitual(ritual)} 
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="energy" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRituals
              .filter(r => r.category === "energy")
              .map((ritual, index) => (
                <SuggestionCard 
                  key={index} 
                  ritual={ritual} 
                  onAdd={() => addSuggestedRitual(ritual)} 
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Reusable Suggestion Card component
interface SuggestionCardProps {
  ritual: SuggestedRitual;
  onAdd: () => void;
}

const SuggestionCard = ({ ritual, onAdd }: SuggestionCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="p-2 rounded-lg bg-primary/5">{ritual.icon}</div>
          <Badge variant="outline">{ritual.duration} min</Badge>
        </div>
        <CardTitle className="mt-3">{ritual.title}</CardTitle>
        <CardDescription>{ritual.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {ritual.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-xs text-muted-foreground cursor-help">
                <Info className="h-3 w-3 mr-1" />
                <span>Benefits</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <ul className="text-xs space-y-1 list-disc pl-4">
                {ritual.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
      
      <CardFooter>
        <Button onClick={onAdd} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add to My Rituals
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestionsSection;
