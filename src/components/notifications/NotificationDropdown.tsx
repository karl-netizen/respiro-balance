
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, BookOpen } from "lucide-react";
import OnboardingGuideNotification from "./OnboardingGuideNotification";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications = [],
  markAllAsRead,
  markAsRead,
  onClose
}) => {
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(false);
  
  console.log('NotificationDropdown rendering with:', { 
    notificationsCount: notifications.length,
    notifications: notifications.slice(0, 3)
  });

  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => n && !n.read).length 
    : 0;

  const handleMarkAllAsRead = () => {
    try {
      if (typeof markAllAsRead === 'function') {
        markAllAsRead();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleClose = () => {
    try {
      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (error) {
      console.error('Error closing dropdown:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleShowOnboardingGuide = () => {
    setShowOnboardingGuide(true);
  };

  const handleCloseOnboardingGuide = () => {
    setShowOnboardingGuide(false);
  };

  if (showOnboardingGuide) {
    return (
      <div className="fixed inset-0 md:absolute md:right-0 md:xl:-right-32 md:top-full md:mt-2 md:inset-auto w-full h-full md:w-96 md:sm:w-[500px] md:lg:w-[600px] md:max-w-[90vw] md:h-auto bg-white dark:bg-gray-800 md:border md:rounded-lg md:shadow-lg z-[9999] md:z-[100] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 sticky top-0">
          <h3 className="font-semibold">Getting Started Guide</h3>
          <Button variant="ghost" size="sm" onClick={handleCloseOnboardingGuide}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 h-full md:max-h-[80vh] overflow-y-auto">
          <OnboardingGuideNotification onClose={handleCloseOnboardingGuide} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-4 top-16 md:absolute md:right-0 md:top-full md:mt-2 md:inset-x-auto w-auto md:w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-[100]">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Getting Started Guide Button */}
      <div className="p-3 border-b bg-gradient-to-r from-primary/5 to-blue-50">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShowOnboardingGuide}
          className="w-full justify-start gap-2 border-primary/20 hover:bg-primary/10"
        >
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-primary font-medium">Getting Started Guide</span>
        </Button>
      </div>
      
      <ScrollArea className="max-h-96">
        {!Array.isArray(notifications) || notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-xs mt-1">Check out the Getting Started Guide above!</p>
          </div>
        ) : (
          <div className="p-2">
            {notifications.map((notification) => {
              if (!notification || !notification.id) {
                return null;
              }

              const createdAt = notification.createdAt instanceof Date 
                ? notification.createdAt 
                : new Date(notification.createdAt || Date.now());

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 rounded-md mb-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    notification.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title || 'Notification'}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message || 'No message'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      
      {unreadCount > 0 && (
        <div className="p-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            className="w-full border-2 border-gray-300 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
