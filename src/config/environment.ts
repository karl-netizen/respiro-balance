/**
 * Environment Configuration & Validation
 * Centralizes all environment variable handling with validation
 */

// Environment variable validation schema
interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    env: 'development' | 'production' | 'staging';
    siteUrl: string;
    demoMode: boolean;
  };
  features: {
    biometricIntegration: boolean;
    offlineMode: boolean;
  };
  security: {
    cspEnabled: boolean;
  };
}

// Validation helper
const getRequiredEnvVar = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Environment configuration with validation
export const env: EnvironmentConfig = {
  supabase: {
    url: getRequiredEnvVar('VITE_SUPABASE_URL'),
    anonKey: getRequiredEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
  app: {
    env: (import.meta.env.VITE_APP_ENV as any) || 'development',
    siteUrl: getRequiredEnvVar('VITE_SITE_URL', window.location.origin),
    demoMode: getBooleanEnvVar('VITE_DEMO_MODE', true),
  },
  features: {
    biometricIntegration: getBooleanEnvVar('VITE_ENABLE_BIOMETRIC_INTEGRATION', true),
    offlineMode: getBooleanEnvVar('VITE_ENABLE_OFFLINE_MODE', true),
  },
  security: {
    cspEnabled: getBooleanEnvVar('VITE_CSP_ENABLED', false),
  },
};

// Validation function to run at startup
export const validateEnvironment = (): void => {
  try {
    // Validate Supabase URL format
    new URL(env.supabase.url);
    
    // Validate anon key format (basic JWT structure check)
    if (!env.supabase.anonKey.match(/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/)) {
      throw new Error('Invalid Supabase anon key format');
    }
    
    // Validate app environment
    if (!['development', 'production', 'staging'].includes(env.app.env)) {
      throw new Error('Invalid APP_ENV. Must be: development, production, or staging');
    }
    
    // Security checks for production
    if (env.app.env === 'production') {
      if (env.app.demoMode) {
        console.warn('⚠️  Demo mode is enabled in production - this should be disabled for live deployments');
      }
      
      if (env.supabase.url.includes('localhost') || env.supabase.url.includes('127.0.0.1')) {
        throw new Error('Production environment cannot use localhost Supabase URL');
      }
    }
    
    console.log('✅ Environment validation passed');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    throw error;
  }
};

// Development helper
export const isDevelopment = env.app.env === 'development';
export const isProduction = env.app.env === 'production';
export const isDemoMode = env.app.demoMode;

// Export individual configs for convenience
export const supabaseConfig = env.supabase;
export const appConfig = env.app;
export const featureFlags = env.features;
export const securityConfig = env.security;