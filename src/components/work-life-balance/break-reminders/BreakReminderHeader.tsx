
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { BellRing, BellOff } from "lucide-react";

interface BreakReminderHeaderProps {
  notificationsEnabled: boolean;
}

const BreakReminderHeader: React.FC<BreakReminderHeaderProps> = ({ notificationsEnabled }) => {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-xl">Break Reminder Settings</CardTitle>
      {notificationsEnabled ? (
        <BellRing className="h-5 w-5 text-primary" />
      ) : (
        <BellOff className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
};

export default BreakReminderHeader;
