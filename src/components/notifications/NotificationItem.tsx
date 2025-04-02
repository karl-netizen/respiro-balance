
import { useState } from "react";
import { Check, Trash, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Notification, useNotifications } from "@/context/NotificationsProvider";
import { format, isToday, isYesterday } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { markAsRead, clearNotification } = useNotifications();
  const [isHovering, setIsHovering] = useState(false);

  const getDateDisplay = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d 'at' h:mm a");
    }
  };

  const renderIcon = () => {
    if (notification.type === "achievement") {
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    }
    return null;
  };

  return (
    <div
      className={`p-2 rounded-md transition-colors ${
        notification.read ? "bg-background" : "bg-primary/5"
      } ${isHovering ? "bg-secondary/20" : ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">{renderIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="text-xs text-muted-foreground">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {getDateDisplay(notification.timestamp)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          {!notification.read && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => markAsRead(notification.id)}
            >
              <Check className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => clearNotification(notification.id)}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
