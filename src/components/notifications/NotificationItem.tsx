
import React from 'react';
import { Bell, Check, AlertCircle, Info } from 'lucide-react';
import { useNotifications } from "@/context/NotificationsProvider";
import { Notification } from '@/context/types';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRead }) => {
  const NotificationIcon = () => {
    switch (notification.type) {
      case 'achievement':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'reminder':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'system':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div 
      className={`p-3 border-b last:border-b-0 ${notification.read ? 'bg-background' : 'bg-secondary/10'}`}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          <NotificationIcon />
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-medium ${notification.read ? 'text-foreground/80' : 'text-foreground'}`}>
            {notification.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {notification.message}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {notification.time}
            </span>
            {notification.action && (
              <a 
                href={notification.actionUrl || '#'} 
                className="text-xs text-primary hover:underline"
              >
                {notification.action}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
