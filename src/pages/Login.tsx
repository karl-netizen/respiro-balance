
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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800">
            Authentication is currently disabled for testing. You can click "Test Access" to bypass the login.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="mt-1"
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
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link to="/reset-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            
            <Button
              type="button"
              onClick={bypassAuth}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              Test Access
            </Button>
          </div>

          <div className="text-center text-sm">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-primary hover:text-primary/90">
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
