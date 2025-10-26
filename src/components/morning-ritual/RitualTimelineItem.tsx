
import React, { useState } from "react";
import { MorningRitual } from "@/context/types";
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
import RitualEditDialog from "./RitualEditDialog";
import RitualStatusIcon from "./RitualStatusIcon";
import RitualStatusBadge from "./RitualStatusBadge";
import RitualMetadata from "./RitualMetadata";
import RitualActions from "./RitualActions";
import { useRitualItem } from "./hooks/useRitualItem";
import { Clock, Calendar, Flame, CheckCircle2, AlertCircle, Play } from "lucide-react";

interface RitualTimelineItemProps {
  ritual: MorningRitual;
  onComplete: (ritual: MorningRitual) => void;
  onDelete: (ritual: MorningRitual) => void;
  onUpdate: (updatedRitual: MorningRitual) => void;
}

const RitualTimelineItem: React.FC<RitualTimelineItemProps> = ({ 
  ritual, 
  onComplete, 
  onDelete,
  onUpdate
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const {
    editDialogOpen,
    setEditDialogOpen,
    isToday,
    isCompletedToday,
    handleComplete,
    handleDelete
  } = useRitualItem({ ritual, onComplete, onDelete });

  // Calculate time until ritual
  const getTimeUntilRitual = () => {
    const now = new Date();
    const [hours, minutes] = ritual.timeOfDay.split(':').map(Number);
    const ritualTime = new Date();
    ritualTime.setHours(hours, minutes, 0, 0);
    
    if (ritualTime < now) {
      ritualTime.setDate(ritualTime.getDate() + 1); // Next day
    }
    
    const diffMs = ritualTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    
    if (diffMins < 60) {
      return `${diffMins} minutes`;
    } else if (diffHours < 24) {
      return `${diffHours}h ${remainingMins}m`;
    } else {
      return 'Tomorrow';
    }
  };

  const getCardStyle = () => {
    if (isCompletedToday) {
      return "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md hover:shadow-lg";
    }
    if (ritual.status === "missed") {
      return "border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-md hover:shadow-lg";
    }
    return "border-gray-200 bg-white hover:border-blue-200 shadow-sm hover:shadow-md";
  };

  const getRitualStatusInfo = () => {
    if (isCompletedToday) {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        text: "Completed Today",
        color: "text-green-700",
        bgColor: "bg-green-100"
      };
    }
    
    const now = new Date();
    const [hours, minutes] = ritual.timeOfDay.split(':').map(Number);
    const ritualTime = new Date();
    ritualTime.setHours(hours, minutes, 0, 0);
    
    if (ritualTime > now) {
      const timeUntil = getTimeUntilRitual();
      return {
        icon: <Clock className="h-5 w-5 text-blue-500" />,
        text: `Starting in ${timeUntil}`,
        color: "text-blue-700",
        bgColor: "bg-blue-100"
      };
    } else {
      return {
        icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
        text: "Ready to complete",
        color: "text-orange-700",
        bgColor: "bg-orange-100"
      };
    }
  };

  const statusInfo = getRitualStatusInfo();

  return (
    <>
      <div className="flex gap-4">
        <div className="mt-1.5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            isCompletedToday ? "bg-green-100 border-green-300 shadow-md" : 
            ritual.status === "missed" ? "bg-red-100 border-red-300 shadow-md" :
            "bg-primary/10 border-primary/20 hover:border-primary/40"
          }`}>
            <RitualStatusIcon status={ritual.status} />
          </div>
        </div>
        
        <Card className={`flex-1 transition-all duration-300 ${getCardStyle()}`}>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <CardTitle className="text-xl font-bold">{ritual.title}</CardTitle>
                  <Badge variant="outline" className="text-xs font-medium">
                    {ritual.timeOfDay}
                  </Badge>
                </div>
                
                <CardDescription className="text-sm line-clamp-2">
                  {ritual.description || "No description provided"}
                </CardDescription>
                
                {/* Enhanced Status Indicator */}
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full mt-3 ${statusInfo.bgColor}`}>
                  {statusInfo.icon}
                  <span className={`text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <RitualStatusBadge status={ritual.status} />
                {ritual.streak && ritual.streak > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-orange-600">
                    <Flame className="h-4 w-4" />
                    <span className="font-semibold">{ritual.streak} day{ritual.streak !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-4">
            <div className="space-y-3">
              {/* Enhanced metadata display */}
              <RitualMetadata 
                ritual={ritual}
                isToday={isToday}
                isCompletedToday={isCompletedToday}
              />
              
              {/* Additional details toggle */}
              {(ritual.tags && ritual.tags.length > 0) || ritual.priority !== 'medium' ? (
                <div className="flex items-center space-x-2">
                  {ritual.tags && ritual.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {ritual.priority !== 'medium' && (
                    <Badge 
                      variant={ritual.priority === 'high' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {ritual.priority} priority
                    </Badge>
                  )}
                </div>
              ) : null}
              
              {/* Completion details for completed rituals */}
              {isCompletedToday && ritual.lastCompleted && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">
                      Completed at {new Date(ritual.lastCompleted).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <div className="flex items-center justify-between w-full">
              <RitualActions 
                isCompletedToday={isCompletedToday}
                onComplete={handleComplete}
                onEdit={() => setEditDialogOpen(true)}
                onDelete={handleDelete}
              />
              
              {/* Quick action button for pending rituals */}
              {!isCompletedToday && (
                <Button
                  onClick={handleComplete}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Complete Now
                </Button>
              )}
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
