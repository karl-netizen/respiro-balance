
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Notification } from '@/context/types';
import { formatDistanceToNow } from 'date-fns';
import { Bell, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onViewAll: () => void;
  isLoading?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onClearAll,
  onViewAll,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  
  // Helper function to get formatted time
  const getFormattedTime = (notification: Notification) => {
    // Use timestamp if available, otherwise use time (make sure all notifications have at least one)
    const timeValue = notification.timestamp || notification.time;
    return formatDistanceToNow(new Date(timeValue), { addSuffix: true });
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    onMarkAsRead(notification.id);
    
    // Navigate if URL is provided
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              disabled={notifications.length === 0}
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="py-4 text-center text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => {
              // Make sure every notification has a time property
              const notificationWithTime = {
                ...notification,
                time: notification.time || notification.timestamp || new Date().toISOString()
              };
              
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex flex-col items-start p-3 border-b last:border-0 hover:bg-accent cursor-pointer",
                    !notification.read && "bg-accent/10"
                  )}
                  onClick={() => handleNotificationClick(notificationWithTime)}
                >
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {getFormattedTime(notificationWithTime)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  {notification.actionUrl && (
                    <div className="flex items-center text-primary text-xs mt-2">
                      <span>View details</span>
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })
          )}
        </div>
        
        <div className="p-2 border-t">
          <Button variant="outline" className="w-full" size="sm" onClick={onViewAll}>
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
