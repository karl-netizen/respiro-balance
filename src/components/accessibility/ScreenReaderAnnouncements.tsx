
import React, { useState, useEffect } from 'react';

interface ScreenReaderAnnouncementsProps {
  message?: string;
  priority?: 'polite' | 'assertive';
  delay?: number;
}

export const ScreenReaderAnnouncements: React.FC<ScreenReaderAnnouncementsProps> = ({
  message,
  priority = 'polite',
  delay = 100
}) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setAnnouncement(message);
        // Clear after a brief moment to allow for re-announcements
        const clearTimer = setTimeout(() => setAnnouncement(''), 1000);
        return () => clearTimeout(clearTimer);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [message, delay]);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

export const useScreenReaderAnnouncement = () => {
  const [announcement, setAnnouncement] = useState<{
    message: string;
    priority: 'polite' | 'assertive';
  } | null>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement({ message, priority });
  };

  return {
    announcement,
    announce,
    ScreenReaderComponent: () => (
      <ScreenReaderAnnouncements
        message={announcement?.message}
        priority={announcement?.priority}
      />
    )
  };
};

export default ScreenReaderAnnouncements;
