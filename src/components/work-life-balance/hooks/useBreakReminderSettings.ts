
import { useState, useEffect } from 'react';
import { useUserPreferences } from '@/context';
import { supabase } from '@/lib/supabase';
import { 
  BreakReminder, 
  BreakType, 
  NotificationPermissionState, 
  defaultBreakReminders,
  notificationService 
} from '@/services/notifications';

export const useBreakReminderSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [reminders, setReminders] = useState<Record<BreakType, BreakReminder>>({...defaultBreakReminders});
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>({
    granted: false,
    requested: false,
    denied: false
  });
  const [initialized, setInitialized] = useState(false);
  
  // Initialize from user preferences
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load permission state first
        const currentPermissionState = notificationService.getPermissionState();
        setPermissionState(currentPermissionState);
        
        // Try to load from preferences if available
        if (preferences.breakReminders) {
          setReminders(preferences.breakReminders);
        }
        
        // Set notifications enabled if we have permission and it's enabled in preferences
        setNotificationsEnabled(
          currentPermissionState.granted && 
          (preferences.breakNotificationsEnabled !== undefined ? preferences.breakNotificationsEnabled : false)
        );
        
        // If notifications are enabled, schedule them
        if (currentPermissionState.granted && preferences.breakNotificationsEnabled) {
          const remindersToSchedule = preferences.breakReminders || defaultBreakReminders;
          await notificationService.scheduleBreakReminders(
            Object.values(remindersToSchedule), 
            preferences
          );
        }
        
        setInitialized(true);
      } catch (error) {
        console.error('Error loading break reminder settings:', error);
      }
    };
    
    loadSettings();
  }, [preferences]);
  
  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission();
    setPermissionState(notificationService.getPermissionState());
    return granted;
  };
  
  // Update a specific reminder
  const updateReminder = (type: BreakType, field: keyof BreakReminder, value: any) => {
    setReminders(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };
  
  // Toggle notifications on/off
  const toggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    
    if (enabled) {
      // Schedule reminders immediately
      await notificationService.scheduleBreakReminders(
        Object.values(reminders),
        preferences
      );
    } else {
      // Clear all reminders
      notificationService.clearAllReminders();
    }
    
    // Update preferences
    updatePreferences({
      breakNotificationsEnabled: enabled,
      breakReminders: reminders
    });
    
    // Save to Supabase if user is authenticated
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_preferences')
          .update({
            break_notifications_enabled: enabled,
            break_reminders: reminders
          })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };
  
  // Save all settings
  const saveSettings = async () => {
    // Update preferences
    updatePreferences({
      breakNotificationsEnabled: notificationsEnabled,
      breakReminders: reminders
    });
    
    // Reschedule notifications if enabled
    if (notificationsEnabled) {
      await notificationService.scheduleBreakReminders(
        Object.values(reminders),
        preferences
      );
    }
    
    // Save to Supabase if user is authenticated
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_preferences')
          .update({
            break_notifications_enabled: notificationsEnabled,
            break_reminders: reminders
          })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error saving break reminder settings:', error);
    }
  };
  
  return {
    reminders,
    notificationsEnabled,
    permissionState,
    initialized,
    updateReminder,
    toggleNotifications,
    saveSettings,
    requestPermission
  };
};
