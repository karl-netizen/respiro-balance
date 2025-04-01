
import React, { useState, useEffect } from "react";
import { MorningRitual, RitualStatus } from "@/context/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, CheckCircle2, XCircle, CircleDashed, Edit, Trash2, Trophy } from "lucide-react";
import { formatTimeDisplay, shouldDoRitualToday } from "./utils";
import RitualEditDialog from "./RitualEditDialog";
import { useToast } from "@/hooks/use-toast";

interface RitualTimelineItemProps {
  ritual: MorningRitual;
  onComplete: (ritualId: string) => void;
  onDelete: (ritualId: string) => void;
  onUpdate: (updatedRitual: MorningRitual) => void;
}

const RitualTimelineItem: React.FC<RitualTimelineItemProps> = ({ 
  ritual, 
  onComplete, 
  onDelete,
  onUpdate
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isToday, setIsToday] = useState(false);
  const { toast } = useToast();

  // Check if ritual should be completed today
  useEffect(() => {
    setIsToday(shouldDoRitualToday(ritual.recurrence, ritual.daysOfWeek));
  }, [ritual]);

  const getStatusIcon = (status: RitualStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <CircleDashed className="h-5 w-5 text-amber-500" />;
      case "missed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };
  
  const getStatusBadge = (status: RitualStatus) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
      case "missed":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Missed</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Planned</Badge>;
    }
  };
  
  const getRecurrenceText = (ritual: MorningRitual) => {
    switch (ritual.recurrence) {
      case "daily":
        return "Every day";
      case "weekdays":
        return "Monday-Friday";
      case "weekends":
        return "Saturday-Sunday";
      case "custom":
        return ritual.daysOfWeek?.map(day => day.slice(0, 3)).join(', ') || "Custom";
      default:
        return "Custom";
    }
  };

  const handleComplete = () => {
    if (!isToday && ritual.status !== "completed") {
      toast({
        title: "Not scheduled for today",
        description: "This ritual is not scheduled for today based on its recurrence pattern.",
        variant: "default"
      });
    }
    
    onComplete(ritual.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this ritual?")) {
      onDelete(ritual.id);
    }
  };

  return (
    <>
      <div className="flex gap-4">
        <div className="mt-1.5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            ritual.status === "completed" ? "bg-green-100" : 
            ritual.status === "missed" ? "bg-red-100" :
            "bg-primary/10"
          }`}>
            {getStatusIcon(ritual.status)}
          </div>
        </div>
        
        <Card className={`flex-1 shadow-sm hover:shadow transition-shadow ${
          ritual.status === "completed" ? "border-green-200" : 
          ritual.status === "missed" ? "border-red-200" : ""
        }`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{ritual.title}</CardTitle>
                <CardDescription>{ritual.description || "No description"}</CardDescription>
              </div>
              <div>
                {getStatusBadge(ritual.status)}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{formatTimeDisplay(ritual.timeOfDay)} • {ritual.duration} min</span>
              </div>
              
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{getRecurrenceText(ritual)}</span>
                {isToday && ritual.status !== "completed" && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">Today</Badge>
                )}
              </div>
              
              <div className="flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{ritual.streak} day streak</span>
              </div>
            </div>
            
            {ritual.tags && ritual.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {ritual.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleComplete}
                  className={ritual.status === "completed" ? "bg-green-50" : ""}
                >
                  {ritual.status === "completed" ? "Undo Complete" : "Mark Complete"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <RitualEditDialog 
        ritual={ritual}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={onUpdate}
      />
    </>
  );
};

export default RitualTimelineItem;
