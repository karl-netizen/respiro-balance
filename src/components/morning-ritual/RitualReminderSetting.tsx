
import React from "react";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { RitualFormValues } from "./types";
import { RitualReminder } from "@/context/types";
import { generateRitualId } from "./utils";

interface RitualReminderSettingProps {
  form: UseFormReturn<RitualFormValues>;
}

const RitualReminderSetting: React.FC<RitualReminderSettingProps> = ({ form }) => {
  const reminders = form.watch('reminders') || [];
  
  const addReminder = () => {
    const newReminder: RitualReminder = {
      id: generateRitualId(),
      time: "08:00",
      type: 'in-app',
      enabled: true
    };
    
    form.setValue('reminders', [...reminders, newReminder]);
  };
  
  const removeReminder = (index: number) => {
    const updatedReminders = [...reminders];
    updatedReminders.splice(index, 1);
    form.setValue('reminders', updatedReminders);
  };
  
  const updateReminderTime = (index: number, time: string) => {
    const updatedReminders = [...reminders];
    updatedReminders[index] = {
      ...updatedReminders[index],
      time
    };
    form.setValue('reminders', updatedReminders);
  };
  
  const toggleReminder = (index: number, enabled: boolean) => {
    const updatedReminders = [...reminders];
    updatedReminders[index] = {
      ...updatedReminders[index],
      enabled
    };
    form.setValue('reminders', updatedReminders);
  };
  
  return (
    <FormField
      control={form.control}
      name="reminders"
      render={() => (
        <FormItem className="space-y-3">
          <FormLabel>Reminders</FormLabel>
          <FormDescription>
            Set reminders to help you stick to your ritual
          </FormDescription>
          <FormControl>
            <div className="space-y-2">
              {reminders.map((reminder, index) => (
                <div key={reminder.id} className="flex items-center gap-3">
                  <Switch 
                    checked={reminder.enabled}
                    onCheckedChange={(checked) => toggleReminder(index, checked)}
                  />
                  <Input
                    type="time"
                    value={reminder.time}
                    onChange={(e) => updateReminderTime(index, e.target.value)}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeReminder(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addReminder}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default RitualReminderSetting;
