
import React from "react";
import { Notification, useNotifications } from "@/context/NotificationsProvider";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, Bell, Trophy, X } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onClose 
}) => {
  const { markAsRead, clearNotification } = useNotifications();
  
  const handleAction = () => {
    if (notification.action) {
      markAsRead(notification.id);
      onClose();
      notification.action.onClick();
    }
  };
  
  const getIcon = () => {
    switch (notification.type) {
      case 'reminder':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'streak':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  return (
    <div 
      className={`p-3 hover:bg-slate-50 relative ${!notification.read ? 'bg-blue-50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">
            {notification.title}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {notification.message}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </span>
            
            {notification.action && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={handleAction}
              >
                {notification.action.label}
              </Button>
            )}
          </div>
        </div>
        <button 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => clearNotification(notification.id)}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {!notification.read && (
        <div 
          className="absolute inset-y-0 left-0 w-1 bg-blue-500"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default NotificationItem;
