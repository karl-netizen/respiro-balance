
import React, { useState } from "react";
import { MorningRitual, RitualRecurrence, WorkDay } from "@/context/types";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Clock, Save, Tag } from "lucide-react";

interface RitualEditDialogProps {
  ritual: MorningRitual;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedRitual: MorningRitual) => void;
}

const RitualEditDialog: React.FC<RitualEditDialogProps> = ({
  ritual,
  open,
  onOpenChange,
  onSave
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(ritual.title);
  const [description, setDescription] = useState(ritual.description || "");
  const [timeOfDay, setTimeOfDay] = useState(ritual.timeOfDay);
  const [duration, setDuration] = useState(ritual.duration);
  const [recurrence, setRecurrence] = useState<RitualRecurrence>(ritual.recurrence);
  const [daysOfWeek, setDaysOfWeek] = useState<WorkDay[]>(ritual.daysOfWeek || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(ritual.tags || []);
  
  // Popular ritual tags (same as in RitualForm)
  const availableTags = [
    "meditation", "exercise", "hydration", "stretching", "journaling", 
    "reading", "planning", "gratitude", "breathing", "mindfulness"
  ];
  
  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Handle day selection for custom recurrence
  const toggleDay = (day: WorkDay) => {
    setDaysOfWeek(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };
  
  // Handle form submission
  const handleSave = () => {
    // Validate required fields
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!timeOfDay) {
      toast({
        title: "Error",
        description: "Time of day is required",
        variant: "destructive",
      });
      return;
    }
    
    if (duration < 1) {
      toast({
        title: "Error",
        description: "Duration must be at least 1 minute",
        variant: "destructive",
      });
      return;
    }
    
    // Create updated ritual object
    const updatedRitual: MorningRitual = {
      ...ritual,
      title,
      description: description || undefined,
      timeOfDay,
      duration,
      recurrence,
      daysOfWeek: recurrence === "custom" ? daysOfWeek : undefined,
      tags: selectedTags,
    };
    
    // Save changes
    onSave(updatedRitual);
    
    // Close dialog
    onOpenChange(false);
    
    // Show success message
    toast({
      title: "Ritual updated",
      description: "Your morning ritual has been updated successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Morning Ritual</DialogTitle>
          <DialogDescription>
            Update your morning ritual to better fit your routine.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Ritual Name</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Morning Meditation"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeOfDay">Time of Day</Label>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                <Input 
                  id="timeOfDay" 
                  type="time" 
                  value={timeOfDay} 
                  onChange={(e) => setTimeOfDay(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                type="number" 
                min={1} 
                max={120} 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe what you'll do during this ritual"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Recurrence</Label>
            <RadioGroup
              value={recurrence}
              onValueChange={(value) => setRecurrence(value as RitualRecurrence)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="r-daily" />
                <Label htmlFor="r-daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekdays" id="r-weekdays" />
                <Label htmlFor="r-weekdays">Weekdays (Mon-Fri)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekends" id="r-weekends" />
                <Label htmlFor="r-weekends">Weekends (Sat-Sun)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="r-custom" />
                <Label htmlFor="r-custom">Custom</Label>
              </div>
            </RadioGroup>
          </div>
          
          {recurrence === "custom" && (
            <div className="ml-7 space-y-2">
              <Label>Select Days</Label>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`day-edit-${day}`}
                      checked={daysOfWeek.includes(day as WorkDay)}
                      onCheckedChange={() => toggleDay(day as WorkDay)}
                    />
                    <label
                      htmlFor={`day-edit-${day}`}
                      className="text-sm capitalize"
                    >
                      {day.substring(0, 3)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <Label className="flex items-center mb-3">
              <Tag className="h-4 w-4 mr-2" />
              Tags <span className="text-muted-foreground text-xs ml-2">(optional)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <div 
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`
                    py-1 px-3 rounded-full text-xs cursor-pointer transition-colors
                    ${selectedTags.includes(tag) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RitualEditDialog;
