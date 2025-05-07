
import React from "react";
import { NotificationPermissionState } from "@/services/notifications";

interface PermissionWarningProps {
  permissionState: NotificationPermissionState;
}

const PermissionWarning: React.FC<PermissionWarningProps> = ({ permissionState }) => {
  if (!permissionState.denied) {
    return null;
  }
  
  return (
    <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-md text-sm text-amber-700">
      <strong>Notifications blocked.</strong> Please enable notifications in your browser settings to receive break reminders.
    </div>
  );
};

export default PermissionWarning;
