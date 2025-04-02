
import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/context/NotificationsProvider";
import NotificationDropdown from "./NotificationDropdown";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useOnClickOutside(containerRef, () => setIsOpen(false));
  
  // Close dropdown when pressing escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);
  
  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] flex items-center justify-center px-1 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <NotificationDropdown 
          notifications={notifications}
          markAllAsRead={markAllAsRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
