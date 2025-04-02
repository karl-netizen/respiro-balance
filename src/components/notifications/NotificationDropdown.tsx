
import React, { useRef, useEffect } from "react";
import { useNotifications } from "@/context/NotificationsProvider";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { 
    notifications, 
    markAllAsRead, 
    clearAllNotifications 
  } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Close dropdown when clicking outside
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
    <Card 
      ref={dropdownRef} 
      className="absolute right-0 top-full mt-2 w-80 z-50 shadow-lg"
    >
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-base flex justify-between items-center">
          Notifications
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="text-xs h-7"
          >
            Mark all as read
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="divide-y">
              {notifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onClose={onClose}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      
      {notifications.length > 0 && (
        <CardFooter className="py-2 px-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={clearAllNotifications}
          >
            Clear all
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationDropdown;
