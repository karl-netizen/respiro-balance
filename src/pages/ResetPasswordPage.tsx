
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RequestResetForm, ConfirmResetForm, SuccessMessage } from "@/components/auth";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);

  // Check if this is a password reset confirmation (has token in URL)
  const isResetConfirmation = !!searchParams.get('type') && searchParams.get('type') === 'recovery';

  const handleSuccess = () => {
    setSuccess(true);
  };

  // Request password reset form
  const renderRequestForm = () => {
    if (success) {
      return (
        <SuccessMessage
          title="Check your email"
          message="If an account exists with that email, we've sent password reset instructions."
          buttonText="Back to Login"
          buttonLink="/login"
        />
      );
    }

    return <RequestResetForm onSuccess={handleSuccess} />;
  };

  // Confirm password reset form (when user clicks link from email)
  const renderConfirmForm = () => {
    if (success) {
      return (
        <SuccessMessage
          title="Password Reset Successful"
          message="Your password has been reset successfully."
          buttonText="Sign in with new password"
          buttonLink="/login"
        />
      );
    }

    return <ConfirmResetForm onSuccess={handleSuccess} />;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {isResetConfirmation ? renderConfirmForm() : renderRequestForm()}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
