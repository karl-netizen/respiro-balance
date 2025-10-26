
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requestPasswordReset } from "@/lib/authActions";
import { CheckCircle, Mail, ArrowLeft, AlertCircle, Circle, Clock, Shield } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormData = z.infer<typeof formSchema>;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAttempt, setLastAttempt] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const email = watch("email");

  // Rate limiting: 1 request per 60 seconds
  const RATE_LIMIT_SECONDS = 60;

  const onSubmit = async (data: FormData) => {
    setError(null);
    
    // Check rate limiting
    const now = Date.now();
    if (lastAttempt && (now - lastAttempt) < RATE_LIMIT_SECONDS * 1000) {
      const remaining = Math.ceil((RATE_LIMIT_SECONDS * 1000 - (now - lastAttempt)) / 1000);
      setError(`Please wait ${remaining} seconds before requesting another reset.`);
      setRemainingTime(remaining);
      
      // Update countdown
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return;
    }
    
    try {
      setLastAttempt(now);
      await requestPasswordReset(data.email, setLoading);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
      console.error("Password reset request error:", err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Brand Header */}
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
              <Circle className="h-10 w-10 text-respiro-dark fill-respiro-default" />
              <span className="text-2xl font-bold text-respiro-dark">Respiro Balance</span>
            </Link>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center space-y-4 pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription className="text-base">
                If an account with <strong>{email}</strong> exists, we've sent password reset instructions.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  What to do next:
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0" />
                    Check your email inbox and spam/junk folder
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0" />
                    Click the secure reset link in the email
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0" />
                    Create your new password following our security guidelines
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800">Security Notice</p>
                  <p className="text-orange-700 mt-1">
                    The reset link will expire in <strong>1 hour</strong> for your security. If you don't see the email within 5 minutes, check your spam folder.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setSuccess(false);
                    setError(null);
                    reset();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try Different Email
                </Button>
                
                <div className="text-center">
                  <Link
                    to="/auth"
                    className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Link */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Need help? Visit our{" "}
              <Link to="/help" className="text-primary hover:underline">
                support page
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <Circle className="h-10 w-10 text-respiro-dark fill-respiro-default" />
            <span className="text-2xl font-bold text-respiro-dark">Respiro Balance</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email address and we'll send you a secure link to reset your password.
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Secure Password Reset
            </CardTitle>
            <CardDescription>
              We'll send you a time-limited, secure reset link via email
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    {error}
                    {remainingTime > 0 && (
                      <div className="mt-1 text-xs opacity-75">
                        You can try again in {remainingTime} second{remainingTime !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your account email"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                  disabled={loading || remainingTime > 0}
                />
                {errors.email && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || remainingTime > 0}
                className="w-full"
              >
                {loading ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Sending Reset Link...
                  </>
                ) : remainingTime > 0 ? (
                  `Wait ${remainingTime}s`
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link
                  to="/auth"
                  className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Login
                </Link>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">Security & Privacy</p>
                    <ul className="space-y-1">
                      <li>• Reset links expire automatically in 1 hour</li>
                      <li>• Each link can only be used once</li>
                      <li>• We'll only send emails to registered accounts</li>
                      <li>• Rate limited to prevent abuse (1 request per minute)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/auth" className="text-primary hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
