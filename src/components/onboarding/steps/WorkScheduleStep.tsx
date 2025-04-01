
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context";
import { WorkDay } from "@/context/types";

const WorkScheduleStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const days = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  const toggleWorkDay = (day: string) => {
    // Ensure workDays is an array before using it
    const workDays = Array.isArray(preferences.workDays) ? preferences.workDays : [];
    const isSelected = workDays.includes(day as WorkDay);
    let newWorkDays;
    
    if (isSelected) {
      newWorkDays = workDays.filter(d => d !== day);
    } else {
      newWorkDays = [...workDays, day as WorkDay];
    }
    
    updatePreferences({ workDays: newWorkDays });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Which days do you typically work?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {days.map((day) => (
            <div key={day.id} className="flex items-center space-x-2">
              <Checkbox 
                id={day.id} 
                checked={Array.isArray(preferences.workDays) && preferences.workDays.includes(day.id as WorkDay)}
                onCheckedChange={() => toggleWorkDay(day.id)}
              />
              <Label htmlFor={day.id}>{day.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="workStartTime">Work start time</Label>
          <Input
            type="time"
            id="workStartTime"
            value={preferences.workStartTime || "09:00"}
            onChange={(e) => updatePreferences({ workStartTime: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workEndTime">Work end time</Label>
          <Input
            type="time"
            id="workEndTime"
            value={preferences.workEndTime || "17:00"}
            onChange={(e) => updatePreferences({ workEndTime: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkScheduleStep;
