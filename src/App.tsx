
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ViewportToggle from '@/components/layout/ViewportToggle';
import { cn } from '@/lib/utils';
import RequireAuth from '@/components/auth/RequireAuth';

// Import your pages here
// For example:
// import Dashboard from '@/pages/Dashboard';
// import Login from '@/pages/Login';
// import Register from '@/pages/Register';

const App: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleViewportChange = (e: CustomEvent) => {
      setIsMobileView(e.detail.isMobile);
    };

    // @ts-ignore
    window.addEventListener('viewport-change', handleViewportChange);

    return () => {
      // @ts-ignore
      window.removeEventListener('viewport-change', handleViewportChange);
    };
  }, []);

  return (
    <div 
      className={cn(
        "min-h-screen w-full", 
        isMobileView && "max-w-[390px] mx-auto border-x border-border"
      )}
    >
      <ViewportToggle />
      <Routes>
        {/* Public routes */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
        
        {/* Protected routes */}
        {/* <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } /> */}
        
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
};

export default App;
