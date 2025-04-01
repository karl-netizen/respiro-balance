
import React, { useState, useEffect } from "react";
import { useUserPreferences } from "@/context";
import { MorningRitual, RitualRecurrence, WorkDay } from "@/context/types";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRitualId } from "./utils";
import RitualTagSelector from "./RitualTagSelector";
import RitualRecurrenceSelector from "./RitualRecurrenceSelector";
import RitualTimeFields from "./RitualTimeFields";
import { ritualFormSchema, RitualFormValues } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

const RitualForm = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useIsMobile();
  
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
    },
  });
  
  // Reset success message after delay
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [submitted]);
  
  // Popular ritual tags
  const availableTags = [
    "meditation", "exercise", "hydration", "stretching", "journaling", 
    "reading", "planning", "gratitude", "breathing", "mindfulness"
  ];
  
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
      status: "planned",
      streak: 0,
      tags: selectedTags,
      createdAt: new Date().toISOString(),
      daysOfWeek: values.recurrence === "custom" ? values.daysOfWeek as WorkDay[] : undefined
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
  };
  
  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ritual Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Morning Meditation" {...field} />
              </FormControl>
              <FormDescription>
                Give your ritual a clear, descriptive name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <RitualTimeFields form={form} />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what you'll do during this ritual"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <RitualRecurrenceSelector form={form} />
        
        <RitualTagSelector 
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
        />
        
        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={submitted}>
            {submitted ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Created Successfully
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Ritual
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a Morning Ritual</CardTitle>
          <CardDescription>
            Design a ritual that works for your morning routine and helps you start your day right.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isMobile ? (
            <ScrollArea className="h-[calc(100vh-350px)] pr-4">
              {formContent}
            </ScrollArea>
          ) : (
            formContent
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RitualForm;
