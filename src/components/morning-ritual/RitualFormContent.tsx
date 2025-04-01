
import React from "react";
import { FormField, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { Save, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { RitualFormValues } from "./types";
import RitualTagSelector from "./RitualTagSelector";
import RitualRecurrenceSelector from "./RitualRecurrenceSelector";
import RitualTimeFields from "./RitualTimeFields";

interface RitualFormContentProps {
  form: UseFormReturn<RitualFormValues>;
  onSubmit: (values: RitualFormValues) => void;
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  submitted: boolean;
}

const RitualFormContent = ({ 
  form, 
  onSubmit, 
  availableTags, 
  selectedTags, 
  onTagToggle, 
  submitted 
}: RitualFormContentProps) => {
  return (
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
          onTagToggle={onTagToggle}
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
};

export default RitualFormContent;
