
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sunrise, Plus, Lightbulb, ClipboardCheck, BarChart3, Calendar, Cloud } from 'lucide-react';

interface MorningRitualTabsProps {
  hasRituals: boolean;
  children: React.ReactNode;
}

const MorningRitualTabs: React.FC<MorningRitualTabsProps> = ({
  hasRituals,
  children
}) => {
  return (
    <Tabs defaultValue={hasRituals ? "my-rituals" : "create"} className="mt-6">
      <TabsList className="grid w-full max-w-3xl mx-auto mb-8 grid-cols-7">
        <TabsTrigger value="my-rituals" className="flex items-center gap-2">
          <Sunrise className="h-4 w-4" />
          My Rituals
        </TabsTrigger>
        <TabsTrigger value="create" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create
        </TabsTrigger>
        <TabsTrigger value="scheduling" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Scheduling
        </TabsTrigger>
        <TabsTrigger value="weather" className="flex items-center gap-2">
          <Cloud className="h-4 w-4" />
          Weather
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="suggestions" className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          Suggestions
        </TabsTrigger>
        <TabsTrigger value="validation" className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4" />
          Validation
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default MorningRitualTabs;
