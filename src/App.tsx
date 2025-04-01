
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserPreferencesProvider } from "@/context";
import { AuthProvider } from "@/providers/AuthProvider"; // Updated import 
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CoachDashboard from "./components/coach/CoachDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Breathe from "./pages/Breathe";
import Progress from "./pages/Progress";
import Meditate from "./pages/Meditate";
import FAQ from "./pages/FAQ";
import MorningRitual from "./pages/MorningRitual";
import { Suspense, lazy } from "react";

// Create a new query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: import.meta.env.PROD, // Only in production
    },
  },
});

// Modified ProtectedRoute to always allow access in testing mode
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // No auth check - simply render children directly
  return <>{children}</>;
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserPreferencesProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Dashboard />} /> {/* Changed to redirect to Dashboard */}
              <Route path="/login" element={<Navigate to="/dashboard" />} /> {/* Redirect login to dashboard */}
              <Route path="/register" element={<Navigate to="/dashboard" />} /> {/* Redirect register to dashboard */}
              <Route path="/reset-password" element={<Navigate to="/dashboard" />} /> {/* Redirect reset to dashboard */}
              <Route path="/faq" element={<FAQ />} />
              
              {/* All routes are now directly accessible */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/coach-dashboard" element={<CoachDashboard />} />
              <Route path="/breathe" element={<Breathe />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/meditate" element={<Meditate />} />
              <Route path="/morning-ritual" element={<MorningRitual />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserPreferencesProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
