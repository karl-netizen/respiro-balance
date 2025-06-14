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
import { RitualFormData } from './types';
import RitualReminderSetting from './RitualReminderSetting';

interface RitualFormContentProps {
  form: UseFormReturn<RitualFormData>;
}

const RitualFormContent: React.FC<RitualFormContentProps> = ({ form }) => {
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

  return (
    <div className="space-y-6">
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
                  <Input type="number" placeholder="Enter duration" {...field} />
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
            <div className="flex items-center space-x-2">
              <FormLabel>Days of Week:</FormLabel>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <FormField
                  key={day}
                  control={form.control}
                  name="daysOfWeek"
                  render={() => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={daysOfWeek.includes(day)}
                          onCheckedChange={(checked) => handleDayToggle(day, checked)}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer capitalize">{day}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          )}

          {/* Fixed reminder settings - removed form prop */}
          <div className="space-y-4">
            <h4 className="font-medium">Reminder Settings</h4>
            {reminders.map((reminder, index) => (
              <RitualReminderSetting
                key={index}
                reminder={reminder}
                onUpdate={(updatedReminder) => {
                  const updatedReminders = [...reminders];
                  updatedReminders[index] = updatedReminder;
                  setValue('reminders', updatedReminders);
                }}
              />
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
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Add a tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <Button type="button" size="sm" onClick={() => {
                const newTag = prompt('Enter a new tag:');
                if (newTag) {
                  handleAddTag(newTag);
                }
              }}>
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap mt-2">
              {tags.map(tag => (
                <Badge key={tag} className="mr-2 mt-1 rounded-full px-2 py-1" >
                  {tag}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 -mr-1 h-4 w-4"
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
    </div>
  );
};

export default RitualFormContent;
