/**
 * Fitbit API Connector - OAuth + REST API Integration
 * Requires Fitbit Client ID from dev.fitbit.com
 */

export interface FitbitHeartRateData {
  heartRate: number;
  timestamp: number;
  time: string;
}

export interface FitbitAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

export class FitbitAPIConnector {
  private clientId: string;
  private redirectUri: string;
  private scope: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private userId: string | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;
  private onDataCallback: ((data: any) => void) | null = null;

  constructor(config?: Partial<FitbitAuthConfig>) {
    this.clientId = config?.clientId || import.meta.env.VITE_FITBIT_CLIENT_ID || '';
    this.redirectUri = config?.redirectUri || `${window.location.origin}/fitbit-callback`;
    this.scope = config?.scope || 'heartrate activity profile';
  }

  /**
   * Start OAuth flow - redirects to Fitbit authorization
   */
  startOAuthFlow(): void {
    if (!this.clientId) {
      throw new Error('Fitbit Client ID not configured. Get one from dev.fitbit.com');
    }

    const authUrl = `https://www.fitbit.com/oauth2/authorize?` +
      `response_type=token&` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `scope=${encodeURIComponent(this.scope)}&` +
      `expires_in=31536000`; // 1 year

    sessionStorage.setItem('fitbit_auth_state', 'pending');
    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback and extract tokens
   */
  handleOAuthCallback(): boolean {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    this.accessToken = params.get('access_token');
    this.userId = params.get('user_id');
    const expiresIn = params.get('expires_in');

    if (this.accessToken) {
      localStorage.setItem('fitbit_access_token', this.accessToken);
      localStorage.setItem('fitbit_user_id', this.userId || '');
      localStorage.setItem('fitbit_token_expiry', String(Date.now() + (Number(expiresIn) * 1000)));

      sessionStorage.removeItem('fitbit_auth_state');
      window.history.replaceState({}, document.title, window.location.pathname);

      return true;
    }

    return false;
  }

  /**
   * Check if already authenticated
   */
  isAuthenticated(): boolean {
    this.accessToken = localStorage.getItem('fitbit_access_token');
    this.userId = localStorage.getItem('fitbit_user_id');
    const expiry = localStorage.getItem('fitbit_token_expiry');

    if (this.accessToken && expiry && Date.now() < parseInt(expiry)) {
      return true;
    }

    this.logout();
    return false;
  }

  /**
   * Get current heart rate from Fitbit API
   * Note: Requires Intraday API approval from Fitbit
   */
  async getCurrentHeartRate(): Promise<FitbitHeartRateData | null> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Fitbit');
    }

    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch(
        `https://api.fitbit.com/1/user/${this.userId}/activities/heart/date/${today}/1d/1sec.json`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
          throw new Error('Authentication expired. Please reconnect.');
        }
        throw new Error(`Failed to fetch heart rate data: ${response.status}`);
      }

      const data = await response.json();

      const intradayData = data['activities-heart-intraday']?.dataset || [];
      if (intradayData.length > 0) {
        const latest = intradayData[intradayData.length - 1];
        return {
          heartRate: latest.value,
          timestamp: Date.now(),
          time: latest.time
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching Fitbit heart rate:', error);
      throw error;
    }
  }

  /**
   * Start polling for heart rate updates
   */
  startPolling(intervalMs: number = 15000): void {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Fitbit');
    }

    console.log('📊 Starting Fitbit heart rate polling...');

    this.pollHeartRate();

    this.pollingInterval = setInterval(() => {
      this.pollHeartRate();
    }, intervalMs);
  }

  /**
   * Stop polling
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('⏸️ Stopped Fitbit polling');
    }
  }

  /**
   * Internal polling function
   */
  private async pollHeartRate(): Promise<void> {
    try {
      const data = await this.getCurrentHeartRate();

      if (data && this.onDataCallback) {
        this.onDataCallback({
          type: 'heartrate',
          heartRate: data.heartRate,
          timestamp: data.timestamp,
          source: 'fitbit-api',
          isRealTime: false,
          deviceName: 'Fitbit Device'
        });
      }
    } catch (error: any) {
      console.error('Polling error:', error);

      if (this.onDataCallback) {
        this.onDataCallback({
          type: 'error',
          message: error.message
        });
      }
    }
  }

  /**
   * Set callback for data updates
   */
  onData(callback: (data: any) => void): void {
    this.onDataCallback = callback;
  }

  /**
   * Get user profile info
   */
  async getUserProfile(): Promise<any> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Fitbit');
    }

    try {
      const response = await fetch(
        `https://api.fitbit.com/1/user/${this.userId}/profile.json`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Logout and clear tokens
   */
  logout(): void {
    localStorage.removeItem('fitbit_access_token');
    localStorage.removeItem('fitbit_user_id');
    localStorage.removeItem('fitbit_token_expiry');
    this.accessToken = null;
    this.userId = null;
    this.stopPolling();
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isAuthenticated: this.isAuthenticated(),
      isPolling: this.pollingInterval !== null,
      userId: this.userId
    };
  }
}
