
export interface RealTimeSyncConfig {
  enableBiometricSync?: boolean;
  enableSessionSync?: boolean;
  enableProgressSync?: boolean;
  enableSocialSync?: boolean;
  syncInterval?: number; // milliseconds
}

export interface SyncState {
  isOnline: boolean;
  lastSyncTime: Date;
  syncInProgress: boolean;
}

export interface SyncHandlers {
  onBiometricUpdate?: (data: any) => void;
  onSessionUpdate?: (session: any) => void;
  onProgressUpdate?: (progress: any) => void;
  onSocialUpdate?: (social: any) => void;
}
