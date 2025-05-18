
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context";
import { WorkDay } from "@/context/types";
import { toast } from "sonner";

const WorkScheduleStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Local state for immediate UI feedback
  const [workDays, setWorkDays] = useState<WorkDay[]>(
    Array.isArray(preferences.workDays) ? preferences.workDays : []
  );
  const [startTime, setStartTime] = useState(preferences.workStartTime || "09:00");
  const [endTime, setEndTime] = useState(preferences.workEndTime || "17:00");

  // Sync local state with preferences when they change
  useEffect(() => {
    if (Array.isArray(preferences.workDays)) {
      setWorkDays(preferences.workDays);
    }
    if (preferences.workStartTime) {
      setStartTime(preferences.workStartTime);
    }
    if (preferences.workEndTime) {
      setEndTime(preferences.workEndTime);
    }
  }, [preferences.workDays, preferences.workStartTime, preferences.workEndTime]);

  const toggleWorkDay = (day: string) => {
    const isSelected = workDays.includes(day as WorkDay);
    let newWorkDays: WorkDay[];
    
    if (isSelected) {
      newWorkDays = workDays.filter(d => d !== day);
    } else {
      newWorkDays = [...workDays, day as WorkDay];
    }
    
    // Update local state immediately for responsive UI
    setWorkDays(newWorkDays);
    
    // Update preferences
    updatePreferences({ workDays: newWorkDays });
    
    toast.success(`${isSelected ? 'Removed' : 'Added'} ${day}`, {
      description: `Work schedule updated`,
      duration: 1500
    });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setStartTime(newTime);
    updatePreferences({ workStartTime: newTime });
    toast.success("Start time updated", {
      description: `Work starts at ${newTime}`,
      duration: 1500
    });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setEndTime(newTime);
    updatePreferences({ workEndTime: newTime });
    toast.success("End time updated", {
      description: `Work ends at ${newTime}`,
      duration: 1500
    });
  };

  const days = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Which days do you typically work?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {days.map((day) => (
            <div key={day.id} className="flex items-center space-x-2">
              <Checkbox 
                id={day.id} 
                checked={workDays.includes(day.id as WorkDay)}
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
            value={startTime}
            onChange={handleStartTimeChange}
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workEndTime">Work end time</Label>
          <Input
            type="time"
            id="workEndTime"
            value={endTime}
            onChange={handleEndTimeChange}
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Selected days: {workDays.join(', ') || 'None'}</p>
          <p>Start time: {startTime}</p>
          <p>End time: {endTime}</p>
        </div>
      )}
    </div>
  );
};

export default WorkScheduleStep;
