
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SuccessMessage } from "@/components/auth";
import { CheckCircle, AlertCircle } from "lucide-react";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    const verifyUserEmail = async () => {
      if (!token || type !== 'verify-email') {
        setStatus('error');
        setErrorMessage('Invalid verification link. Please request a new one.');
        return;
      }
      
      try {
        await verifyEmail(token);
        setStatus('success');
      } catch (err: any) {
        console.error('Error verifying email:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Failed to verify your email. Please try again.');
      }
    };
    
    verifyUserEmail();
  }, [searchParams, verifyEmail]);
  
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Verifying your email</h1>
          <p className="text-muted-foreground">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }
  
  if (status === 'success') {
    return (
      <SuccessMessage
        title="Email Verified Successfully"
        message="Your email has been successfully verified. You can now sign in to your account."
        buttonText="Sign In"
        buttonLink="/login"
        icon={<CheckCircle className="h-12 w-12 text-green-500" />}
      />
    );
  }
  
  // Error state
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-secondary/10 px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold">Verification Failed</h1>
        <p className="text-muted-foreground mb-6">
          {errorMessage}
        </p>
        <div className="flex flex-col space-y-3">
          <Button onClick={() => navigate('/resend-verification')}>
            Request New Verification
          </Button>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
