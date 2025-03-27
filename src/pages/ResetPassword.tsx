
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "react-router-dom";

const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const confirmResetSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RequestResetFormData = z.infer<typeof requestResetSchema>;
type ConfirmResetFormData = z.infer<typeof confirmResetSchema>;

const ResetPassword = () => {
  const { forgotPassword, resetPassword, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if this is a password reset confirmation (has token in URL)
  const isResetConfirmation = !!searchParams.get('type') && searchParams.get('type') === 'recovery';

  const requestResetForm = useForm<RequestResetFormData>({
    resolver: zodResolver(requestResetSchema),
  });

  const confirmResetForm = useForm<ConfirmResetFormData>({
    resolver: zodResolver(confirmResetSchema),
  });

  const handleRequestReset = async (data: RequestResetFormData) => {
    setError(null);
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    }
  };

  const handleConfirmReset = async (data: ConfirmResetFormData) => {
    setError(null);
    try {
      await resetPassword(data.password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    }
  };

  // Request password reset form
  const renderRequestForm = () => {
    if (success) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Check your email</h2>
          <p className="mt-2 text-muted-foreground">
            If an account exists with that email, we've sent password reset instructions.
          </p>
          <Link to="/login">
            <Button className="mt-6">Back to Login</Button>
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Reset your password</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <form onSubmit={requestResetForm.handleSubmit(handleRequestReset)} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...requestResetForm.register("email")}
              className="mt-1"
            />
            {requestResetForm.formState.errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {requestResetForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            {loading ? "Sending..." : "Send reset link"}
          </Button>

          <div className="text-center text-sm">
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              Back to login
            </Link>
          </div>
        </form>
      </>
    );
  };

  // Confirm password reset form (when user clicks link from email)
  const renderConfirmForm = () => {
    if (success) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Password Reset Successful</h2>
          <p className="mt-2 text-muted-foreground">
            Your password has been reset successfully.
          </p>
          <Link to="/login">
            <Button className="mt-6">Sign in with new password</Button>
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Create a new password</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Enter and confirm your new password
          </p>
        </div>

        <form onSubmit={confirmResetForm.handleSubmit(handleConfirmReset)} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...confirmResetForm.register("password")}
                className="mt-1"
              />
              {confirmResetForm.formState.errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {confirmResetForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...confirmResetForm.register("confirmPassword")}
                className="mt-1"
              />
              {confirmResetForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {confirmResetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            {loading ? "Updating password..." : "Update password"}
          </Button>
        </form>
      </>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {isResetConfirmation ? renderConfirmForm() : renderRequestForm()}
      </div>
    </div>
  );
};

export default ResetPassword;
