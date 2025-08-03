
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { 
  AlertCircle, 
  Check, 
  Eye, 
  EyeOff, 
  Shield, 
  Lock,
  Zap
} from "lucide-react";

const confirmResetSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ConfirmResetFormData>({
    resolver: zodResolver(confirmResetSchema),
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Calculate password strength
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.match(/[a-z]/)) strength += 25;
    if (pwd.match(/[A-Z]/)) strength += 25;
    if (pwd.match(/[0-9]/)) strength += 15;
    if (pwd.match(/[^a-zA-Z0-9]/)) strength += 10;
    
    return Math.min(strength, 100);
  };

  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password || ""));
  }, [password]);

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "bg-red-500";
    if (strength < 60) return "bg-yellow-500";
    if (strength < 80) return "bg-orange-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

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
    <Card className="border-0 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Create New Password</CardTitle>
        <CardDescription>
          Enter a strong password that meets our security requirements
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleConfirmReset)} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <div className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  {...register("password")}
                  className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Password strength:
                    </span>
                    <span className={`font-medium ${passwordStrength >= 80 ? 'text-green-600' : passwordStrength >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                  {...register("confirmPassword")}
                  className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && password === confirmPassword && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-3 h-3" />
                  Passwords match
                </div>
              )}

              {errors.confirmPassword && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Password Requirements:
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className={`flex items-center gap-2 ${password && password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {password && password.length >= 8 ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
                At least 8 characters
              </div>
              <div className={`flex items-center gap-2 ${password && password.match(/[a-z]/) ? 'text-green-600' : 'text-muted-foreground'}`}>
                {password && password.match(/[a-z]/) ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
                One lowercase letter (a-z)
              </div>
              <div className={`flex items-center gap-2 ${password && password.match(/[A-Z]/) ? 'text-green-600' : 'text-muted-foreground'}`}>
                {password && password.match(/[A-Z]/) ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
                One uppercase letter (A-Z)
              </div>
              <div className={`flex items-center gap-2 ${password && password.match(/[0-9]/) ? 'text-green-600' : 'text-muted-foreground'}`}>
                {password && password.match(/[0-9]/) ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
                One number (0-9)
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || passwordStrength < 60 || password !== confirmPassword}
            className="w-full"
          >
            {loading ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Updating Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium">Security Notice</p>
                <p className="mt-1">
                  After updating your password, all existing sessions will be terminated for security. 
                  You'll need to sign in again with your new password.
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConfirmResetForm;
