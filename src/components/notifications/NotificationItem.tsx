
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Trophy, Target, Lightbulb, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/context/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'reminder':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'streak':
        return <Target className="h-4 w-4 text-green-500" />;
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`p-4 border-b hover:bg-muted/50 transition-colors ${
        !notification.read ? 'bg-blue-50/50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </p>
            </div>
            
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="flex-shrink-0"
              >
                Mark read
              </Button>
            )}
          </div>
          
          {notification.actionUrl && (
            <Button variant="link" size="sm" className="p-0 h-auto mt-2">
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
