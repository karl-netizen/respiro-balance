
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/context/NotificationsProvider";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {dropdownOpen && (
        <NotificationDropdown
          onClose={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
