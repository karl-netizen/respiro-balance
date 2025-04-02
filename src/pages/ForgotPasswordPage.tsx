
import React from 'react';
import { RequestResetForm } from "@/components/auth";
import { useState } from "react";
import { SuccessMessage } from "@/components/auth";

const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
  };

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <RequestResetForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
