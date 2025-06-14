
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { RitualFormValues, RitualReminder } from './types';
import RitualReminderSetting from './RitualReminderSetting';

interface RitualFormContentProps {
  form: UseFormReturn<RitualFormValues>;
  onSubmit: (values: RitualFormValues) => void;
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  submitted: boolean;
}

const RitualFormContent: React.FC<RitualFormContentProps> = ({ 
  form, 
  onSubmit,
  availableTags,
  selectedTags,
  onTagToggle,
  submitted
}) => {
  const { watch, setValue } = form;
  const tags = watch('tags') || [];
  const daysOfWeek = watch('daysOfWeek') || [];
  const reminders = watch('reminders') || [];

  const handleAddTag = (newTag: string) => {
    if (newTag && !tags.includes(newTag)) {
      setValue('tags', [...tags, newTag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    if (checked) {
      setValue('daysOfWeek', [...daysOfWeek, day]);
    } else {
      setValue('daysOfWeek', daysOfWeek.filter(d => d !== day));
    }
  };

  const handleAddReminder = () => {
    const newReminder: RitualReminder = {
      enabled: true,
      time: 15,
      message: 'Time for your morning ritual!'
    };
    setValue('reminders', [...reminders, newReminder]);
  };

  const handleUpdateReminder = (index: number, updatedReminder: RitualReminder) => {
    const updatedReminders = [...reminders];
    updatedReminders[index] = updatedReminder;
    setValue('reminders', updatedReminders);
  };

  const handleRemoveReminder = (index: number) => {
    setValue('reminders', reminders.filter((_, i) => i !== index));
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-green-600 text-lg font-semibold mb-2">
          ✅ Ritual Created Successfully!
        </div>
        <p className="text-muted-foreground">
          Your morning ritual has been saved and is ready to help you start your day mindfully.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ritual title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your morning ritual..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Timing & Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Timing & Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="timeOfDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time of Day</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
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
                    placeholder="Enter duration" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurrence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurrence</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recurrence" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.getValues('recurrence') === 'custom' && (
            <div className="space-y-2">
              <FormLabel>Days of Week</FormLabel>
              <div className="flex flex-wrap gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={daysOfWeek.includes(day)}
                      onCheckedChange={(checked) => handleDayToggle(day, !!checked)}
                    />
                    <label
                      htmlFor={`day-${day}`}
                      className="text-sm capitalize cursor-pointer"
                    >
                      {day.substring(0, 3)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reminder Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Reminder Settings</h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddReminder}>
                Add Reminder
              </Button>
            </div>
            {reminders.map((reminder, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-2">
                <RitualReminderSetting
                  reminder={reminder}
                  onUpdate={(updatedReminder) => handleUpdateReminder(index, updatedReminder)}
                />
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRemoveReminder(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority & Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Priority & Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Tags</FormLabel>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="text"
                placeholder="Add a tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const target = e.target as HTMLInputElement;
                    handleAddTag(target.value);
                    target.value = '';
                  }
                }}
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={() => {
                  const newTag = prompt('Enter a new tag:');
                  if (newTag) {
                    handleAddTag(newTag);
                  }
                }}
              >
                Add Tag
              </Button>
            </div>
            
            {/* Available tags */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => onTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Selected tags */}
            <div className="flex flex-wrap mt-2">
              {tags.map(tag => (
                <Badge key={tag} className="mr-2 mt-1 rounded-full px-2 py-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 -mr-1 h-4 w-4 p-0"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Create Morning Ritual
      </Button>
    </form>
  );
};

export default RitualFormContent;
