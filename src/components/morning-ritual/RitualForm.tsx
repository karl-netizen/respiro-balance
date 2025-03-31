
import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock, Save, Sparkles, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRitualId } from "@/components/morning-ritual/utils";

// Form validation schema
const ritualFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  timeOfDay: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time (HH:MM)",
  }),
  duration: z.number().min(1, {
    message: "Duration must be at least 1 minute.",
  }).max(120, {
    message: "Duration cannot exceed 120 minutes."
  }),
  recurrence: z.enum(["daily", "weekdays", "weekends", "custom"]),
  daysOfWeek: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type RitualFormValues = z.infer<typeof ritualFormSchema>;

const RitualForm = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
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
    
    // Reset form
    form.reset();
    setSelectedTags([]);
  };
  
  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Get the current recurrence value
  const recurrenceWatch = form.watch("recurrence");

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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="timeOfDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time of Day</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                          <Input type="time" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        When will you start this ritual?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={120}
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))} 
                        />
                      </FormControl>
                      <FormDescription>
                        How long will this ritual take?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
              
              <div>
                <FormField
                  control={form.control}
                  name="recurrence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recurrence</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {recurrenceWatch === "custom" && (
                  <FormField
                    control={form.control}
                    name="daysOfWeek"
                    render={({ field }) => (
                      <FormItem className="mt-4 ml-7">
                        <FormLabel>Select Days</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">
                            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                              <div key={day} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`day-${day}`}
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    const updated = checked
                                      ? [...current, day]
                                      : current.filter(d => d !== day);
                                    field.onChange(updated);
                                  }}
                                />
                                <label
                                  htmlFor={`day-${day}`}
                                  className="text-sm capitalize"
                                >
                                  {day.substring(0, 3)}
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
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
              
              <div className="pt-4">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Create Ritual
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RitualForm;
