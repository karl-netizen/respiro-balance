
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationDropdown } from "@/components/notifications";
import { useNotifications } from "@/context/NotificationsProvider";

const NotificationBell = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isDropdownOpen && (
        <NotificationDropdown onClose={() => setIsDropdownOpen(false)} />
      )}
    </div>
  );
};

export default NotificationBell;
