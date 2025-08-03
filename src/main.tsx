
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize environment validation and security
import { validateEnvironment } from '@/config/environment'
import { checkSecurityHeaders, logSecurityEvent } from '@/utils/security'

console.log('🚀 Starting Respiro Balance App...');

// Performance monitoring
const startTime = performance.now();

// Validate environment before app starts
try {
  validateEnvironment();
  checkSecurityHeaders();
  logSecurityEvent('Application startup', { env: import.meta.env.MODE });
} catch (error) {
  console.error('❌ Failed to initialize application:', error);
  // Show user-friendly error message
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a1a; color: #fff; font-family: system-ui;">
      <div style="text-align: center; max-width: 500px; padding: 2rem;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">⚠️ Configuration Error</h1>
        <p style="margin-bottom: 1rem;">The application is not properly configured. Please check your environment variables.</p>
        <details style="text-align: left; background: #2a2a2a; padding: 1rem; border-radius: 4px;">
          <summary style="cursor: pointer; margin-bottom: 0.5rem;">Error Details</summary>
          <pre style="font-size: 0.8rem; white-space: pre-wrap;">${error}</pre>
        </details>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #888;">
          Check the browser console for more details.
        </p>
      </div>
    </div>
  `;
  throw error;
}

// Error handling for missing assets
window.addEventListener('error', (e) => {
  if (e.filename && (e.filename.includes('.js') || e.filename.includes('.css'))) {
    console.error('❌ Asset loading error:', e.filename);
    logSecurityEvent('Asset loading error', { filename: e.filename }, 'error');
  }
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('❌ CRITICAL: Root element not found!');
  logSecurityEvent('Critical error', { error: 'Root element not found' }, 'error');
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>App Loading Error</h1><p>Root element not found. Please refresh the page.</p></div>';
} else {
  console.log('✅ Root element found, creating React app...');
  
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ App rendered successfully');
    
    // Log loading performance
    const loadTime = performance.now() - startTime;
    console.log(`✅ App loaded in ${Math.round(loadTime)}ms`);
    
    if (loadTime > 3000) {
      console.warn('⚠️ Slow loading detected:', loadTime + 'ms');
      logSecurityEvent('Performance warning', { loadTime }, 'warn');
    }
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    logSecurityEvent('App rendering error', { error: String(error) }, 'error');
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>App Loading Error</h1><p>Failed to initialize app. Check console for details.</p></div>';
  }
}
