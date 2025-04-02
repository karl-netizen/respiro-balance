
import { useState } from "react";
import { useUserPreferences } from "@/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MorningRitual, RitualRecurrence, WorkDay, RitualStatus, RitualPriority, RitualReminder } from "@/context/types";
import { RitualFormValues, ritualFormSchema } from "../types";
import { generateRitualId } from "../utils";
import { useToast } from "@/hooks/use-toast";

export const useRitualForm = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  // Set up form with default values
  const form = useForm<RitualFormValues>({
    resolver: zodResolver(ritualFormSchema),
    defaultValues: {
      title: "",
      description: "",
      timeOfDay: preferences.weekdayWakeTime || "07:00",
      duration: 15,
      recurrence: "daily",
      daysOfWeek: [],
      tags: [],
      priority: "medium",
      reminders: [] as RitualReminder[],
      isTemplate: false,
      associatedGoals: []
    },
  });
  
  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Handle form submission
  const onSubmit = (values: RitualFormValues) => {
    // Create new ritual object
    const newRitual: MorningRitual = {
      id: generateRitualId(),
      title: values.title,
      description: values.description,
      timeOfDay: values.timeOfDay,
      duration: values.duration,
      recurrence: values.recurrence as RitualRecurrence,
      status: "planned" as RitualStatus,
      streak: 0,
      tags: selectedTags,
      createdAt: new Date().toISOString(),
      daysOfWeek: values.recurrence === "custom" ? values.daysOfWeek as WorkDay[] : undefined,
      priority: values.priority as RitualPriority,
      reminders: values.reminders as RitualReminder[],
      isTemplate: values.isTemplate,
      associatedGoals: values.associatedGoals,
      completionHistory: []
    };
    
    // Get current rituals or initialize empty array
    const currentRituals = preferences.morningRituals || [];
    
    // Add new ritual
    updatePreferences({
      morningRituals: [...currentRituals, newRitual]
    });
    
    // Show success message
    toast({
      title: "Ritual created",
      description: "Your new morning ritual has been created successfully",
    });
    
    // Mark as submitted for visual feedback
    setSubmitted(true);
    
    // Reset form
    form.reset();
    setSelectedTags([]);
    
    // Reset fields to default values
    form.setValue("timeOfDay", preferences.weekdayWakeTime || "07:00");
    form.setValue("duration", 15);
    form.setValue("recurrence", "daily");
    form.setValue("priority", "medium");
  };
  
  return {
    form,
    selectedTags,
    submitted,
    setSubmitted,
    toggleTag,
    onSubmit
  };
};
