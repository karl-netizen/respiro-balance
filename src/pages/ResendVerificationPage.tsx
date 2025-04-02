
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { SuccessMessage } from "@/components/auth";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormData = z.infer<typeof formSchema>;

const ResendVerificationPage = () => {
  const { resendVerificationEmail, loading } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await resendVerificationEmail(data.email);
      setSuccess(true);
      toast.success("Verification email sent");
    } catch (err: any) {
      console.error("Error resending verification:", err);
      setError(err.message || "Failed to resend verification email");
    }
  };

  if (success) {
    return (
      <SuccessMessage
        title="Verification Email Sent"
        message="Please check your email for the verification link. If you don't see it, check your spam folder."
        buttonText="Back to Login"
        buttonLink="/login"
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Resend Verification Email</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Enter your email to receive a new verification link
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
