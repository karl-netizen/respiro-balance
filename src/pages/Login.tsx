
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/lib/authActions";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DemoModeToggle from "@/components/auth/DemoModeToggle";
import { useDemoMode } from "@/hooks/useDemoMode";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isDemoMode, loginDemo } = useDemoMode();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      // We'll handle the loading state in this component rather than relying on the authActions
      setLoading(true);
      await signInWithEmail(data.email, data.password, navigate, () => {});
      // We don't set loading to false here because the navigation will unmount this component
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      console.error("Login error:", err);
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (isDemoMode) {
      setLoading(true);
      const demoUser = loginDemo();
      
      if (demoUser) {
        toast.success("Welcome to Demo Mode!", {
          description: "Exploring with premium features and sample data"
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } else {
      toast.error("Demo mode is not enabled");
    }
  };

  const bypassAuth = () => {
    console.log("DIRECT BYPASS: Sending user to dashboard");
    
    // Notify user
    toast("Test Mode Active", {
      description: "Bypassed authentication for testing"
    });
    
    // Direct navigation - hardcoded approach
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome back</h1>
          <p className="mt-2 text-lg text-muted-foreground">Sign in to your Respiro Balance account</p>
        </div>

        <DemoModeToggle />

        {isDemoMode ? (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-800">
              <strong>Demo Mode Active:</strong> Click "Enter Demo" for instant access with premium features and sample data.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              <strong>Live Mode Active:</strong> Use your real account credentials to sign in.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isDemoMode ? (
            // Demo Mode UI
            <div className="space-y-4">
              <div className="text-center p-6 border-2 border-dashed border-amber-300 rounded-lg bg-amber-50">
                <div className="text-lg font-semibold text-amber-800 mb-2">Demo Mode</div>
                <p className="text-sm text-amber-700 mb-4">
                  Experience Respiro Balance with premium features, 7-day meditation streak, 
                  and rich sample data. Perfect for demos and testing.
                </p>
                <Button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3"
                  size="lg"
                >
                  {loading ? "Entering Demo..." : "🚀 Enter Demo Mode"}
                </Button>
              </div>
            </div>
          ) : (
            // Live Mode UI
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className="mt-1"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className="mt-1"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end">
                <Link to="/reset-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  size="lg"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                
                <Button
                  type="button"
                  onClick={bypassAuth}
                  variant="outline"
                  className="w-full text-sm"
                >
                  Development Bypass
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-sm">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:text-primary/90">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
