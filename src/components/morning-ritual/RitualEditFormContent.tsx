
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RitualRecurrence, WorkDay } from "@/context/types";
import { Clock, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import RitualTagSelector from "./RitualTagSelector";

interface RitualEditFormContentProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  timeOfDay: string;
  setTimeOfDay: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  recurrence: RitualRecurrence;
  setRecurrence: (value: RitualRecurrence) => void;
  daysOfWeek: WorkDay[];
  toggleDay: (day: WorkDay) => void;
  selectedTags: string[];
  availableTags: string[];
  toggleTag: (tag: string) => void;
  handleSave: () => void;
  onOpenChange: (open: boolean) => void;
}

const RitualEditFormContent: React.FC<RitualEditFormContentProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  timeOfDay,
  setTimeOfDay,
  duration,
  setDuration,
  recurrence,
  setRecurrence,
  daysOfWeek,
  toggleDay,
  selectedTags,
  availableTags,
  toggleTag,
  handleSave,
  onOpenChange
}) => {
  return (
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
      
      <RitualTagSelector
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagToggle={toggleTag}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default RitualEditFormContent;
