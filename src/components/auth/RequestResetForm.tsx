
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const requestResetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type RequestResetFormData = z.infer<typeof requestResetSchema>;

interface RequestResetFormProps {
  onSuccess: () => void;
}

const RequestResetForm = ({ onSuccess }: RequestResetFormProps) => {
  const { forgotPassword, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestResetFormData>({
    resolver: zodResolver(requestResetSchema),
  });

  const handleRequestReset = async (data: RequestResetFormData) => {
    setError(null);
    try {
      await forgotPassword(data.email);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Reset your password</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit(handleRequestReset)} className="mt-8 space-y-6">
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
            <p className="mt-1 text-sm text-destructive">
              {errors.email.message}
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

export default RequestResetForm;
