
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const confirmResetSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ConfirmResetFormData = z.infer<typeof confirmResetSchema>;

interface ConfirmResetFormProps {
  onSuccess: () => void;
}

const ConfirmResetForm = ({ onSuccess }: ConfirmResetFormProps) => {
  const { resetPassword, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmResetFormData>({
    resolver: zodResolver(confirmResetSchema),
  });

  const handleConfirmReset = async (data: ConfirmResetFormData) => {
    setError(null);
    try {
      await resetPassword(data.password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Create a new password</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Enter and confirm your new password
        </p>
      </div>

      <form onSubmit={handleSubmit(handleConfirmReset)} className="mt-8 space-y-6">
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
              {...register("password")}
              className="mt-1"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className="mt-1"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive">
                {errors.confirmPassword.message}
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

export default ConfirmResetForm;
