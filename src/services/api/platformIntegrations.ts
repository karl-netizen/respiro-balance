
interface HealthAppData {
  heartRate?: number;
  steps?: number;
  sleepDuration?: number;
  stressLevel?: number;
  timestamp: Date;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

interface WearableDevice {
  id: string;
  name: string;
  type: 'apple_watch' | 'fitbit' | 'garmin' | 'samsung_watch';
  connected: boolean;
  lastSync?: Date;
}

class PlatformIntegrationsService {
  
  // Apple Health Integration
  async connectAppleHealth(): Promise<boolean> {
    if ('HealthKit' in window) {
      try {
        // Request health data permissions
        const permissions = await (window as any).HealthKit.requestAuthorization({
          read: ['HKQuantityTypeIdentifierHeartRate', 'HKQuantityTypeIdentifierStepCount'],
          write: ['HKQuantityTypeIdentifierMindfulSession']
        });
        return permissions.granted;
      } catch (error) {
        console.error('Apple Health connection failed:', error);
        return false;
      }
    }
    return false;
  }

  async getAppleHealthData(dataType: string, startDate: Date, endDate: Date): Promise<HealthAppData[]> {
    if ('HealthKit' in window) {
      try {
        const data = await (window as any).HealthKit.querySamples({
          sampleType: dataType,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });
        
        return data.map((sample: any) => ({
          heartRate: sample.value,
          timestamp: new Date(sample.startDate)
        }));
      } catch (error) {
        console.error('Apple Health data fetch failed:', error);
        return [];
      }
    }
    return [];
  }

  // Google Fit Integration
  async connectGoogleFit(): Promise<boolean> {
    try {
      if ('gapi' in window) {
        await (window as any).gapi.load('auth2', () => {});
        const authInstance = (window as any).gapi.auth2.getAuthInstance();
        
        const response = await authInstance.signIn({
          scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read'
        });
        
        return response.isSignedIn();
      }
      return false;
    } catch (error) {
      console.error('Google Fit connection failed:', error);
      return false;
    }
  }

  async getGoogleFitData(dataType: string, startDate: Date, endDate: Date): Promise<HealthAppData[]> {
    try {
      const response = await fetch(`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('google_access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aggregateBy: [{ dataTypeName: dataType }],
          bucketByTime: { durationMillis: 86400000 }, // 1 day buckets
          startTimeMillis: startDate.getTime(),
          endTimeMillis: endDate.getTime()
        })
      });

      const data = await response.json();
      
      return data.bucket?.map((bucket: any) => ({
        heartRate: bucket.dataset[0]?.point[0]?.value[0]?.fpVal,
        timestamp: new Date(parseInt(bucket.startTimeMillis))
      })) || [];
    } catch (error) {
      console.error('Google Fit data fetch failed:', error);
      return [];
    }
  }

  // Samsung Health Integration
  async connectSamsungHealth(): Promise<boolean> {
    try {
      if ('samsungHealth' in window) {
        const result = await (window as any).samsungHealth.connect({
          accessTypes: ['READ', 'WRITE'],
          dataTypes: ['com.samsung.shealth.heart_rate', 'com.samsung.shealth.step_count']
        });
        return result.isConnected;
      }
      return false;
    } catch (error) {
      console.error('Samsung Health connection failed:', error);
      return false;
    }
  }

  // Calendar Integrations
  async connectGoogleCalendar(): Promise<boolean> {
    try {
      if ('gapi' in window) {
        await (window as any).gapi.load('client:auth2', () => {});
        await (window as any).gapi.client.init({
          apiKey: process.env.VITE_GOOGLE_API_KEY,
          clientId: process.env.VITE_GOOGLE_CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: 'https://www.googleapis.com/auth/calendar'
        });

        const authInstance = (window as any).gapi.auth2.getAuthInstance();
        await authInstance.signIn();
        return authInstance.isSignedIn.get();
      }
      return false;
    } catch (error) {
      console.error('Google Calendar connection failed:', error);
      return false;
    }
  }

  async getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      const response = await (window as any).gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items?.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        description: event.description
      })) || [];
    } catch (error) {
      console.error('Calendar events fetch failed:', error);
      return [];
    }
  }

  async createMeditationEvent(date: Date, duration: number, title: string): Promise<boolean> {
    try {
      const event = {
        summary: title,
        description: `Meditation session scheduled through Respiro Balance`,
        start: {
          dateTime: date.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: new Date(date.getTime() + duration * 60000).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 10 }
          ]
        }
      };

      const response = await (window as any).gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      return response.status === 200;
    } catch (error) {
      console.error('Calendar event creation failed:', error);
      return false;
    }
  }

  // Wearable Device Management
  async scanForWearables(): Promise<WearableDevice[]> {
    const devices: WearableDevice[] = [];

    // Web Bluetooth for supported devices
    if ('bluetooth' in navigator) {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [
            { services: ['heart_rate'] },
            { namePrefix: 'Apple Watch' },
            { namePrefix: 'Fitbit' },
            { namePrefix: 'Garmin' }
          ]
        });

        devices.push({
          id: device.id,
          name: device.name || 'Unknown Device',
          type: this.detectDeviceType(device.name || ''),
          connected: device.gatt?.connected || false,
          lastSync: new Date()
        });
      } catch (error) {
        console.log('Bluetooth scan cancelled or failed:', error);
      }
    }

    return devices;
  }

  private detectDeviceType(deviceName: string): WearableDevice['type'] {
    const name = deviceName.toLowerCase();
    if (name.includes('apple')) return 'apple_watch';
    if (name.includes('fitbit')) return 'fitbit';
    if (name.includes('garmin')) return 'garmin';
    if (name.includes('samsung')) return 'samsung_watch';
    return 'apple_watch'; // default
  }

  // Smart Home Integration
  async connectAlexa(): Promise<boolean> {
    // Would integrate with Amazon Alexa Skills Kit
    try {
      const response = await fetch('/api/alexa/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.error('Alexa connection failed:', error);
      return false;
    }
  }

  async connectGoogleAssistant(): Promise<boolean> {
    // Would integrate with Google Assistant Actions
    try {
      const response = await fetch('/api/google-assistant/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.error('Google Assistant connection failed:', error);
      return false;
    }
  }

  // Real-time Data Sync
  async syncAllPlatforms(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    let successCount = 0;

    try {
      // Sync health data
      const healthData = await this.getAppleHealthData('HKQuantityTypeIdentifierHeartRate', 
        new Date(Date.now() - 24 * 60 * 60 * 1000), new Date());
      
      if (healthData.length > 0) {
        await this.uploadHealthData(healthData);
        successCount++;
      }
    } catch (error) {
      errors.push('Health data sync failed');
    }

    try {
      // Sync calendar events
      const events = await this.getCalendarEvents(new Date(), 
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      
      if (events.length > 0) {
        await this.processCalendarEvents(events);
        successCount++;
      }
    } catch (error) {
      errors.push('Calendar sync failed');
    }

    return {
      success: errors.length === 0,
      errors
    };
  }

  private async uploadHealthData(data: HealthAppData[]): Promise<void> {
    await fetch('/api/health-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  private async processCalendarEvents(events: CalendarEvent[]): Promise<void> {
    // Process calendar events for smart scheduling
    await fetch('/api/calendar-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events)
    });
  }
}

export const platformIntegrationsService = new PlatformIntegrationsService();
