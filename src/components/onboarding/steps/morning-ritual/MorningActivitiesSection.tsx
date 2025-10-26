

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface MorningActivitiesSectionProps {
  activities: string[];
  onChange: (value: string, checked: boolean) => void;
}

const MorningActivitiesSection = ({ activities, onChange }: MorningActivitiesSectionProps) => {
  const handleActivityChange = (value: string, checked: boolean) => {
    onChange(value, checked);
    
    toast.success(checked ? "Activity added" : "Activity removed", {
      description: checked 
        ? `Added ${value} to your morning activities` 
        : `Removed ${value} from your morning activities`,
      duration: 1500
    });
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Morning Activities</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Which of these do you typically include in your morning?
      </p>
      <div className="space-y-2">
        <ActivityCheckbox
          id="meditation"
          label="Meditation"
          checked={activities.includes("meditation")}
          onChange={handleActivityChange}
        />
        <ActivityCheckbox
          id="exercise"
          label="Exercise"
          checked={activities.includes("exercise")}
          onChange={handleActivityChange}
        />
        <ActivityCheckbox
          id="journaling"
          label="Journaling"
          checked={activities.includes("journaling")}
          onChange={handleActivityChange}
        />
        <ActivityCheckbox
          id="reading"
          label="Reading"
          checked={activities.includes("reading")}
          onChange={handleActivityChange}
        />
        <ActivityCheckbox
          id="planning"
          label="Planning the day"
          checked={activities.includes("planning")}
          onChange={handleActivityChange}
        />
        <ActivityCheckbox
          id="email"
          label="Checking emails/messages"
          checked={activities.includes("email")}
          onChange={handleActivityChange}
        />
      </div>
    </div>
  );
};

interface ActivityCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}

const ActivityCheckbox = ({ id, label, checked, onChange }: ActivityCheckboxProps) => {
  return (
    <div 
      className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer"
      onClick={() => onChange(id, !checked)}
    >
      <Checkbox 
        id={`activity-${id}`}
        checked={checked}
        onCheckedChange={(checked) => onChange(id, !!checked)}
      />
      <Label htmlFor={`activity-${id}`} className="cursor-pointer w-full">{label}</Label>
    </div>
  );
};

export default MorningActivitiesSection;
