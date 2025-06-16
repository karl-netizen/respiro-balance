
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileForm, MobileFormField } from "@/components/ui/mobile-form";
import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import { signUpWithEmail } from "@/lib/authActions";
import { toast } from "sonner";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    setLoading(true);
    
    try {
      // Direct call to the signUpWithEmail function from authActions
      await signUpWithEmail(data.email, data.password, data.firstName, setLoading);
      
      setSuccess(true);
      toast("Account created successfully", {
        description: "Please check your email to verify your account"
      });
      
      // In development, auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      console.error("Signup error:", err);
      toast("Signup failed", {
        description: err.message || "There was a problem creating your account"
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Check your email</h1>
          <p className="text-lg text-muted-foreground">
            We've sent you a confirmation link. Please check your email to complete your registration.
          </p>
          <Link to="/login">
            <TouchFriendlyButton className="mt-4">Back to Login</TouchFriendlyButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Create your account</h1>
          <p className="mt-2 text-lg text-muted-foreground">Sign up for Respiro Balance</p>
        </div>

        <MobileForm onSubmit={handleSubmit(onSubmit)} spacing="normal">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <MobileFormField label="First Name" error={errors.firstName?.message} required>
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              preventZoom={true}
              {...register("firstName")}
            />
          </MobileFormField>

          <MobileFormField label="Email" error={errors.email?.message} required>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              preventZoom={true}
              {...register("email")}
            />
          </MobileFormField>

          <MobileFormField label="Password" error={errors.password?.message} required>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              preventZoom={true}
              {...register("password")}
            />
          </MobileFormField>

          <MobileFormField label="Confirm Password" error={errors.confirmPassword?.message} required>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              preventZoom={true}
              {...register("confirmPassword")}
            />
          </MobileFormField>

          <TouchFriendlyButton
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white hover:bg-primary/90"
            spacing="relaxed"
          >
            {loading ? "Creating account..." : "Create account"}
          </TouchFriendlyButton>

          <div className="text-center text-sm mt-6">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded touch-manipulation">
                Sign in
              </Link>
            </p>
          </div>
        </MobileForm>
      </div>
    </div>
  );
};

export default SignupPage;
