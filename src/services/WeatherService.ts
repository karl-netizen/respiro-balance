
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  description: string;
}

export class WeatherService {
  private static readonly CACHE_KEY = 'weather_data';
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  static async getCurrentWeather(lat?: number, lon?: number): Promise<WeatherData | null> {
    try {
      // Check cache first
      const cached = this.getCachedWeather();
      if (cached) return cached;

      // For demo purposes, return mock weather data
      // In production, you would integrate with a weather API like OpenWeatherMap
      const mockWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 30) + 60, // 60-90°F
        condition: ['sunny', 'cloudy', 'rainy', 'partly_cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        description: 'Perfect weather for indoor wellness activities'
      };

      this.cacheWeather(mockWeather);
      return mockWeather;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  private static getCachedWeather(): WeatherData | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  private static cacheWeather(data: WeatherData): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching weather:', error);
    }
  }
}
