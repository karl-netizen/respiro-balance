
import React from "react";
import { Check, Info, Award, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { Notification } from "@/context/types";

export interface NotificationDropdownProps {
  notifications: Notification[];
  markAllAsRead: () => void;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  markAllAsRead,
  onClose
}) => {
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-500" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'update':
        return <Info className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatTime = (time: string) => {
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: true });
    } catch (e) {
      return time; // Fallback if date parsing fails
    }
  };
  
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium">Notifications</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs"
          onClick={handleMarkAllAsRead}
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          Mark all read
        </Button>
      </div>
      
      {notifications.length === 0 ? (
        <div className="py-8 text-center">
          <Bell className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
          <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[400px]">
          <ul className="py-1">
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notification.time)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
      
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" size="sm" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
