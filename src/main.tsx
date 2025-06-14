
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx starting...');
console.log('React imported:', !!React);

const rootElement = document.getElementById("root");
console.log('Root element found:', !!rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} else {
  console.error('Root element not found!');
}
