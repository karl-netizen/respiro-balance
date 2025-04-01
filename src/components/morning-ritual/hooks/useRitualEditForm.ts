
import { useState } from "react";
import { MorningRitual, RitualRecurrence, WorkDay } from "@/context/types";
import { useToast } from "@/hooks/use-toast";
import { RITUAL_TAGS } from "../constants";

export interface UseRitualEditFormProps {
  ritual: MorningRitual;
  onSave: (updatedRitual: MorningRitual) => void;
  onOpenChange: (open: boolean) => void;
}

export const useRitualEditForm = ({ ritual, onSave, onOpenChange }: UseRitualEditFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(ritual.title);
  const [description, setDescription] = useState(ritual.description || "");
  const [timeOfDay, setTimeOfDay] = useState(ritual.timeOfDay);
  const [duration, setDuration] = useState(ritual.duration);
  const [recurrence, setRecurrence] = useState<RitualRecurrence>(ritual.recurrence);
  const [daysOfWeek, setDaysOfWeek] = useState<WorkDay[]>(ritual.daysOfWeek || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(ritual.tags || []);
  
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

  return {
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
    selectedTags,
    availableTags: RITUAL_TAGS,
    toggleTag,
    toggleDay,
    handleSave
  };
};
