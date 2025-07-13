
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Starting Respiro Balance App...');

// Performance monitoring
const startTime = performance.now();

// Error handling for missing assets
window.addEventListener('error', (e) => {
  if (e.filename && (e.filename.includes('.js') || e.filename.includes('.css'))) {
    console.error('❌ Asset loading error:', e.filename);
    // You could implement retry logic here
  }
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('❌ CRITICAL: Root element not found!');
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
    }
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>App Loading Error</h1><p>Failed to initialize app. Check console for details.</p></div>';
  }
}
