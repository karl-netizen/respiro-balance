
import { NotificationPermissionState } from "./types";

class NotificationPermissionManager {
  private permissionState: NotificationPermissionState = {
    granted: false,
    requested: false,
    denied: false
  };

  constructor() {
    this.initPermissionState();
  }

  private async initPermissionState() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.permissionState = { granted: true, requested: true, denied: false };
    } else if (Notification.permission === 'denied') {
      this.permissionState = { granted: false, requested: true, denied: true };
    } else {
      this.permissionState = { granted: false, requested: false, denied: false };
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permissionState.granted) {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      this.permissionState = {
        granted,
        requested: true,
        denied: permission === 'denied'
      };
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  getPermissionState(): NotificationPermissionState {
    return { ...this.permissionState };
  }
}

export const permissionManager = new NotificationPermissionManager();
