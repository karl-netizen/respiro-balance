
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEmailSystem } from '@/hooks/useEmailSystem';

import { toast } from 'sonner';

export const EmailVerification: React.FC = () => {
  const { user } = useAuth();
  const { sendEmail, isLoading: emailLoading } = useEmailSystem();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsVerified(user.email_confirmed_at !== null);
      setIsLoading(false);
    }
  }, [user]);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    const success = await sendEmail(user.email, 'email_verification', {
      name: user.user_metadata?.full_name || 'User',
      verification_link: `${window.location.origin}/auth/verify?token=placeholder`
    });

    if (success) {
      toast.success('Verification email sent!', {
        description: 'Please check your inbox and spam folder.'
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto border-green-200">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-green-900">Email Verified!</CardTitle>
          <CardDescription>
            Your email address has been successfully verified.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto border-yellow-200">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <AlertCircle className="h-12 w-12 text-yellow-600" />
        </div>
        <CardTitle className="text-yellow-900">Verify Your Email</CardTitle>
        <CardDescription>
          Please verify your email address to access all features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-gray-600">
          We sent a verification link to: <br />
          <strong>{user?.email}</strong>
        </div>
        
        <Button 
          onClick={handleResendVerification}
          disabled={emailLoading}
          className="w-full"
          variant="outline"
        >
          {emailLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Resend Verification Email
        </Button>
      </CardContent>
    </Card>
  );
};
