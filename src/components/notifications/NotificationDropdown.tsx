
import { useRef, useEffect } from "react";
import { Bell, CheckCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "@/components/notifications";
import { useNotifications } from "@/context/NotificationsProvider";

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const { notifications, markAllAsRead, clearAllNotifications } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 z-50 w-80 bg-background border rounded-lg shadow-lg"
    >
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Notifications</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {notifications.length === 0 ? (
        <div className="py-8 px-4 text-center">
          <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <h4 className="font-medium mb-1">No notifications</h4>
          <p className="text-sm text-muted-foreground">
            You don't have any notifications at the moment.
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="max-h-[400px] overflow-y-auto p-2">
            <div className="space-y-1">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-2 flex justify-between">
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAllNotifications} className="text-xs">
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
