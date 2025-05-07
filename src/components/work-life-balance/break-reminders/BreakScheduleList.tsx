
import React from "react";
import { BreakReminder, BreakType } from "@/services/notifications";
import { UserPreferences } from "@/context/types";
import BreakTypeControl from "./BreakTypeControl";
import { formatTime } from "../utils";

interface BreakScheduleListProps {
  reminders: Record<BreakType, BreakReminder>;
  preferences: UserPreferences;
  notificationsEnabled: boolean;
  onUpdateReminder: (type: BreakType, field: keyof BreakReminder, value: any) => void;
}

const BreakScheduleList: React.FC<BreakScheduleListProps> = ({
  reminders,
  preferences,
  notificationsEnabled,
  onUpdateReminder,
}) => {
  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-medium">Break Schedule</h3>
      
      {/* Micro breaks */}
      <BreakTypeControl
        type="micro"
        reminder={reminders.micro}
        notificationsEnabled={notificationsEnabled}
        onUpdate={onUpdateReminder}
      />
      
      {/* Medium breaks */}
      <BreakTypeControl
        type="medium"
        reminder={reminders.medium}
        notificationsEnabled={notificationsEnabled}
        onUpdate={onUpdateReminder}
      />
      
      {/* Lunch break */}
      {preferences.lunchBreak && (
        <BreakTypeControl
          type="lunch"
          reminder={reminders.lunch}
          lunchTime={preferences.lunchTime ? formatTime(preferences.lunchTime) : undefined}
          notificationsEnabled={notificationsEnabled}
          onUpdate={onUpdateReminder}
        />
      )}
      
      {/* Long breaks */}
      <BreakTypeControl
        type="long"
        reminder={reminders.long}
        notificationsEnabled={notificationsEnabled}
        onUpdate={onUpdateReminder}
      />
    </div>
  );
};

export default BreakScheduleList;
