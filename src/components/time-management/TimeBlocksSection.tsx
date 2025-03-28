
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Clock, Calendar } from "lucide-react";
import TimeBlocksContainer from "./TimeBlocksContainer";
import { TimeBlockProps } from "./TimeBlock";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimeBlocksSectionProps {
  blocks: TimeBlockProps[];
  onBlockClick: (blockId: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TimeBlocksSection = ({ 
  blocks, 
  onBlockClick, 
  activeTab, 
  setActiveTab 
}: TimeBlocksSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2 md:pb-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <CardTitle className="text-lg md:text-xl">Time Blocks</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Your scheduled activities for {activeTab === "today" ? "today" : "this week"}
            </CardDescription>
          </div>
          <Button size={isMobile ? "sm" : "default"} className="self-end md:self-auto">
            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" /> Add Block
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-3 md:px-6 pt-2 pb-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="today" className="flex items-center text-xs md:text-sm py-1 md:py-2">
                <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Daily View
              </TabsTrigger>
              <TabsTrigger value="week" className="flex items-center text-xs md:text-sm py-1 md:py-2">
                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" /> Weekly Overview
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="today" className="pt-2 md:pt-4">
            <TimeBlocksContainer 
              blocks={blocks} 
              onBlockClick={onBlockClick}
              startHour={7}
              endHour={20}
            />
          </TabsContent>
          
          <TabsContent value="week" className="pt-2 md:pt-4">
            <div className="px-3 md:px-6 pb-2 md:pb-4">
              <p className="text-xs md:text-sm text-muted-foreground">
                Weekly view shows your time allocation across different categories.
              </p>
            </div>
            <div className="px-3 md:px-6 pb-4 md:pb-6">
              <div className="h-[200px] md:h-[300px] border rounded bg-white p-2 md:p-4 flex items-center justify-center">
                <p className="text-xs md:text-sm text-muted-foreground">Weekly view visualization will appear here.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TimeBlocksSection;
